# Testnet Contracts Deployment Script

Deploys Soroban smart contracts to Stellar testnet with predefined salts for deterministic contract addresses. Useful for reproducible test environments.

## Prerequisites

- [Deno](https://deno.land/)
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/stellar-cli)

## Setup

1. Install dependencies:

   ```bash
   deno install
   ```

2. Build the contracts:

   ```bash
   stellar contract build
   ```

3. Configure your account:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Stellar testnet secret key.

## Run

```bash
deno task setup
```

This will:

- Initialize your account via Friendbot (if needed)
- Deploy the cross-contract auth tree (contracts A-G)
- Deploy the types harness contract
- Save contract IDs to `output.json`
