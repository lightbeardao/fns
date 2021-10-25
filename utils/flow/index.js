export const Scripts = {
  LOOKUP_NAME: `
  import FlowNames from 0xFlowNames

pub fun main(flowName: String): FlowNames.DID {
  return FlowNames.getDID(name: flowName)
}
  `,
  LIST_MY_NAMES: `
  import FlowNames from 0xFlowNames

pub fun main(addr: Address): {String: String} {
  let account = getAccount(addr)
  let ref = account.getCapability<&{FlowNames.CollectionPublic}>(FlowNames.CollectionPublicPath)
              .borrow() ?? panic("Cannot borrow reference")
  let dappies = ref.items()
  return dappies
}`
}

export const Transactions = {
  CREATE_COLLECTION: `
  import FlowNames from 0xFlowNames

transaction {
  prepare(acct: AuthAccount) {
    let collection <- FlowNames.createEmptyCollection()
    acct.save<@FlowNames.Collection>(<-collection, to: FlowNames.CollectionStoragePath)
    acct.link<&{FlowNames.CollectionPublic}>(FlowNames.CollectionPublicPath, target: FlowNames.CollectionStoragePath)
  }
}
  `,
  ADD_SIGNATURE: `
  import FlowNames from 0xFlowNames

transaction(name: String, newSignature: String) {
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
      let newToken <- oldToken.newToken(signature: newSignature)
      self.receiverReference.deposit(token: <-oldToken)
      self.receiverReference.deposit(token: <-newToken)
    }
  }
}
  `,
  REGISTER_NAME: `
  import FlowNames from 0xFlowNames
  
transaction(name: String, signature: String, content: String) {
  let receiverReference: &FlowNames.Collection{FlowNames.Receiver}

  prepare(acct: AuthAccount) {
    self.receiverReference = acct.borrow<&FlowNames.Collection>(from: FlowNames.CollectionStoragePath) 
        ?? panic("Cannot borrow")
  }

  execute {
    let newDappy <- FlowNames.registerName(name: name, signature: signature)
    newDappy.changeDocument(newUrl: content)
    self.receiverReference.deposit(token: <-newDappy)
  }
}`,
  REMOVE_SIGNATURE: `
  import FlowNames from 0xFlowNames

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
}`
}