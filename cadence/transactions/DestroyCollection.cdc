import FlowNames from "../contracts/FlowNames.cdc"

transaction {
  prepare(acct: AuthAccount) {
    acct.unlink(FlowNames.CollectionPublicPath)
    destroy <-acct.load<@FlowNames.Collection>(from: FlowNames.CollectionStoragePath)
  }
}