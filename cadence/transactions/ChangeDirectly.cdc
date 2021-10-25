import FlowNames from "../contracts/FlowNames.cdc"

// this transaction is just for testing! This will always fail
transaction(name: String, url: String) {

  prepare(acct: AuthAccount) {
  }

  execute {
    FlowNames.contents[name] = url
  }
}