import FlowNames from "../contracts/FlowNames.cdc"

pub fun main(addr: Address): {String: [String]} {
  let account = getAccount(addr)
  let ref = account.getCapability<&{FlowNames.CollectionPublic}>(FlowNames.CollectionPublicPath)
              .borrow() ?? panic("Cannot borrow reference")
  let dappies = ref.items()
  return dappies
}