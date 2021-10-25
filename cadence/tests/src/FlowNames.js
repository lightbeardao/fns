import {
  getAccountAddress,
  mintFlow,
  deployContractByName,
  sendTransaction,
  executeScript
} from "flow-js-testing"

export const deployFlowNamesContract = async () => {
  const Home = await getAccountAddress("FlowNamesAcct")
  await deployContractByName({ to: Home, name: "FlowNames" })
}

export const createCollection = async (recipient) => {
  const name = "CreateCollection"
  const signers = [recipient]
  await sendTransaction({ name, signers })
}

export const registerName = async (recipient, flowname, signature, content) => {
  const name = "RegisterName"
  const signers = [recipient]
  const args = [flowname, signature, content]
  await sendTransaction({ name, args, signers })
}

export const registerEmptyName = async (recipient, flowname, signature) => {
  const name = "RegisterEmptyName"
  const signers = [recipient]
  const args = [flowname, signature]
  await sendTransaction({ name, args, signers })
}

export const addSignature = async (recipient, flowname, signature) => {
  const name = "AddSignature"
  const signers = [recipient]
  const args = [flowname, signature]
  await sendTransaction({ name, args, signers })
}

export const listNames = async (recipient) => {
  const name = "ListCollection"
  const args = [recipient]
  const dappies = await executeScript({ name, args })
  return dappies
}

export const lookupName = async (flowname) => {
  const name = "LookupName"
  const args = [flowname]
  const dappies = await executeScript({ name, args })
  return dappies
}

export const ChangeDirectly = async (recipient, flowname, url) => {
  const name = "ChangeDirectly"
  const signers = [recipient]
  const args = [flowname, url]
  await sendTransaction({ name, args, signers })
}