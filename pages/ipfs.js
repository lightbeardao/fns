import Form from '../components/Form'
import Layout from '../components/Layout'
import { useState } from 'react'
import assert from 'assert'
import Head from 'next/head'
import { Transactions, Scripts } from '../utils/flow'
import { mutate, query, tx, authenticate, unauthenticate, currentUser, verifyUserSignature } from '@onflow/fcl'

import namehash from 'eth-ens-namehash'
import IPFS from 'nano-ipfs-store'


function emptyDIDDocument(id) {
  return {
    "@context": ["https://w3id.org/did/v1"],
    "id": `did:flow:${id}`,
    "verificationMethod": [],
    "authentication": [],
    "keyAgreement": [],
    "services": [],
  }
}

function addService(c, { name, type }) {
  c.services.push({
    name, type
  })
}
function addPublicKey(c, { name, publicKey, controller, did }) {
  let key = {
    id: `${did}#${name}`,
    type: "EcdsaSecp256k1RecoveryMethod2020",
    controller,
    publicKeyHex: publicKey
  };

  c.verificationMethod.push(key)
  c.authentication.push(key)
}

function name2did(name) {
  let hash = namehash.hash(name)
  let did = `did:flow:${hash}`
  console.log(`\n\n[DID] Calculating hash for ${name}...`)
  console.log(`[DID] ${did}`)
  return did
}

async function saveToIPFS(content) {
  let ipfs = IPFS.at("https://ipfs.infura.io:5001");

  console.log("[ipfs] Storing in IPFS", content)
  let cid = await ipfs.add(content)
  console.log("[ipfs]", cid)
  return cid;
}

async function parseDID(doc) {
  if (!doc) return null;

  let id = doc.name;
  let c = emptyDIDDocument(id)
  console.log("Raw document", doc)

  // for now, we assume that all keys are controlled by the did
  for (let [publicKey, name] of Object.entries(doc.authSignatures)) {
    addPublicKey(c, {
      name,
      publicKey,
      did: id,
      controller: id
    })
  }

  try {
    let pointer = JSON.parse(doc.content);
    let { type } = pointer;
    switch (type) {
      case "ipfs":
        let ipfs = IPFS.at("https://ipfs.infura.io:5001");
        console.log("Let's retrieve this pointer from IPFS...")
        console.log('->', pointer.cid)
        let result = await ipfs.cat(pointer.cid)
        console.log('->', result)
        break;
      default:
        console.log("Unrecognized content type:", type)
    }

  } catch (e) {
    console.log("Unrecognized DID content", doc.content)
  }

  return { didDocument: c }

}


export default function Home() {
  const [status, setStatus] = useState('Hi there')
  const [error, setError] = useState('')

  const resolveFlowname = async (name) => {
    try {

      let res = await query({
        cadence: Scripts.LOOKUP_NAME,
        args: (arg, t) => [arg(name, t.String)]
      })
      return res;
    } catch (err) {
      console.info(`[FlowNames] ${name} is not registered yet :)`)
    }
  }

  // by default, DIDs are FlowNames
  // with id: default, signature: (publicKey)
  const registerDid = async (name, url) => {
    await submitFlowTx({
      cadence: Transactions.REGISTER_DID,
      args: (arg, t) => [arg(name, t.String), arg(url, t.String)]
    })
  }

  const changeDocument = async (name, url) => {
    await submitFlowTx({
      cadence: Transactions.CHANGE_DOCUMENT,
      args: (arg, t) => [arg(name, t.String), arg(url, t.String)]
    })
  }

  const submitFlowTx = async ({ cadence, args }) => {
    try {
      setError('')
      let transactionId = await mutate({
        cadence,
        args,
        limit: 100
      })
      console.log("tx:", transactionId)
      tx(transactionId).subscribe(res => {
        console.log(res)
        setStatus(res.status)
        if (res.errorMessage) {
          setError(res.errorMessage)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <Layout title="ipfs">
      <main className="border rounded-2xl mx-auto max-w-xl p-4 flex flex-col gap-2">
        <p><strong>Status: </strong>{status === 3 ? "almost done..." : status === 4 ? "done" : typeof (status) === 'string' ? status : "processing..."}</p>
        {error && <p className="text-red-700">{error}</p>}

        <Form
          fields={[
            { placeholder: 'ENS-type name (e.g. alice.flow)' },
          ]}
          title='Resolve DID'
          callback={async ([name]) => {
            let did = name2did(name)
            let res = await resolveFlowname(did);
            let doc = await parseDID(res)
            console.log(doc)
          }}>Resolve DID</Form>

        <Form
          fields={[
            { placeholder: 'ENS-type name (e.g. alice.flow)' },
          ]}
          title='Register DID'
          callback={async ([name]) => {
            let did = name2did(name)
            await registerDid(did, "nothing");
          }}>Register</Form>

        <Form
          fields={[
            { placeholder: 'ENS-type name (e.g. alice.flow)' },
            { placeholder: 'content' },
          ]}
          title='Set Metadata'
          callback={async ([name, content]) => {
            let did = name2did(name)

            // check that it parses
            try {
              let c = JSON.stringify(JSON.parse(content));
              let cid = await saveToIPFS(c);
              console.log("[FlowNames] Storing IPFS pointer on Flow")
              await changeDocument(did, JSON.stringify({ type: "ipfs", cid }));
            } catch {
              console.error("JSON content only")
            }
          }}>Save IPFS Content</Form>

      </main>
    </Layout >

  )
}