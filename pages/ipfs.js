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

function parseDID(doc) {
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

  return { didDocument: c }

}


export default function Lala() {
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
            let hash = namehash.hash(name)
            let did = `did:flow:${hash}`
            console.log(`[DID]`)
            console.log(`[DID] Calculating hash for ${name}...`)
            console.log(`[DID] ${did}`)
            console.log(`[DID]`)
            let res = await resolveFlowname(did);
            let doc = parseDID(res)
            console.log(doc)
          }}>Resolve DID</Form>

        <Form
          fields={[
            { placeholder: 'ENS-type name (e.g. alice.flow)' },
          ]}
          title='Register DID'
          callback={async ([name]) => {
            let hash = namehash.hash(name)
            let did = `did:flow:${hash}`
            console.log(`[DID]`)
            console.log(`[DID] Calculating hash for ${name}...`)
            console.log(`[DID] ${did}`)
            console.log(`[DID]`)
            await registerDid(did, "nothing");
          }}>Register</Form>

        <Form
          fields={[
            { placeholder: 'name (e.g. alice.eth)' },
            { placeholder: 'key 1' },
            { placeholder: 'service type' },
            { placeholder: 'service name' },
          ]}
          title='Save to IPFS'
          callback={async ([did, s1, stype, sname]) => {
            let ipfs = IPFS.at("https://ipfs.infura.io:5001");

            let c = emptyDIDDocument(did)
            console.log(c)
            addPublicKey(c, {
              name: "key-1",
              publicKey: s1,
              controller: did,
              did
            })
            addService(c, {
              name: sname,
              type: stype
            })

            // Upload raw data
            const data1 = JSON.stringify(c)

            const cid1 = await ipfs.add(data1);
            console.log("CID", cid1)

            // Upload string
            let result = await ipfs.cat(await ipfs.add(data1))
            console.log({
              didDocument: JSON.parse(result)
            })
          }}>Save</Form>

      </main>
    </Layout >

  )
}