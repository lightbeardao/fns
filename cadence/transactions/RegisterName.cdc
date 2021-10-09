import FlowNames from "../contracts/FlowNames.cdc"


transaction(name: String, url: String) {
  let receiverReference: &FlowNames.Collection{FlowNames.Receiver}

  prepare(acct: AuthAccount) {
    self.receiverReference = acct.borrow<&FlowNames.Collection>(from: FlowNames.CollectionStoragePath) 
        ?? panic("Cannot borrow")
  }

  execute {
    let newDappy <- FlowNames.registerName(name: name, url: url)
    self.receiverReference.deposit(token: <-newDappy)
  }
}