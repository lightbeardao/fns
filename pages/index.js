import Head from 'next/head'
import Image from 'next/image'
import Button from '../components/Button'
import InputButton from '../components/InputButton'
import Form from '../components/Form'
import { useState } from 'react'

import { Transactions, Scripts } from '../utils/flow'
import { mutate, query, tx, authenticate, unauthenticate, currentUser } from '@onflow/fcl'

export const signMessage = async (msg) => {
  const MSG = Buffer.from(msg).toString("hex")
  try {
    let c = await currentUser().signUserMessage(MSG)
    return c
  } catch (error) {
    console.log(error)
  }
}


export default function Home() {
  const [status, setStatus] = useState(-1)
  const [error, setError] = useState('')

  const listMyNames = async (user) => {
    try {
      let res = await query({
        cadence: Scripts.LIST_MY_NAMES,
        args: (arg, t) => [arg(user?.addr, t.Address)]
      })
      console.log("Names in your wallet", res)
      console.log("Note: Some of these might be invalidated! The FlowNames contract doesn't check individual accounts :)")
    } catch (err) {
      console.log(err)
    }
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

  const resolveFlowname = async (name) => {
    try {

      let res = await query({
        cadence: Scripts.LOOKUP_NAME,
        args: (arg, t) => [arg(name, t.String)]
      })
      console.log('Contents of name', res)
      console.log('authSignatures', res.authSignatures)
    } catch (err) {
      console.info(`[FlowNames] ${name} is not registered yet :)`)
    }
  }

  const signInAs = async (name) => {
    let user = await currentUser().snapshot();
    console.log('Signing in...', name)
    try {

      let res = await query({
        cadence: Scripts.AUTHORIZED_ON_NAME,
        args: (arg, t) => [arg(user?.addr, t.Address), arg(name, t.String)]
      })
      console.log("Signed in with token:", res)
    } catch (err) {
      console.info(`[FlowNames] Can't sign in ${name}`)
    }
  }

  const addSignature = async (name, signature) => {
    await submitFlowTx({
      cadence: Transactions.ADD_SIGNATURE,
      args: (arg, t) => [arg(name, t.String), arg(signature, t.String)]
    })
  }
  const removeSignature = async (name, signature) => {
    await submitFlowTx({
      cadence: Transactions.REMOVE_SIGNATURE,
      args: (arg, t) => [arg(name, t.String), arg(signature, t.String)]
    })
  }

  const registerName = async (name, signature, url) => {
    await submitFlowTx({
      cadence: Transactions.REGISTER_NAME,
      args: (arg, t) => [arg(name, t.String), arg(signature, t.String), arg(url, t.String)]
    })
  }
  const resetCollection = async () => {
    await submitFlowTx({
      cadence: Transactions.RESET_COLLECTION
    })
  }
  const createCollection = async () => {
    try {
      setError('')
      let transactionId = await mutate({
        cadence: Transactions.CREATE_COLLECTION,
        limit: 100
      })
      console.log("tx:", transactionId)
      tx(transactionId).subscribe(res => {
        if (res.status < 4) {
          setStatus('Processing...')
        } else {
          setStatus('Done')
        }
        if (res.errorMessage) {
          setError(res.errorMessage)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="" style={{ minHeight: '95vh' }}>
      <Head>
        <title>Flow Name Service</title>
        <meta name="description" content="Your decentralized ID provider" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="border rounded-2xl mx-auto max-w-xl p-4 mt-48 flex flex-col gap-2">
        <p><strong>Status: </strong>{status === 3 ? "almost done..." : status === 4 ? "done" : typeof (status) === 'string' ? status : "processing..."}</p>
        {error && <p class="text-red-700">{error}</p>}

        <Button onClick={async () => {
          await createCollection()
        }} >Create Collection</Button>

        <Form
          fields={[
            { placeholder: 'name (e.g. alice.eth)' },
            { placeholder: 'signature' },
            { placeholder: 'content' },
          ]}
          title='Register a Flowname'
          callback={async ([name, signature, content]) => {
            await registerName(name, signature, content)
          }}>Register</Form>

        <Form
          fields={[
            { placeholder: 'name you own (e.g. alice.eth)' },
            { placeholder: 'signature' },
          ]}
          title='Add additional signature'
          callback={async ([name, signature]) => {
            await addSignature(name, signature)
          }}>Add Signature</Form>

        <Form
          fields={[
            { placeholder: 'name you own (e.g. alice.eth)' },
            { placeholder: 'signature to revoke' },
          ]}
          title='Revoke a signature'
          callback={async ([name, signature]) => {
            await removeSignature(name, signature)
          }}>Revoke</Form>
        <h1 className="w-full text-xl my-2 mt-4 text-center">Read methods</h1>

        <InputButton
          placeholder='alice.eth'
          hint='Look up any Flowname'
          callback={async (msg) => {
            await resolveFlowname(msg)
          }}>Resolve</InputButton>

        <InputButton
          placeholder='alice.eth'
          hint='Sign in as Flowname'
          callback={async (msg) => {
            await signInAs(msg)
          }}>Sign in</InputButton>

        <Button onClick={async () => {
          await listMyNames(await currentUser().snapshot())
        }} >List my names</Button>

        <Button onClick={async () => {
          await authenticate()
          const cc = await currentUser().snapshot()
          console.log('Current user', cc)
          setStatus("Logged in")
        }}>Get current user (or sign in)</Button>

        <h1 className="w-full text-xl my-2 mt-4 text-center"></h1>

        <Button onClick={async () => {
          await unauthenticate()
          setStatus("Logged out!")
        }}>Sign out</Button>

        <Form
          fields={[
            { placeholder: 'custom message' },
          ]}
          title='Sign Message'
          callback={async ([msg]) => {
            let results = await signMessage(msg)
            console.log("Signed", results)
          }}>Sign</Form>


      </main>
    </div>

  )
}