import chalk from "chalk";
import { Contract, ContractId } from "@colibri/core";
import { config } from "../config/settings.ts";
import { Buffer } from "buffer";

const { networkConfig, txConfig } = config;

export const deploySingle = async (
  saltHex: string,
  wasm: Buffer,
  wasmHash: string,
  nextContracts: string[],
  reqAuth: boolean = false,
  customArgs: boolean = false
): Promise<ContractId> => {
  const contract = new Contract({
    networkConfig,
    contractConfig: {
      wasmHash: wasmHash,
      // deno-lint-ignore no-explicit-any
      wasm: wasm as any,
    },
  });

  await contract.loadSpecFromWasm();

  await contract.deploy({
    config: txConfig,
    constructorArgs: {
      next_contracts: [...nextContracts],
      require_auth: reqAuth,
      custom_args: customArgs,
    },
    // deno-lint-ignore no-explicit-any
    salt: Buffer.from(saltHex, "hex") as any,
  });

  const contractId = contract.getContractId();

  console.log("Contract deployed with ID:", chalk.blue(contractId));

  return contractId;
};
