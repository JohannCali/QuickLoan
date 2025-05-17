
import React, { useState } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Entity = {
  id: string;
  name: string;
  description: string;
  attributes: { name: string; type: string; description: string }[];
};

type Relationship = {
  source: string;
  target: string;
  label: string;
  cardinality: string;
};

const EntityNode: React.FC<{
  entity: Entity;
  isActive: boolean;
  onClick: () => void;
}> = ({ entity, isActive, onClick }) => (
  <div
    className={cn(
      "relative border rounded-xl p-4 transition-all cursor-pointer",
      isActive
        ? "border-aave-accent bg-aave-blue-gray aave-glow"
        : "border-aave-light-blue bg-aave-blue-gray/50 hover:border-aave-accent/50"
    )}
    onClick={onClick}
  >
    <h3 className="font-semibold text-lg mb-2">{entity.name}</h3>
    <p className="text-sm text-gray-400 mb-3">{entity.description}</p>
    {isActive && (
      <div className="mt-4 border-t border-aave-light-blue pt-3">
        <h4 className="text-xs uppercase text-gray-400 mb-2">Key Attributes</h4>
        <div className="space-y-2">
          {entity.attributes.slice(0, 4).map((attr) => (
            <div key={attr.name} className="grid grid-cols-3 gap-2 text-sm">
              <div className="font-medium">{attr.name}</div>
              <div className="text-gray-400">{attr.type}</div>
              <div className="text-xs text-gray-500">{attr.description}</div>
            </div>
          ))}
          {entity.attributes.length > 4 && (
            <div className="text-xs text-aave-accent mt-2">
              +{entity.attributes.length - 4} more attributes
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

const RelationshipArrow: React.FC<{
  relationship: Relationship;
  activeEntity: string | null;
}> = ({ relationship, activeEntity }) => {
  const isActive =
    activeEntity === relationship.source || activeEntity === relationship.target;

  return (
    <div
      className={cn(
        "flex items-center py-2",
        isActive ? "text-aave-accent" : "text-gray-400"
      )}
    >
      <div className="w-1/3 text-right pr-2">
        {relationship.source === activeEntity ? (
          <span className="font-semibold">{relationship.source}</span>
        ) : (
          relationship.source
        )}
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className={cn("text-xs mb-1", isActive ? "text-aave-accent" : "text-gray-500")}>
          {relationship.label}
        </div>
        <div className="w-full flex items-center">
          <div className="h-[1px] flex-grow bg-current"></div>
          <div className="px-2 text-xs">{relationship.cardinality}</div>
          <div className="h-[1px] flex-grow bg-current"></div>
        </div>
      </div>
      <div className="w-1/3 pl-2">
        {relationship.target === activeEntity ? (
          <span className="font-semibold">{relationship.target}</span>
        ) : (
          relationship.target
        )}
      </div>
    </div>
  );
};

const Schema = () => {
  const [activeEntity, setActiveEntity] = useState<string | null>(null);

  const entities: Entity[] = [
    {
      id: "user",
      name: "User",
      description: "Represents a registered borrower in the protocol",
      attributes: [
        { name: "user_id", type: "string", description: "Unique identifier" },
        { name: "name", type: "string", description: "User's name" },
        { name: "email", type: "string", description: "Contact email" },
        { name: "creation_date", type: "Date", description: "When user joined" },
        { name: "country", type: "string", description: "User's country" },
      ],
    },
    {
      id: "wallet",
      name: "Wallet",
      description: "Blockchain address owned by a user",
      attributes: [
        { name: "wallet_id", type: "string", description: "Unique identifier" },
        { name: "user_id", type: "string", description: "Owner reference" },
        { name: "address", type: "string", description: "Public address" },
        { name: "date_creation", type: "Date", description: "Creation date" },
        { name: "type", type: "enum", description: "Wallet type" },
        { name: "status", type: "enum", description: "Active/Inactive" },
      ],
    },
    {
      id: "asset",
      name: "Asset",
      description: "Cryptocurrencies or tokens accepted by the protocol",
      attributes: [
        { name: "asset_id", type: "string", description: "Unique identifier" },
        { name: "name", type: "string", description: "Asset name" },
        { name: "symbol", type: "string", description: "Asset symbol" },
        { name: "type", type: "enum", description: "Asset type" },
        { name: "current_price", type: "number", description: "Market price" },
      ],
    },
    {
      id: "collateral",
      name: "Collateral",
      description: "Assets deposited as guarantee for loans",
      attributes: [
        { name: "collateral_id", type: "string", description: "Unique identifier" },
        { name: "loan_id", type: "string", description: "Associated loan" },
        { name: "asset_id", type: "string", description: "Asset deposited" },
        { name: "amount", type: "number", description: "Amount deposited" },
        { name: "deposit_date", type: "Date", description: "When deposited" },
        { name: "ltv_ratio", type: "number", description: "Loan-to-value ratio" },
      ],
    },
    {
      id: "loan",
      name: "Loan",
      description: "Borrowing request that locks collateral",
      attributes: [
        { name: "loan_id", type: "string", description: "Unique identifier" },
        { name: "user_id", type: "string", description: "Borrower" },
        { name: "wallet_id", type: "string", description: "Borrower's wallet" },
        { name: "amount_borrowed", type: "number", description: "Principal amount" },
        { name: "amount_remaining", type: "number", description: "Amount due" },
        { name: "interest_rate", type: "number", description: "APY rate" },
        { name: "start_date", type: "Date", description: "Loan start date" },
        { name: "due_date", type: "Date", description: "Maturity date" },
        { name: "status", type: "enum", description: "Open/Closed/Default" },
      ],
    },
    {
      id: "repayment",
      name: "Repayment",
      description: "Partial payment of a loan",
      attributes: [
        { name: "repayment_id", type: "string", description: "Unique identifier" },
        { name: "loan_id", type: "string", description: "Associated loan" },
        { name: "due_date", type: "Date", description: "Payment deadline" },
        { name: "amount_due", type: "number", description: "Amount to pay" },
        { name: "amount_paid", type: "number", description: "Amount paid" },
        { name: "payment_date", type: "Date", description: "When paid" },
        { name: "late", type: "boolean", description: "Payment is late" },
        { name: "penalty", type: "number", description: "Late fee" },
      ],
    },
    {
      id: "onChainActivity",
      name: "OnChainActivity",
      description: "Transaction history from wallet",
      attributes: [
        { name: "activity_id", type: "string", description: "Unique identifier" },
        { name: "wallet_id", type: "string", description: "Associated wallet" },
        { name: "date", type: "Date", description: "Activity timestamp" },
        { name: "type", type: "enum", description: "Activity type" },
        { name: "amount", type: "number", description: "Amount involved" },
        { name: "remote_address", type: "string", description: "Counterparty" },
        { name: "suspicious", type: "boolean", description: "Risk flag" },
      ],
    },
    {
      id: "trustScore",
      name: "TrustScore",
      description: "On-chain behavior reputation score",
      attributes: [
        { name: "trustscore_id", type: "string", description: "Unique identifier" },
        { name: "user_id", type: "string", description: "Associated user" },
        { name: "score", type: "number", description: "0-100 score" },
        { name: "calculation_date", type: "Date", description: "Last updated" },
      ],
    },
    {
      id: "borrowHistory",
      name: "BorrowHistory",
      description: "Summary of user's past loans",
      attributes: [
        { name: "history_id", type: "string", description: "Unique identifier" },
        { name: "user_id", type: "string", description: "Associated user" },
        { name: "total_loans", type: "number", description: "Number of loans" },
        { name: "total_remaining", type: "number", description: "Outstanding debt" },
        { name: "default_count", type: "number", description: "Defaults count" },
        { name: "repayment_rate", type: "number", description: "% repaid on time" },
      ],
    },
    {
      id: "kycFile",
      name: "KYCFile",
      description: "Off-chain identity verification dossier",
      attributes: [
        { name: "kyc_id", type: "string", description: "Unique identifier" },
        { name: "user_id", type: "string", description: "Associated user" },
        { name: "submission_date", type: "Date", description: "When submitted" },
        { name: "status", type: "enum", description: "Approval status" },
      ],
    },
    {
      id: "identityDocument",
      name: "IdentityDocument",
      description: "KYC supporting documentation",
      attributes: [
        { name: "doc_id", type: "string", description: "Unique identifier" },
        { name: "kyc_id", type: "string", description: "KYC dossier" },
        { name: "type", type: "enum", description: "Document type" },
        { name: "issue_date", type: "Date", description: "Date issued" },
        { name: "validation_status", type: "enum", description: "Verification status" },
      ],
    },
    {
      id: "riskScore",
      name: "RiskScore",
      description: "Final AI-generated creditworthiness score",
      attributes: [
        { name: "riskscore_id", type: "string", description: "Unique identifier" },
        { name: "user_id", type: "string", description: "Associated user" },
        { name: "score", type: "number", description: "300-850 score" },
        { name: "calculation_date", type: "Date", description: "Last updated" },
      ],
    },
  ];

  const relationships: Relationship[] = [
    {
      source: "User",
      target: "Wallet",
      label: "owns",
      cardinality: "1:N",
    },
    {
      source: "Wallet",
      target: "User",
      label: "belongs to",
      cardinality: "N:1",
    },
    {
      source: "User",
      target: "Loan",
      label: "borrows",
      cardinality: "1:N",
    },
    {
      source: "Loan",
      target: "Collateral",
      label: "secured by",
      cardinality: "1:N",
    },
    {
      source: "Loan",
      target: "Repayment",
      label: "repaid via",
      cardinality: "1:N",
    },
    {
      source: "Wallet",
      target: "Asset",
      label: "contains",
      cardinality: "N:N",
    },
    {
      source: "User",
      target: "BorrowHistory",
      label: "has",
      cardinality: "1:1",
    },
    {
      source: "Wallet",
      target: "OnChainActivity",
      label: "records",
      cardinality: "1:N",
    },
    {
      source: "OnChainActivity",
      target: "TrustScore",
      label: "influences",
      cardinality: "N:1",
    },
    {
      source: "User",
      target: "TrustScore",
      label: "rated by",
      cardinality: "1:1",
    },
    {
      source: "User",
      target: "RiskScore",
      label: "evaluated with",
      cardinality: "1:1",
    },
    {
      source: "KYCFile",
      target: "User",
      label: "belongs to",
      cardinality: "1:1",
    },
    {
      source: "IdentityDocument",
      target: "KYCFile",
      label: "included in",
      cardinality: "N:1",
    },
    {
      source: "RiskScore",
      target: "TrustScore",
      label: "incorporates",
      cardinality: "1:1",
    },
    {
      source: "RiskScore",
      target: "BorrowHistory",
      label: "analyzes",
      cardinality: "1:1",
    },
  ];

  return (
    <SidebarLayout>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Data Model Schema</h2>
              <div className="space-x-3">
                <Button variant="outline" className="border-aave-light-blue text-white">
                  Download Schema
                </Button>
              </div>
            </div>

            <Tabs defaultValue="visual">
              <TabsList className="bg-aave-light-blue/20 border border-aave-light-blue/50 mb-6">
                <TabsTrigger value="visual">Visual Schema</TabsTrigger>
                <TabsTrigger value="relationships">Relationships</TabsTrigger>
                <TabsTrigger value="scenarios">Loan Scenarios</TabsTrigger>
              </TabsList>

              <TabsContent value="visual">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {entities.map((entity) => (
                    <EntityNode
                      key={entity.id}
                      entity={entity}
                      isActive={activeEntity === entity.name}
                      onClick={() => setActiveEntity(activeEntity === entity.name ? null : entity.name)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="relationships">
                <Card className="bg-aave-darker border-aave-light-blue">
                  <CardHeader>
                    <CardTitle>Entity Relationships</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {relationships.map((rel, idx) => (
                      <RelationshipArrow
                        key={idx}
                        relationship={rel}
                        activeEntity={activeEntity}
                      />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scenarios">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-aave-blue-gray border-aave-light-blue">
                    <CardHeader>
                      <CardTitle>Scenario 1: New Borrower</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg bg-aave-darker p-4 mb-4 border border-aave-light-blue text-sm">
                        <p className="mb-2">Alice creates a new wallet and deposits 3,000 USDC as collateral for a 2,000 € loan.</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-400">
                          <li>New User (Alice) with new Wallet</li>
                          <li>No BorrowHistory, limited OnChainActivity</li>
                          <li>Low/Medium TrustScore due to new wallet</li>
                          <li>No KYCFile required (loan ≤ collateral)</li>
                          <li>RiskScore calculated primarily on collateral ratio</li>
                          <li>Loan approved with standard terms</li>
                        </ul>
                      </div>

                      <div className="text-sm text-gray-400">
                        <p className="mb-2">
                          <strong className="text-white">Key Entity Interaction:</strong> The AI uses the wallet age and transaction data to establish a baseline TrustScore. 
                          Since the loan is fully collateralized, the risk is minimal.
                        </p>
                        <p>
                          <strong className="text-white">Result:</strong> Each timely Repayment improves Alice&apos;s BorrowHistory and TrustScore for future loans.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-aave-blue-gray border-aave-light-blue">
                    <CardHeader>
                      <CardTitle>Scenario 2: Experienced Borrower with KYC</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg bg-aave-darker p-4 mb-4 border border-aave-light-blue text-sm">
                        <p className="mb-2">
                          Bob has a wallet that&apos;s 2 years old with good history. He wants to borrow 30,000 € with only 5,000 € of ETH as collateral.
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-400">
                          <li>Existing User (Bob) with mature Wallet</li>
                          <li>Rich OnChainActivity and positive BorrowHistory</li>
                          <li>High TrustScore based on blockchain behavior</li>
                          <li>KYCFile required and submitted (loan &gt; collateral)</li>
                          <li>RiskScore combines on-chain data with KYC verification</li>
                          <li>Loan approved with favorable terms</li>
                        </ul>
                      </div>

                      <div className="text-sm text-gray-400">
                        <p className="mb-2">
                          <strong className="text-white">Key Entity Interaction:</strong> The AI evaluates both Bob&apos;s excellent on-chain reputation (TrustScore) 
                          and verified off-chain identity documents (KYCFile).
                        </p>
                        <p>
                          <strong className="text-white">Result:</strong> Bob receives a 30,000 € loan despite providing only 5,000 € in collateral, 
                          demonstrating how the hybrid system enables under-collateralized lending to trusted users.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-aave-blue-gray border-aave-light-blue">
                    <CardHeader>
                      <CardTitle>Scenario 3: Borrower in Default</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg bg-aave-darker p-4 mb-4 border border-aave-light-blue text-sm">
                        <p className="mb-2">
                          Charlie borrowed 10,000 € six months ago (with 12,000 € collateral) but has been weeks late on a payment.
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-400">
                          <li>BorrowHistory updated with default_count=1</li>
                          <li>Repayment record marked with late=true</li>
                          <li>TrustScore decreases significantly</li>
                          <li>RiskScore recalculated to reflect higher risk</li>
                          <li>Future loans subject to higher interest rates</li>
                          <li>May require additional collateral for new loans</li>
                        </ul>
                      </div>

                      <div className="text-sm text-gray-400">
                        <p className="mb-2">
                          <strong className="text-white">Key Entity Interaction:</strong> Late Repayment affects BorrowHistory, 
                          which the AI uses to adjust TrustScore and RiskScore.
                        </p>
                        <p>
                          <strong className="text-white">Result:</strong> Charlie faces stricter borrowing terms, demonstrating how the 
                          protocol rewards responsible behavior and penalizes defaults through dynamic risk assessment.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-aave-blue-gray border-aave-light-blue">
                    <CardHeader>
                      <CardTitle>AI Credit Scoring Process</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="rounded-lg bg-aave-darker p-4 border border-aave-light-blue">
                          <h4 className="font-medium mb-2">On-Chain Data Analysis</h4>
                          <p className="text-sm text-gray-400">
                            AI analyzes Wallet age, transaction patterns in OnChainActivity, 
                            interaction with trusted/flagged addresses, and network behavior to calculate TrustScore.
                          </p>
                        </div>
                        
                        <div className="rounded-lg bg-aave-darker p-4 border border-aave-light-blue">
                          <h4 className="font-medium mb-2">Protocol Behavior Analysis</h4>
                          <p className="text-sm text-gray-400">
                            Reviews BorrowHistory metrics like repayment_rate, total_loans, and default_count
                            to evaluate borrower reliability within the protocol.
                          </p>
                        </div>
                        
                        <div className="rounded-lg bg-aave-darker p-4 border border-aave-light-blue">
                          <h4 className="font-medium mb-2">Off-Chain Verification (KYC)</h4>
                          <p className="text-sm text-gray-400">
                            For under-collateralized loans, AI validates KYCFile documentation,
                            integrating traditional credit analysis with blockchain behavior data.
                          </p>
                        </div>
                        
                        <div className="rounded-lg bg-aave-darker p-4 border border-aave-light-blue">
                          <h4 className="font-medium mb-2">Final RiskScore Calculation</h4>
                          <p className="text-sm text-gray-400">
                            Combines all factors to generate a 300-850 credit-style score that determines
                            loan eligibility, terms, interest rates, and required collateral.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </main>
      </div>
    </SidebarLayout>
  );
};

export default Schema;
