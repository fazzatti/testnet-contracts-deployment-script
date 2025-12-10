/*
  Auth Tree Structure:
                         A *
                    /         \
                 B *            C
              /       \         /  \
            D **        E       F    G **

  *calls 'require_auth' for the account
  **calls 'require_auth_for_args' for the account with custom args [1,2,3]
  
- User invokes contract A
- A calls B and C
- B calls D and E
- C calls F and G
  */

import { Contract } from "@colibri/core";
import { deploySingle } from "./deploy-single.ts";
import { config } from "../config/settings.ts";
import { loadWasmFile } from "../util/load-wasm.ts";

export const deployAuthTree = async () => {
  const { networkConfig, txConfig, contractFiles, salts } = config;

  const wasm = await loadWasmFile(contractFiles.cross);

  const contract = new Contract({
    networkConfig,
    contractConfig: {
      // deno-lint-ignore no-explicit-any
      wasm: wasm as any,
    },
  });

  console.log("Uploading cross-contract WASM...");
  await contract.uploadWasm(txConfig);

  const wasmHash = contract.getWasmHash();

  console.log("Cross contract WASM uploaded. Hash:", wasmHash);

  // Deploy leaf contracts first (bottom-up approach)
  console.log("Deploying leaf contracts with auth...");
  console.log("Contract D**");
  const contractD = await deploySingle(
    salts.crossD,
    wasm,
    wasmHash,
    [],
    true,
    true
  );
  console.log("Contract E");
  const contractE = await deploySingle(salts.crossE, wasm, wasmHash, []); // E calls J, no auth
  console.log("Contract F");
  const contractF = await deploySingle(salts.crossF, wasm, wasmHash, []); // F calls K, no auth
  console.log("Contract G**");
  const contractG = await deploySingle(
    salts.crossG,
    wasm,
    wasmHash,
    [],
    true,
    true
  );
  console.log("Contract B*");
  const contractB = await deploySingle(
    salts.crossB,
    wasm,
    wasmHash,
    [contractD, contractE],
    true
  );
  console.log("Contract C");
  const contractC = await deploySingle(salts.crossC, wasm, wasmHash, [
    contractF,
    contractG,
  ]);

  console.log("Deploying root contract with auth...");
  console.log("Contract A*");
  const contractA = await deploySingle(
    salts.crossA,
    wasm,
    wasmHash,
    [contractB, contractC],
    true
  );

  return {
    rootContractId: contractA,
    wasmHash,
    contracts: {
      A: contractA,
      B: contractB,
      C: contractC,
      D: contractD,
      E: contractE,
      F: contractF,
      G: contractG,
    },
  };
};
