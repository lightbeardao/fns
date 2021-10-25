import Head from 'next/head'
import Image from 'next/image'
import Button from '../components/Button'
import { useState } from 'react'

import { Transactions } from '../utils/flow/Transactions'
import { mutate, query, tx, authenticate, currentUser } from '@onflow/fcl'


export default function Home() {
  const [status, setStatus] = useState('Create a collection to start')
  const [error, setError] = useState('')

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
        if (res.statusCode === 0) {
          setStatus('Processing...')
        } else if (res.statusCode === 1) {
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
      <main className="border rounded-2xl mx-auto max-w-xl p-4 mt-48 flex flex-col">
        <p><strong>Status: </strong>{status}</p>
        {error && <p class="text-red-700">{error}</p>}

        <div>
          <Button onClick={async () => {
            await createCollection()
          }} >Create Collection</Button>
        </div>
        <div>

          <Button onClick={async () => {
            await authenticate()
            const cc = await currentUser().snapshot()
            console.log('Current user', cc)
          }}>Get current user (fcl)</Button>

        </div>

      </main>
    </div>

  )
}