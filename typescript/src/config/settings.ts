import {
  LocalSigner,
  NetworkConfig,
  StrKey,
  TransactionConfig,
} from "@colibri/core";
import { loadRequiredEnv } from "../util/load-required-env.ts";
import { Server } from "stellar-sdk/rpc";

const secretKey = loadRequiredEnv("STELLAR_ACCOUNT_SK");

if (StrKey.isEd25519SecretKey(secretKey) === false) {
  throw new Error(
    "Invalid STELLAR_ACCOUNT_SK provided in environment variables."
  );
}

const admin = LocalSigner.fromSecret(secretKey);

const networkConfig = NetworkConfig.TestNet();

const rpc = new Server(networkConfig.rpcUrl);

const txConfig: TransactionConfig = {
  source: admin.publicKey(),
  fee: "10000000", // 1 XLM
  timeout: 45,
  signers: [admin],
};

export const config = {
  wasmDir: "./target/wasm32v1-none/release/",
  contractFiles: {
    cross: "cross.wasm",
    typesHarness: "types_harness.wasm",
  },
  networkConfig: NetworkConfig.TestNet(),
  rpc,
  admin,
  txConfig,
  salts: {
    crossA: "b2b314c357fb11139a5b0d4b6306826ebb26b828b3f27ee87a57c989e1d86c38",
    crossB: "1d8d8c4b4269255512da712da47a7e12eb9fec94593733b21a5d189f302b6801",
    crossC: "a7aa77e9255b440ca975476628e24c5b661bf365a59a19ceea9503400f949ea7",
    crossD: "7d7a10cd0d6f789709a213b0963cc7ed10c5246549a59f4e143a0783b67e4c7a",
    crossE: "d6522bbe05a91e3bbcf75303c1cf1d6278317f78f148bcd9eb12799dd97eecbc",
    crossF: "a1676fd9c5a465b174c8de431af9efc89d01dfb17464461108ec7208b0a57dd9",
    crossG: "42eb8732d85ece0c4c5bc5a6fd899d36d9335dd08857005a718331322d949551",
    typesHarness:
      "6a089fd35a589cea3b30bcfd9066829f2c71c5eb05e96549473cb57e0615effd",
  },
  outputDirectory: "./",
  outputFile: "output",
};

// unused salts:
// 4df4bf292d1b95d2d9a44b422bd9f813d2ccbda1810703a6ff33675a40a2e619
// 9ce3aa7c27c737b8fe0ec095d09b07ed47b88636c2c7dabb4f86d3afdae3cea2
// 6e66d3f4b62930cd1466eb06566fc28896906f8aa514045190b842ad31efc6bf
// 82637d0b00fefef5a78883088b2c5b940b9c850df495f8b9a1a3a53083457bb9
// 41b49025902c275fa92084d0fb240a595cff75e858288d881fb8d408d66aff16
// 87bba2102aa9c160fec55b01ed005ed277a6093297a9f565059c8a769f600f15
// eb83d6ea3ada29561278df28aefc84e43f901e4a7308263bb61fecbd32add424
// e7534b37d98918be066ee28c804d2dbfcca4ed582bc3b17e923ad94039fb9ad1
// ee25dd7f26072ae88927e84277917227f142bd5fee0646599de806099f9d9b50
// e065b99ca0f29fb2df60d67ac9d30c951c558afbab1f405b5c8d788b6d293ac2
// c818d8df034ca83b88a2611fca41b037db33f758b4446ae898d1c0193bfcd3ed
// da821267917979b38685a878403cdc3454fe5404314e2385f73febad32e9138b
