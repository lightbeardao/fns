pub contract FlowNames {
  
  // both of these dicts operate on namehashes instead of Strings
  // but in Flow, I don't think you have custom types
  
  // Stores a dict of signature->id pairs for each hashed name
  access(self) var authorizedSignatures: {String: {String: String}}
  // Stores the "content" pointer of each namehash
  access(self) var documentUrl: {String: String}
  pub var registerCount: UInt256

  pub event NameCreated(name: String)
  pub event NameChanged(name: String, oldContent: String?, newContent: String?)
  pub event SignatureAdded(name: String, signature: String)
  pub event SignatureRevoked(name: String, signature: String)

  // we need to know where users keep their stuff!
  pub let CollectionStoragePath: StoragePath
  pub let CollectionPublicPath: PublicPath

  /*
    A NameToken can only be created by calling registerName()
   */
  pub resource NameToken {
    pub let name: String
    pub let id: String
    pub let signature: String

    init(name: String,id: String, signature: String) {
      self.name = name
      self.id = id
      self.signature = signature
    }

    pub fun key(): String {
      return self.name.concat("//").concat(self.signature)
    }

    pub fun changeDocument(newUrl: String) {
      FlowNames.changeDocument(name: self.name, existingSignature: self.signature, newUrl: newUrl)
    }
    pub fun duplicate(id: String): @FlowNames.NameToken {
      return <- FlowNames.addSignature(name: self.name, existingSignature: self.signature, id: id, signature: self.signature)
    }
    pub fun newToken(id: String, signature: String): @FlowNames.NameToken {
      return <- FlowNames.addSignature(name: self.name, existingSignature: self.signature, id: id, signature: signature)
    }
    pub fun removeSignature(signature: String): Bool {
      let c = FlowNames.removeSignature(name: self.name, existingSignature: self.signature, signature: signature)
      if c != nil {
        emit SignatureRevoked(name: self.name, signature: signature)
        return true
      }
      return false
    }
  }

  pub struct DID {
    pub let name: String
    pub let content: String?
    pub let authSignatures: {String: String}

    init(name: String, content: String?, signatures: {String: String}){
      self.name = name
      self.content = content
      self.authSignatures = signatures
    }
  }
  
  pub resource interface CollectionPublic {
    pub fun deposit(token: @NameToken)
    pub fun borrowToken(id: String): &NameToken
    pub fun keys(): [String]
    pub fun items(): {String: [NamedSignature]}
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

  pub struct NamedSignature {
    pub let id: String
    pub let signature: String

    init(id: String, signature: String) {
      self.id = id
      self.signature = signature
    }
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
        if el.name == name && (authSignatures[el.signature] != nil) {
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

    // items returns the tokens I have
    pub fun items(): {String: [NamedSignature]} {
      var nameTokens: {String: [NamedSignature]} = {}
      for key in self.ownedNames.keys {
        let el = &self.ownedNames[key] as &NameToken
        let c = NamedSignature(id: el.id, signature: el.signature)
        if nameTokens.containsKey(el.name) {
          nameTokens[el.name]!.append(c)
        } else {
          nameTokens.insert(key: el.name, [c])
        }
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

  pub fun registerName(name: String, id: String, signature: String): @NameToken {
    pre {
      self.authorizedSignatures[name] == nil : "Flowname is already registered"
    }
    self.authorizedSignatures[name] = {signature: id}
    self.registerCount = self.registerCount + 1
    emit NameCreated(name: name)
    return <- create NameToken(name: name, id: id, signature: signature)
  }

  pub fun getDocument(name: String): String? {
    return self.documentUrl[name]
  }
  pub fun getSignatures(name: String): {String: String} {
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
    emit NameChanged(name: name, oldContent: self.documentUrl[name], newContent: newUrl)
    self.documentUrl[name] = newUrl
  }
  
  access(contract) fun addSignature(name: String, existingSignature: String, id: String, signature: String): @FlowNames.NameToken {
    pre {
      self.authorizedSignatures[name]!.containsKey(existingSignature)
    }
    self.authorizedSignatures[name]!.insert(key: signature, id)
    emit SignatureAdded(name: name, signature: signature)
    return <- create NameToken(name: name, id: id, signature: signature)
  }
  
  access(contract) fun removeSignature(name: String, existingSignature: String, signature: String): String? {
    pre {
      self.authorizedSignatures[name]!.containsKey(existingSignature)
    }
    post {
      !self.authorizedSignatures[name]!.containsKey(signature): "signature should be gone"
    }
    return self.authorizedSignatures[name]!.remove(key: signature)
  }

  init() {
    self.authorizedSignatures = {}
    self.documentUrl = {}
    self.CollectionStoragePath = /storage/FlowNames
    self.CollectionPublicPath = /public/FlowNamesPublic
    self.registerCount = 0
  }
}