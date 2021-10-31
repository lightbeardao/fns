import Form from '../components/Form'
import Layout from '../components/Layout'
import { useState } from 'react'
import assert from 'assert'
import Head from 'next/head'
import { Transactions, Scripts } from '../utils/flow'
import { mutate, query, tx, authenticate, unauthenticate, currentUser, verifyUserSignature } from '@onflow/fcl'
import {getDID} from '../utils/did-helper'

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

async function uploadMetadata(metadata) {
  let ipfs = IPFS.at("https://ipfs.infura.io:5001");

  // metadata has to be an object
  let content = JSON.stringify(metadata)
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
        let result = await ipfs.cat(pointer.cid)
        result = JSON.parse(result);
        console.log('DID Metadata (Stored on IPFS)', result)

        // just append it to the DID document
        c = { ...c, ...result }
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


  // Create a DID
  // 1. Store data on IPFS
  // 2. Create FlowName with id: default, signature: (publicKey),
  // and content: pointer to data
  const registerDid = async (name, metadata) => {
    let cid = await uploadMetadata(metadata)
    let embeddedContent = JSON.stringify({
      type: "ipfs",
      cid
    })

    await submitFlowTx({
      cadence: Transactions.REGISTER_DID,
      args: (arg, t) => [arg(name, t.String), arg(embeddedContent, t.String)]
    })
  }

  // Updating a DID
  // 1. Store data on IPFS
  // 2. Update pointer in Flow
  const updateMetadata = async (name, metadata) => {
    let cid = await uploadMetadata(metadata);
    console.log("[FlowNames] Storing IPFS pointer on Flow")
    let embeddedContent = JSON.stringify({
      type: "ipfs",
      cid
    })

    await submitFlowTx({
      cadence: Transactions.CHANGE_DOCUMENT,
      args: (arg, t) => [arg(name, t.String), arg(embeddedContent, t.String)]
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
      console.log("You'll see 4 updates... status: 4 means your transaction is finished, but testnet takes a while! (~20s)")
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
            let did = getDID(name)
            let res = await resolveFlowname(did);
            let doc = await parseDID(res)
            console.log(`${name} => resolved DID Document`, doc)
          }}>Resolve DID</Form>

        <Form
          fields={[
            { placeholder: 'ENS-type name (e.g. alice.flow)' },
          ]}
          title='Register DID'
          callback={async ([name]) => {
            let did = getDID(name)
            await registerDid(did, { services: [] });
          }}>Register</Form>

        <Form
          fields={[
            { placeholder: 'ENS-type name (e.g. alice.flow)' },
            { placeholder: 'metadata (has to be valid JSON)' },
          ]}
          title='Set Metadata'
          callback={async ([name, content]) => {
            let did = getDID(name)
            try {
              // check that it parses
              let metadata = JSON.parse(content);
              await updateMetadata(did, metadata);
            } catch {
              console.error("Please double check your metadata")
            }
          }}>Save IPFS Content</Form>

        <a href="/login" className="text-lg mt-4 p-2 text-indigo-600 hover:text-indigo-400">Alright. Ready to log in with your DID?</a>
      </main>
    </Layout >

  )
}