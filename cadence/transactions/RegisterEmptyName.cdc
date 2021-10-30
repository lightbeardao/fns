import FlowNames from "../contracts/FlowNames.cdc"


transaction(name: String, id: String, signature: String) {
  let receiverReference: &FlowNames.Collection{FlowNames.Receiver}

  prepare(acct: AuthAccount) {
    // create a collection if user doesn't have one already!
    if acct.borrow<&FlowNames.Collection>(from: FlowNames.CollectionStoragePath) == nil {
      let collection <- FlowNames.createEmptyCollection()
      acct.save<@FlowNames.Collection>(<-collection, to: FlowNames.CollectionStoragePath)
      acct.link<&{FlowNames.CollectionPublic}>(FlowNames.CollectionPublicPath, target: FlowNames.CollectionStoragePath)
    }
    
    self.receiverReference = acct.borrow<&FlowNames.Collection>(from: FlowNames.CollectionStoragePath) 
        ?? panic("Cannot borrow")
  }

  execute {
    let newDappy <- FlowNames.registerName(name: name, id: id, signature: signature)
    self.receiverReference.deposit(token: <-newDappy)
  }
}