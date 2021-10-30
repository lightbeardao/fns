import Form from '../components/Form'
import Layout from '../components/Layout'
import { useState } from 'react'
import assert from 'assert'
import Head from 'next/head'

import IPFS from 'nano-ipfs-store'

function emptyDIDDocument(id) {
  return {
    "@context": "https://w3id.org/did/v1",
    "id": id,
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
    type: "EcdsaSecp256k1Signature2019",
    controller,
    publicKeyBase58: publicKey
  };

  c.verificationMethod.push(key)
  c.authentication.push(key)
}

export default function Lala() {
  const [status, setStatus] = useState('Hi there')
  const [error, setError] = useState('')

  return (
    <Layout title="ipfs">
      <main className="border rounded-2xl mx-auto max-w-xl p-4 flex flex-col gap-2">
        <p><strong>Status: </strong>{status === 3 ? "almost done..." : status === 4 ? "done" : typeof (status) === 'string' ? status : "processing..."}</p>
        {error && <p className="text-red-700">{error}</p>}

        <Form
          fields={[
            { placeholder: 'name (e.g. did:flow:03473847348281)' },
          ]}
          title='Resolve DID'
          callback={async ([did]) => {
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
          }}>Resolve DID</Form>

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