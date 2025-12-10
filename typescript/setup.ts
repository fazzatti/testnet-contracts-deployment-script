import { LocalSigner } from "@colibri/core";
import { config } from "./src/config/settings.ts";
import { deployAuthTree } from "./src/cross-contract/deploy.ts";
import { deployTypesHarness } from "./src/types-harness/deploy.ts";
import { Output } from "./src/config/output-type.ts";
import { saveToJsonFile } from "./src/util/io.ts";
import { initializeAccount } from "./initialize-account.ts";

const { admin } = config;

await initializeAccount();

const crossContracts = await deployAuthTree();
const typesHarnessContractId = await deployTypesHarness();
console.log("All cross-contracts deployed:");

const output: Output = {
  adminPublicKey: admin.publicKey(),
  adminSecretKey: admin.secretKey(),
  typeHarnessContractId: typesHarnessContractId,
  crossContractId: crossContracts.rootContractId,
};

console.log("Deployment output:", output);

console.log("Writing output to file...");
await saveToJsonFile<Output>(output, config.outputFile);
