import FlowNames from "../contracts/FlowNames.cdc"

pub fun main(flowName: String): String {
  return FlowNames.getDocument(name: flowName) ?? "Document not set"
}