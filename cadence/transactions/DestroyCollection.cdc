import FlowNames from "../contracts/FlowNames.cdc"

transaction {
  prepare(acct: AuthAccount) {
    acct.unlink(FlowNames.CollectionPublicPath)
    let c <- acct.load<@FlowNames.Collection>(from: FlowNames.CollectionStoragePath)
    destroy c
  }
}