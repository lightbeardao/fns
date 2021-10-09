pub contract FlowNames {
  
  access(self) var lookups: {String: String}
  pub var registerCount: UInt256

  // we need to know where users keep their stuff!
  pub let CollectionStoragePath: StoragePath
  pub let CollectionPublicPath: PublicPath

  pub resource NameToken {
    pub let name: String
    pub let url: String

    init(name: String, url: String) {
      self.name = name
      self.url = url
    }

    pub fun changeName(newUrl: String) {
      FlowNames.changeName(name: self.name, newUrl: newUrl)
    }
  }
  
  pub resource interface CollectionPublic {
    pub fun deposit(token: @NameToken)
    pub fun keys(): [String]
    pub fun items(): {String: String}
  }

  pub resource interface Provider {
    pub fun withdraw(name: String): @NameToken
  }

  pub resource interface Receiver{
    pub fun deposit(token: @NameToken)
    pub fun batchDeposit(collection: @Collection)
  }

  pub resource Collection: CollectionPublic, Provider, Receiver {
    pub var ownedNames: @{String: NameToken}

    pub fun withdraw(name: String): @NameToken {
      let token <- self.ownedNames.remove(key: name) 
        ?? panic("Could not withdraw dappy: dappy does not exist in collection")
      return <-token
    }

    pub fun deposit(token: @NameToken) {
      let oldToken <- self.ownedNames[token.name] <- token
      destroy oldToken
    }

    pub fun batchDeposit(collection: @Collection) {
      let keys = collection.keys()
      for key in keys {
        self.deposit(token: <-collection.withdraw(name: key))
      }
      destroy collection
    }

    pub fun keys(): [String] {
      return self.ownedNames.keys
    }

    pub fun items(): {String: String} {
      var dappyTemplates: {String: String} = {}
      for key in self.ownedNames.keys {
        let el = &self.ownedNames[key] as &NameToken
        dappyTemplates.insert(key: el.name, el.url)
      }
      return dappyTemplates
    }

    destroy() {
      destroy self.ownedNames
    }

    init() {
      self.ownedNames <- {}
    }
  }

  pub fun createEmptyCollection(): @Collection {
    return <-create self.Collection()
  }

  pub fun registerName(name: String, url: String): @NameToken {
    pre {
      self.lookups[name] == nil : "Flowname is already registered"
    }
    self.lookups[name] = url
    self.registerCount = self.registerCount + 1
    return <- create NameToken(name: name, url: url)
  }

  // only a NameToken can use this method (to change its own url)
  access(contract) fun changeName(name: String, newUrl: String) {
    self.lookups[name] = newUrl
  }
  
  pub fun lookup(name: String): String? {
    return self.lookups[name]
  }

  init() {
    self.lookups = {}
    self.CollectionStoragePath = /storage/FlowNames
    self.CollectionPublicPath = /public/FlowNamesPublic
    self.registerCount = 0
  }
}