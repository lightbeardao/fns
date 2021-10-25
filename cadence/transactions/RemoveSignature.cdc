import FlowNames from "../contracts/FlowNames.cdc"


transaction(name: String, signatureToRemove: String) {
  let receiverReference: &FlowNames.Collection{FlowNames.Receiver}
  let providerReference: &FlowNames.Collection{FlowNames.Provider}

  prepare(acct: AuthAccount) {
    self.receiverReference = acct.borrow<&FlowNames.Collection>(from: FlowNames.CollectionStoragePath) 
        ?? panic("Cannot borrow")
    self.providerReference = acct.borrow<&FlowNames.Collection>(from: FlowNames.CollectionStoragePath) 
        ?? panic("Cannot borrow")
  }

  execute {
    let tokenId = self.providerReference.findAuthorizedTokenId(name: name)
    if tokenId != nil {
      let oldToken <- self.providerReference.withdraw(id: tokenId!)
      let removed = oldToken.removeSignature(signature: signatureToRemove)
      self.receiverReference.deposit(token: <-oldToken)
    }
  }
}