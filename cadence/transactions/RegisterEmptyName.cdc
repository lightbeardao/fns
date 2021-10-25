import FlowNames from "../contracts/FlowNames.cdc"


transaction(name: String, signature: String) {
  let receiverReference: &FlowNames.Collection{FlowNames.Receiver}

  prepare(acct: AuthAccount) {
    self.receiverReference = acct.borrow<&FlowNames.Collection>(from: FlowNames.CollectionStoragePath) 
        ?? panic("Cannot borrow")
  }

  execute {
    let newDappy <- FlowNames.registerName(name: name, signature: signature)
    self.receiverReference.deposit(token: <-newDappy)
  }
}