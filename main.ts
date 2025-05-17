import { generateTextResponse } from "./src/index";

(async () => {
  const result = await generateTextResponse("Alban est fort ou pas ");
  console.log(result);
})();