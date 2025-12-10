import { Contract } from "@colibri/core";
import { config } from "../config/settings.ts";
import { loadWasmFile } from "../util/load-wasm.ts";
import { Buffer } from "buffer";
import chalk from "chalk";

export const deployTypesHarness = async () => {
  const { networkConfig, txConfig, contractFiles, salts } = config;

  const wasm = await loadWasmFile(contractFiles.typesHarness);

  const contract = new Contract({
    networkConfig,
    contractConfig: {
      // deno-lint-ignore no-explicit-any
      wasm: wasm as any,
    },
  });

  await contract.loadSpecFromWasm();

  console.log("Uploading Types harness WASM...");
  await contract.uploadWasm(txConfig);

  const wasmHash = contract.getWasmHash();

  console.log("Types harness WASM uploaded. Hash:", wasmHash);

  await contract.deploy({
    config: txConfig,
    // deno-lint-ignore no-explicit-any
    salt: Buffer.from(salts.typesHarness, "hex") as any,
  });

  console.log(
    "Contract deployed with ID:",
    chalk.blue(contract.getContractId())
  );

  return contract.getContractId();
};
