import FlowNames from "../contracts/FlowNames.cdc"


transaction(name: String, newSignature: String) {
  let receiverReference: &FlowNames.Collection{FlowNames.Receiver}
  let borrowReference: &FlowNames.Collection{FlowNames.Provider}

  prepare(acct: AuthAccount) {
    self.receiverReference = acct.borrow<&FlowNames.Collection>(from: FlowNames.CollectionStoragePath) 
        ?? panic("Cannot borrow")
    self.borrowReference = acct.borrow<&FlowNames.Collection>(from: FlowNames.CollectionStoragePath) 
        ?? panic("Cannot borrow")
  }

  execute {
    let oldToken <- self.borrowReference.withdrawByName(name: name)
    let newToken <- oldToken.newToken(signature: newSignature)
    self.receiverReference.deposit(token: <-oldToken)
    self.receiverReference.deposit(token: <-newToken)
  }
}