import { initializeWithFriendbot } from "@colibri/core";
import { config } from "./src/config/settings.ts";

const { admin, networkConfig, rpc } = config;

export const initializeAccount = async () => {
  try {
    const account = await rpc.getAccount(admin.publicKey());

    if (account && Number(account.sequenceNumber()) > 0)
      console.log(`Admin account already initialized: ${account.accountId()}`);
  } catch (_e) {
    console.log("Admin account not found. Proceeding to initialize...");
    await initializeWithFriendbot(
      networkConfig.friendbotUrl,
      admin.publicKey()
    );

    console.log(`Admin account ${admin.publicKey()} initialized successfully.`);
  }
};
