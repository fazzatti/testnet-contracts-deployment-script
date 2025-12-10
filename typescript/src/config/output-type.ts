import { ContractId, Ed25519PublicKey, Ed25519SecretKey } from "@colibri/core";

export type Output = {
  adminPublicKey: Ed25519PublicKey;
  adminSecretKey: Ed25519SecretKey;
  typeHarnessContractId: ContractId;
  crossContractId: ContractId;
};
