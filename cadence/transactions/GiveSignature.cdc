import FlowNames from "../contracts/FlowNames.cdc"


transaction(name: String, signature: String) {
  let receiverReference: &FlowNames.Collection{FlowNames.Receiver}
  let providerReference: &FlowNames.Collection{FlowNames.Provider}

  prepare(acct: AuthAccount, recipient: AuthAccount) {
    self.receiverReference = recipient.borrow<&FlowNames.Collection>(from: FlowNames.CollectionStoragePath) 
        ?? panic("Cannot borrow")
    self.providerReference = acct.borrow<&FlowNames.Collection>(from: FlowNames.CollectionStoragePath) 
        ?? panic("Cannot borrow")
  }

  execute {
    let authToken <- self.providerReference.withdraw(id: name.concat("//").concat(signature))
    self.receiverReference.deposit(token: <-authToken)
  }
}