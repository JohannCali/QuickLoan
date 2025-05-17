// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITrustOracle {
    function getTrustScore(address uer) external view returns (uint256);
}

contract LoanProtocol {
    ITrustOracle public oracle;
    IERC20 public immutable asset; // token emprunté/déposé

    // soldes déposées et dettes
    mapping(address => uint256) public deposits;
    mapping(address => uint256) public debts;
    mapping(address => uint8)   public bonusTier;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);

    constructor(address _asset, address _oracle) {
        asset  = IERC20(_asset);
        oracle = ITrustOracle(_oracle);
    }

    // --- Onglet Supply ---
    function supply(uint256 amount) external {
        require(amount > 0, "Amount > 0");
        deposits[msg.sender] += amount;
        require(asset.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0 && deposits[msg.sender] >= amount, "Insufficient balance");
        deposits[msg.sender] -= amount;
        require(asset.transfer(msg.sender, amount), "Transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    // --- Onglet Borrow ---
    function borrow(uint256 amount) external {
        require(amount > 0, "Amount > 0");
        uint256 score    = oracle.getTrustScore(msg.sender);
        uint256 maxLoan  = _amountAllowed(score, msg.sender);
        require(amount <= maxLoan, "Borrow limit exceeded");

        debts[msg.sender] += amount;
        require(asset.transfer(msg.sender, amount), "Transfer failed");
        emit Borrowed(msg.sender, amount);
    }

    // --- Onglet Repay ---
    function repay(uint256 amount) external {
        require(amount > 0 && debts[msg.sender] >= amount, "Invalid repay amount");
        debts[msg.sender] -= amount;
        require(asset.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // mise à jour du bonusTier sur remboursé à temps
        _updateBonus(msg.sender);
        emit Repaid(msg.sender, amount);
    }

    // Vue client : solde déposé, dette et reste à rembourser
    function getUserInfo(address user) external view returns (
        uint256 deposited,
        uint256 borrowed,
        uint256 remaining,
        uint256 trustScore,
        uint8   tier
    ) {
        deposited  = deposits[user];
        borrowed   = debts[user];
        remaining  = debts[user];
        trustScore = oracle.getTrustScore(user);
        tier       = bonusTier[user];
    }

    // Calcul de la limite de prêt avec bonus
    function _amountAllowed(uint256 score, address user) internal view returns (uint256) {
        uint256 base = score;
        uint256 bonus = (base * bonusTier[user]) / 100;
        return base + bonus;
    }

    // Exemple de logique d'évolution de bonus
    function _updateBonus(address user) internal {
        if (bonusTier[user] < 25) {
            bonusTier[user] += 5;
        }
    }
}