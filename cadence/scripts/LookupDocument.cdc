import FlowNames from "../contracts/FlowNames.cdc"

pub fun main(flowName: String): FlowNames.DID {
  return FlowNames.getDID(name: flowName)
}