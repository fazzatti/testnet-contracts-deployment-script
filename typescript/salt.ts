import { randomBytes } from "node:crypto";
import { Buffer } from "buffer";

for (let i = 0; i < 20; i++) {
  console.log(`Generating salt attempt ${i + 1}...`);
  const salt = randomBytes(32);
  console.log(`Generated salt: ${Buffer.from(salt).toString("hex")}`);
}
