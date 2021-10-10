import FlowNames from "../contracts/FlowNames.cdc"


transaction(name: String, url: String) {

  prepare(acct: AuthAccount) {
  }

  execute {
    FlowNames.lookups[name] = url
  }
}