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
  removeSignature, getDID,
  listNames, lookupName, ChangeDirectly
} from './src/FlowNames'

describe("FlowNames", () => {
  beforeAll(async () => {
    const basePath = path.resolve(__dirname, "../");
    const port = 8080;
    init(basePath, port);
    return emulator.start(port, false);
  });

  afterAll(async () => {
    return emulator.stop();
  });

  describe("deploys contract", () => {
    beforeAll(async () => {
      await deployFlowNamesContract()

      const alice = await getAccountAddress("Alice");

      await createCollection(alice)
      await registerName(alice, "alice.eth", "signature 1", "content hash 1")
      await registerName(alice, "alice2.eth", "signature 1", "content hash 2")
    });

    it("Should list all names", async () => {
      const alice = await getAccountAddress("Alice");

      const userNames = await listNames(alice)
      expect(userNames['alice.eth']).toBe("content hash 1")
      expect(userNames['alice2.eth']).toBe("content hash 2")
    });

    it("Should lookup a name", async () => {
      const result = await lookupName("alice.eth")
      expect(result).toBe("content hash 1")
    });

    it("Shouldn't be able to change names directly", async () => {
      const alice = await getAccountAddress("Alice");
      try {
        await ChangeDirectly(alice, "bob.eth", "facebook.com")
        expect(1).toBe(0);
      } catch (e) {
        expect(1).toBe(1);
      }
    })

    it("Should be able to add a signature", async () => {
      const alice = await getAccountAddress("Alice");
      await addSignature(alice, "alice.eth", "signature 2");

      // unchanged
      let result = await listNames(alice);
      expect(result['alice2.eth']).toBe("content hash 2")
    })

    it("Should be able to remove a signature", async () => {
      const alice = await getAccountAddress("Alice");
      await removeSignature(alice, "alice.eth", "signature 1");

      let result = await getDID('alice.eth');
      expect(result).toMatchObject({
        name: 'alice.eth',
        content: 'content hash 1',
        authSignatures: { 'signature 2': true }
      })
    })

    it("Shouldn't be able to add a signature for a different name", async () => {
      const alice = await getAccountAddress("Alice");

      try {
        await addSignature(alice, "bob.eth", "signature 2");
        expect(1).toBe(0)
      } catch {
        // unchanged
        let result = await lookupName("alice.eth");
        expect(result).toBe("content hash 1");
      }

    })
  })

})