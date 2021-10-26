import FlowNames from "../contracts/FlowNames.cdc"

pub fun main(addr: Address, name: String): String? {
  let account = getAccount(addr)
  let ref = account.getCapability<&{FlowNames.CollectionPublic}>(FlowNames.CollectionPublicPath)
              .borrow() ?? panic("Cannot borrow reference")
  return ref.findAuthorizedTokenId(name: name)
}