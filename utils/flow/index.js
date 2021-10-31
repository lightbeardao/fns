export const Scripts = {
  LOOKUP_NAME: `
  import FlowNames from 0xFlowNames

pub fun main(flowName: String): FlowNames.DID {
  return FlowNames.getDID(name: flowName)
}
  `,
  LIST_MY_NAMES: `
  import FlowNames from 0xFlowNames

  pub fun main(addr: Address): {String: [FlowNames.NamedSignature]} {
    let account = getAccount(addr)
    let ref = account.getCapability<&{FlowNames.CollectionPublic}>(FlowNames.CollectionPublicPath)
                .borrow() ?? panic("Cannot borrow reference")
    let dappies = ref.items()
    return dappies
  }`,
  AUTHORIZED_ON_NAME: `
  import FlowNames from 0xFlowNames

pub fun main(addr: Address, name: String): String? {
  let account = getAccount(addr)
  let ref = account.getCapability<&{FlowNames.CollectionPublic}>(FlowNames.CollectionPublicPath)
              .borrow() ?? panic("Cannot borrow reference")
  return ref.findAuthorizedTokenId(name: name)
}
  `
}

export const Transactions = {
  CREATE_COLLECTION: `
  import FlowNames from 0xFlowNames

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
  `,
  ADD_SIGNATURE: `
  import FlowNames from 0xFlowNames

  transaction(name: String, id: String, newSignature: String) {
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
        let newToken <- oldToken.newToken(id: id, signature: newSignature)
        self.receiverReference.deposit(token: <-oldToken)
        self.receiverReference.deposit(token: <-newToken)
      }
    }
  }
  `,
  REGISTER_NAME: `
  import FlowNames from 0xFlowNames
  
transaction(name: String, id: String, signature: String, content: String) {
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
    newDappy.changeDocument(newUrl: content)
    self.receiverReference.deposit(token: <-newDappy)
  }
}`,
REGISTER_DID: `
import FlowNames from 0xFlowNames

transaction(name: String, content: String) {
let receiverReference: &FlowNames.Collection{FlowNames.Receiver}
let publicKey: String

prepare(acct: AuthAccount) {
  
  // create a collection if user doesn't have one already!
  if acct.borrow<&FlowNames.Collection>(from: FlowNames.CollectionStoragePath) == nil {
    let collection <- FlowNames.createEmptyCollection()
    acct.save<@FlowNames.Collection>(<-collection, to: FlowNames.CollectionStoragePath)
    acct.link<&{FlowNames.CollectionPublic}>(FlowNames.CollectionPublicPath, target: FlowNames.CollectionStoragePath)
  }
  
  self.receiverReference = acct.borrow<&FlowNames.Collection>(from: FlowNames.CollectionStoragePath) 
      ?? panic("Cannot borrow")

  let acctKey = acct.keys.get(keyIndex: 0)!;
  self.publicKey = String.encodeHex(acctKey.publicKey.publicKey)
}

execute {
  let newDappy <- FlowNames.registerName(name: name, id: "default", signature: self.publicKey)
  newDappy.changeDocument(newUrl: content)
  self.receiverReference.deposit(token: <-newDappy)
}
}`,
  CHANGE_DOCUMENT: `
  import FlowNames from 0xFlowNames

transaction(name: String, url: String) {
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
      oldToken.changeDocument(newUrl: url)
      self.receiverReference.deposit(token: <-oldToken)
    }
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
}`,
  GIVE_SIGNATURE: `
  import FlowNames from 0xFlowNames

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
  `,
  RESET_COLLECTION: `
  import FlowNames from 0xOldFlowNames

transaction {
  prepare(acct: AuthAccount) {
    acct.unlink(FlowNames.CollectionPublicPath)
    destroy <- acct.load<@FlowNames.Collection>(from: FlowNames.CollectionStoragePath)
  }
}`
}