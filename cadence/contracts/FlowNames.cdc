pub contract FlowNames {
  
  // Stores the list of valid signatures that can be used to change a name
  access(self) var authorizedSignatures: {String: {String: Bool}}
  access(self) var documentUrl: {String: String}
  pub var registerCount: UInt256

  // we need to know where users keep their stuff!
  pub let CollectionStoragePath: StoragePath
  pub let CollectionPublicPath: PublicPath

  /*
    A NameToken can only be created by calling registerName()
   */
  pub resource NameToken {
    pub let name: String
    pub let signature: String

    init(name: String, signature: String) {
      self.name = name
      self.signature = signature
    }

    pub fun key(): String {
      return self.name.concat("//").concat(self.signature)
    }

    pub fun changeDocument(newUrl: String) {
      FlowNames.changeDocument(name: self.name, existingSignature: self.signature, newUrl: newUrl)
    }
    pub fun duplicate(): @FlowNames.NameToken {
      return <- FlowNames.addSignature(name: self.name, existingSignature: self.signature, signature: self.signature)
    }
    pub fun newToken(signature: String): @FlowNames.NameToken {
      return <- FlowNames.addSignature(name: self.name, existingSignature: self.signature, signature: signature)
    }
    pub fun removeSignature(signature: String): Bool {
      return FlowNames.removeSignature(name: self.name, existingSignature: self.signature, signature: signature)
    }
  }

  pub struct DID {
    pub let name: String
    pub let content: String?
    pub let authSignatures: {String: Bool}

    init(name: String, content: String?, signatures: {String: Bool}){
      self.name = name
      self.content = content
      self.authSignatures = signatures
    }
  }
  
  pub resource interface CollectionPublic {
    pub fun deposit(token: @NameToken)
    pub fun borrowToken(id: String): &NameToken
    pub fun keys(): [String]
    pub fun items(): {String: String}
    pub fun findAuthorizedTokenId(name: String): String?
  }

  pub resource interface Provider {
    // an id is a name//signature string
    pub fun withdraw(id: String): @NameToken
    pub fun findAuthorizedTokenId(name: String): String?
  }

  pub resource interface Receiver{
    pub fun deposit(token: @NameToken)
    pub fun batchDeposit(collection: @Collection)
  }

  pub resource Collection: CollectionPublic, Provider, Receiver {
    pub var ownedNames: @{String: NameToken}

    // withdraw removes a NameToken from the collection
    pub fun withdraw(id: String): @NameToken {
      let token <- self.ownedNames.remove(key: id) ?? panic("nothing at this id")
      return <-token
    }

    // findAuthorizedToken finds a NameToken from the collection that can
    // operate on the name
    pub fun findAuthorizedTokenId(name: String): String? {
      let authSignatures = FlowNames.getSignatures(name: name)
      for key in self.ownedNames.keys {
        let el = &self.ownedNames[key] as &NameToken
        if authSignatures[el.signature] ?? false {
          return el.key()
        }
      }
      return nil
    }

    // borrowToken returns a reference to a NameToken
    pub fun borrowToken(id: String): &NameToken {
      return &self.ownedNames[id] as &NameToken
    }

    // deposit adds a nameToken to the owned dictionary
    pub fun deposit(token: @NameToken) {
      // add the new token to the dictionary
      let oldToken <- self.ownedNames[token.key()] <- token
      destroy oldToken
    }

    // batchDeposit combines a collection with this collection
    pub fun batchDeposit(collection: @Collection) {
      let keys = collection.keys()
      for key in keys {
        self.deposit(token: <-collection.withdraw(id: key))
      }
      destroy collection
    }

    // keys enumerates all the tokens in this collection
    pub fun keys(): [String] {
      return self.ownedNames.keys
    }

    // items fetches all the content pairs in this collection
    pub fun items(): {String: String} {
      var nameTokens: {String: String} = {}
      for key in self.ownedNames.keys {
        let el = &self.ownedNames[key] as &NameToken
        nameTokens.insert(key: el.name, FlowNames.getDocument(name: el.name) ?? "no Document set")
      }
      return nameTokens
    }

    destroy() {
      destroy self.ownedNames
    }

    init() {
      self.ownedNames <- {}
    }
  }

  // Finally, here are the public methods we can use
  // - createEmptyCollection
  // - registerName(name, signature)
  // - getDocument(name)

  // NameTokens (authorized entries) can call these special methods as well
  // - changeDocument(name, auth, url)
  // - addSignature(name, auth, signature) -> returns a new NameToken
  // - removeSignature(name, auth, signature)

  pub fun createEmptyCollection(): @Collection {
    return <-create self.Collection()
  }

  pub fun registerName(name: String, signature: String): @NameToken {
    pre {
      self.authorizedSignatures[name] == nil : "Flowname is already registered"
    }
    self.authorizedSignatures[name] = {signature: true}
    self.registerCount = self.registerCount + 1
    return <- create NameToken(name: name, signature: signature)
  }

  pub fun getDocument(name: String): String? {
    return self.documentUrl[name]
  }
  pub fun getSignatures(name: String): {String: Bool} {
    return self.authorizedSignatures[name] ?? panic("Flowname not found!")
  }
  pub fun getDID(name: String): DID {
    let content = FlowNames.getDocument(name: name)
    let signatures = FlowNames.getSignatures(name: name)
    return DID(name: name, content: content, signatures: signatures)
  }

  access(contract) fun changeDocument(name: String, existingSignature: String, newUrl: String) {
    pre {
      self.authorizedSignatures[name]!.containsKey(existingSignature)
    }
    self.documentUrl[name] = newUrl
  }
  
  access(contract) fun addSignature(name: String, existingSignature: String, signature: String): @FlowNames.NameToken {
    pre {
      self.authorizedSignatures[name]!.containsKey(existingSignature)
    }
    self.authorizedSignatures[name]!.insert(key: signature, true)

    return <- create NameToken(name: name, signature: signature)
  }
  
  access(contract) fun removeSignature(name: String, existingSignature: String, signature: String): Bool {
    pre {
      self.authorizedSignatures[name]!.containsKey(existingSignature)
    }
    return self.authorizedSignatures[name]!.remove(key: signature) ?? false
  }

  init() {
    self.authorizedSignatures = {}
    self.documentUrl = {}
    self.CollectionStoragePath = /storage/FlowNames
    self.CollectionPublicPath = /public/FlowNamesPublic
    self.registerCount = 0
  }
}