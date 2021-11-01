//@ts-check

import namehash from "eth-ens-namehash";
import IPFS from "nano-ipfs-store";

export function getDID(name) {
  let hash = namehash.hash(name);
  let did = `did:flow:${hash}`;
  console.log(`\n\n[DID] Calculating hash for ${name}...`);
  console.log(`[DID] ${did}`);
  return did;
}

export function emptyDIDDocument(id) {
  return {
    "@context": ["https://w3id.org/did/v1"],
    id: `did:flow:${id}`,
    verificationMethod: [],
    authentication: [],
    keyAgreement: [],
    services: [],
  };
}

function addPublicKey(c, { name, publicKey, controller, did }) {
  let key = {
    id: `${did}#${name}`,
    type: "EcdsaSecp256k1RecoveryMethod2020",
    controller,
    publicKeyHex: publicKey,
  };

  c.verificationMethod.push(key);
  c.authentication.push(key);
}

export async function parseDID(doc) {
  if (!doc) return null;

  let id = doc.name;
  let c = emptyDIDDocument(id);
  console.log("Raw document", doc);

  // for now, we assume that all keys are controlled by the did
  for (let [publicKey, name] of Object.entries(doc.authSignatures)) {
    addPublicKey(c, {
      name,
      publicKey,
      did: id,
      controller: id,
    });
  }

  try {
    let pointer = JSON.parse(doc.content);
    let { type } = pointer;
    switch (type) {
      case "ipfs":
        let result = await readMetadata(pointer.cid);
        console.log("DID Metadata (Stored on IPFS)", result);

        // just append it to the DID document
        c = { ...c, ...result };
        break;
      default:
        console.log("Unrecognized content type:", type);
    }
  } catch (e) {
    console.log("Unrecognized DID content", doc.content);
  }

  return { didDocument: c };
}

export async function readMetadata(cid) {
  let ipfs = IPFS.at("https://ipfs.infura.io:5001");

  let result = await ipfs.cat(cid);
  result = JSON.parse(result);
  return result;
}

export async function uploadMetadata(metadata) {
  let ipfs = IPFS.at("https://ipfs.infura.io:5001");

  // metadata has to be an object
  let content = JSON.stringify(metadata);
  console.log("[ipfs] Storing in IPFS", content);
  let cid = await ipfs.add(content);
  console.log("[ipfs]", cid);
  return cid;
}
