import FlowNames from "../contracts/FlowNames.cdc"

transaction {
  prepare(acct: AuthAccount) {
    let collection <- FlowNames.createEmptyCollection()
    acct.save<@FlowNames.Collection>(<-collection, to: FlowNames.CollectionStoragePath)
    acct.link<&{FlowNames.CollectionPublic}>(FlowNames.CollectionPublicPath, target: FlowNames.CollectionStoragePath)
  }
}