import FlowNames from "../contracts/FlowNames.cdc"

pub fun main(flowName: String): String {
  return FlowNames.lookup(name: flowName) ?? "Not registered"
}