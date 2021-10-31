import { useState, useEffect } from 'react'
import Link from 'next/Link'
import Button from '../components/DivButton'
import Layout from '../components/Layout'
import { mutate, query, tx, authenticate, unauthenticate, currentUser, verifyUserSignature } from '@onflow/fcl'
import { useAuth } from '../providers/AuthProvider'
import { Transactions, Scripts } from '../utils/flow'
import cx from 'classnames'
import { getDID } from '../utils/did-helper'


const RegistrationPanel = ({ name, did }) => {
  return (
    <div class="flex items-baseline gap-6">
      <h1 className="text-gray-400 text-2xl font-bold">{name} <span className="text-gray-500">is available</span></h1>
      <Link href={`/register/${name}`}>
        <Button onClick={async () => {
          try {
            let res = await query({
              cadence: Scripts.LOOKUP_NAME,
              args: (arg, t) => [arg(did, t.String)]
            })
            console.log("seems like it's registered", res)
          } catch (err) {
            // good to go!
            console.log("not registered yet!")
          }
        }}>Register</Button>
      </Link>

    </div>

  )
}

const EmptyState = () => {
  let [text, setText] = useState('');
  let [did, setDID] = useState('');
  let [error, seterror] = useState(null);
  let placeholder = 'Your username'

  useEffect(async () => {
    try {
      let did = getDID(text)
      setDID(did)

      try {
        let res = await query({
          cadence: Scripts.LOOKUP_NAME,
          args: (arg, t) => [arg(did, t.String)]
        })
        console.log(`${text}`, res)
        seterror(`Whoa! You found ${text} (registered)`)
      } catch (err) {
        // good to go!
        console.log(`${text} - not registered yet!`)
        seterror(null);
      }
    } catch (e) {
      if (text.includes(' ')) {
        seterror("FlowNames says: no spaces!")
      } else {
        seterror("Uh-oh! something went wrong.. try again?");
      }
    }
  }, [text])

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-green-300 leading-relaxed text-right text-6xl font-bold">Your DID <br />Starts here</h1>
      <p className="text-green-300 leading-relaxed text-lg font-bold">You can register any ENS address, and also special ones!</p>
      <form className="w-full rounded p-4 flex items-center gap-4" autoComplete="off">
        <div className="w-full" style={{ flexGrow: 1 }}>
          <input className={cx(error ? "text-red-300" : "text-green-300", "text-center text-3xl font-semibold bg-gradient-to-r from-gray-50 to-white appearance-none border-b-2 border-blue-50 rounded py-6 px-3 leading-tight focus:outline-none focus:shadow-outline w-full")} id="text" type="text" placeholder={placeholder} key={placeholder} value={text} onChange={e => {
            setText(e.target.value)
          }}></input>
        </div>
      </form >

      {error ?
        <div class="flex flex-col items-end">
          <p className="text-gray-400 font-bold">{error}</p>
        </div>
        :
        <RegistrationPanel name={text} did={did} />
      }
    </div>
  )
}

export default function Home() {
  const { user, loggedIn, logIn, logOut } = useAuth()
  const [names, setNames] = useState(null)

  useEffect(async () => {
    try {
      let res = await query({
        cadence: Scripts.LIST_MY_NAMES,
        args: (arg, t) => [arg(user?.addr, t.Address)]
      })
      setNames(null)
    } catch (err) {
      console.log(err)
    }

  }, [])

  return (
    <Layout title="Welcome to FlowNames">
      <main id="start-of-content" className="w-full mx-auto mt-6 mb-16 sm:mt-8 px-2.5 lg:px-7 max-w-screen-md">
        {names ? <Content names={names} /> : <EmptyState />}
      </main>
    </Layout>
  );
}
