import FlowNames from "../contracts/FlowNames.cdc"

transaction {
  prepare(acct: AuthAccount) {
    // create a collection if user doesn't have one already!
    if acct.borrow<&FlowNames.Collection>(from: FlowNames.CollectionStoragePath) == nil {
      let collection <- FlowNames.createEmptyCollection()
      acct.save<@FlowNames.Collection>(<-collection, to: FlowNames.CollectionStoragePath)
      acct.link<&{FlowNames.CollectionPublic}>(FlowNames.CollectionPublicPath, target: FlowNames.CollectionStoragePath)
    }
  }
}