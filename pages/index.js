import Head from 'next/head'
import Image from 'next/image'
import Button from '../components/Button'

import { fcl } from '../utils/did-provider'


export default function Home() {
  return (
    <div className="" style={{ minHeight: '95vh' }}>
      <Head>
        <title>Flow Name Service</title>
        <meta name="description" content="Your decentralized ID provider" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="border rounded-2xl mx-auto max-w-xl p-4 mt-48 flex flex-col">
        <div>
          <Button onClick={async () => {
            console.log("hahaha")
          }} >Create Collection</Button>
        </div>

      </main>
    </div>

  )
}