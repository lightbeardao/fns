import path from "path"
import {
  emulator,
  init,
  executeScript,
  getAccountAddress,
  mintFlow
} from "flow-js-testing"
import {
  deployFlowNamesContract, createCollection,
  addSignature, registerName, registerEmptyName,
  listNames, lookupName, ChangeDirectly
} from './src/FlowNames'

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
    await registerName(alice, "alice.eth", "signature 1", "http://google.com")

    const userNames = await listNames(alice)
    expect(userNames['alice.eth']).toBe("http://google.com")
  });

  it("Should lookup a name", async () => {
    await deployFlowNamesContract()

    const alice = await getAccountAddress("Alice");

    await createCollection(alice)
    await registerName(alice, "alice.eth", "signature 1", "http://google.com")

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

  it("Should be able to add a signature", async () => {

    await deployFlowNamesContract()

    let result;
    const alice = await getAccountAddress("Alice");

    await createCollection(alice);
    await registerName(alice, "alice.eth", "signature 1", "content hash 1");

    result = await lookupName("alice.eth");
    expect(result).toBe("content hash 1");

    await addSignature(alice, "alice.eth", "signature 2");
    result = await listNames(alice);

    // unchanged
    expect(result['alice.eth']).toBe("content hash 1")
  })

  it("Shouldn't be able to add a signature for a different name", async () => {

    await deployFlowNamesContract()

    let result;
    const alice = await getAccountAddress("Alice");

    await createCollection(alice);
    await registerName(alice, "alice.eth", "signature 1", "content hash 1");

    result = await lookupName("alice.eth");
    expect(result).toBe("content hash 1");

    try {
      await addSignature(alice, "bob.eth", "signature 2");
      result = await listNames(alice);
      expect(1).toBe(0)
    } catch {
      // unchanged
      result = await lookupName("alice.eth");
      expect(result).toBe("content hash 1");
    }

  })
})