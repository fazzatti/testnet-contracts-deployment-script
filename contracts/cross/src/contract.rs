use soroban_sdk::{contract, contractimpl, contracttype, vec, Address, Env, Symbol, Vec};

#[contracttype]
pub enum DataKey {
    NextContracts,
    RequireAuth,
    CustomArgs,
}

#[contract]
pub struct CrossContract;

#[contractimpl]
impl CrossContract {
    pub fn __constructor(
        env: Env,
        next_contracts: Vec<Address>,
        require_auth: bool,
        custom_args: bool,
    ) {
        env.storage()
            .instance()
            .set(&DataKey::NextContracts, &next_contracts);
        env.storage()
            .instance()
            .set(&DataKey::RequireAuth, &require_auth);
        env.storage()
            .instance()
            .set(&DataKey::CustomArgs, &custom_args);
    }
    pub fn get_next_contracts(env: Env) -> Vec<Address> {
        env.storage()
            .instance()
            .get(&DataKey::NextContracts)
            .unwrap_or(Vec::new(&env))
    }
    pub fn get_require_auth(env: Env) -> bool {
        env.storage()
            .instance()
            .get(&DataKey::RequireAuth)
            .unwrap_or(false)
    }

    pub fn execute(env: Env, auth_address: Address) -> Vec<Address> {
        let require_auth: bool = env
            .storage()
            .instance()
            .get(&DataKey::RequireAuth)
            .unwrap_or(false);

        let custom_args: bool = env
            .storage()
            .instance()
            .get(&DataKey::CustomArgs)
            .unwrap_or(false);

        if require_auth && custom_args {
            let arg_a: i32 = 1;
            let arg_b: u32 = 2;
            let arg_c: u32 = 3;
            auth_address.require_auth_for_args(vec![
                &env,
                arg_a.into(),
                arg_b.into(),
                arg_c.into(),
            ]);
        }

        if require_auth && !custom_args {
            auth_address.require_auth();
        }

        let next_contracts: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::NextContracts)
            .unwrap_or(Vec::new(&env));

        let mut all_called = Vec::new(&env);

        for contract in next_contracts.iter() {
            let result: Vec<Address> = env.invoke_contract(
                &contract,
                &Symbol::new(&env, "execute"),
                vec![&env, auth_address.to_val()],
            );

            // Add this contract to the list
            all_called.push_back(contract.clone());

            // Append all contracts returned from the call
            for addr in result.iter() {
                all_called.push_back(addr);
            }
        }

        all_called
    }
}
