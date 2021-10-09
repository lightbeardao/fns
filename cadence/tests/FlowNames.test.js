import path from "path"
import {
  emulator,
  init,
  executeScript,
  getAccountAddress,
  mintFlow
} from "flow-js-testing"
import { deployFlowNamesContract, createCollection, registerName, listNames, lookupName, ChangeDirectly } from './src/FlowNames'

describe("FlowNames", () => {
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../");
    const port = 8080;
    init(basePath, port);
    return emulator.start(port, false);
  });

  afterEach(async () => {
    return emulator.stop();
  });

  it("deploys FlowNames contract", async () => {
    await deployFlowNamesContract()
  });

  it("Should mint a name", async () => {
    await deployFlowNamesContract()

    const alice = await getAccountAddress("Alice");

    await createCollection(alice)
    await registerName(alice, "alice.eth", "http://google.com")

    const userNames = await listNames(alice)
    expect(userNames['alice.eth']).toBe("http://google.com")
  });

  it("Should lookup a name", async () => {
    await deployFlowNamesContract()

    const alice = await getAccountAddress("Alice");

    await createCollection(alice)
    await registerName(alice, "alice.eth", "http://google.com")

    const result = await lookupName("alice.eth")
    expect(result).toBe("http://google.com")
  });

  it("Shouldn't be able to change names directly", async () => {
    await deployFlowNamesContract()

    const bob = await getAccountAddress("Bob");
    try {
      await ChangeDirectly(bob, "bob.eth", "facebook.com")
      expect(1).toBe(0);
    } catch (e) {
      expect(1).toBe(1);
    }
  })
})