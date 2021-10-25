import Head from 'next/head'
import Image from 'next/image'
import Button from '../components/Button'
import InputButton from '../components/InputButton'
import Form from '../components/Form'
import { useState } from 'react'

import { Transactions, Scripts } from '../utils/flow'
import { mutate, query, tx, authenticate, currentUser } from '@onflow/fcl'


export default function Home() {
  const [status, setStatus] = useState('Create a collection to start')
  const [error, setError] = useState('')

  const listMyNames = async (user) => {
    let res = await query({
      cadence: Scripts.LIST_MY_NAMES,
      args: (arg, t) => [arg(user?.addr, t.Address)]
    })
    console.log(res)
  }

  const resolveFlowname = async (name) => {
    try {

      let res = await query({
        cadence: Scripts.LOOKUP_NAME,
        args: (arg, t) => [arg(name, t.String)]
      })
      console.log(res)
    } catch (err) {
      console.info(`[FlowNames] ${name} is not registered yet :)`)
    }
  }

  const registerName = async (name, signature, url) => {
    try {
      setError('')
      let transactionId = await mutate({
        cadence: Transactions.REGISTER_NAME,
        args: (arg, t) => [arg(name, t.String), arg(signature, t.String), arg(url, t.String)],
        limit: 100
      })
      console.log("tx:", transactionId)
      tx(transactionId).subscribe(res => {
        console.log(res)
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
  const createCollection = async () => {
    try {
      setError('')
      let transactionId = await mutate({
        cadence: Transactions.CREATE_COLLECTION,
        limit: 100
      })
      console.log("tx:", transactionId)
      tx(transactionId).subscribe(res => {
        console.log(res)
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
        <p><strong>Status: </strong>{status}</p>
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

        <h1 className="w-full text-xl m-2 mt-4 text-center">Read methods</h1>

        <InputButton
          placeholder='alice.eth'
          hint='Look up any Flowname'
          callback={async (msg) => {
            await resolveFlowname(msg)
          }}>Resolve</InputButton>

        <Button onClick={async () => {
          await listMyNames(await currentUser().snapshot())
        }} >List my names</Button>

        <Button onClick={async () => {
          await authenticate()
          const cc = await currentUser().snapshot()
          console.log('Current user', cc)
        }}>Get current user (fcl)</Button>


      </main>
    </div>

  )
}