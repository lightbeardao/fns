import { config } from "@onflow/fcl"

const USE_LOCAL = false;
const USE_DEV_WALLET = false;

const wallet_api = USE_DEV_WALLET ? "http://localhost:7001/fcl/authn" : "https://fcl-discovery.onflow.org/testnet/authn";
const node_api = USE_LOCAL ? "http://localhost:8080" : "https://access-testnet.onflow.org";

const myConfig = {
  "accessNode.api": node_api,
  "discovery.wallet": wallet_api,
  "0xFlowNames": '0x94485a03d64b0333'
}

console.log('Config:', myConfig)
config(myConfig)