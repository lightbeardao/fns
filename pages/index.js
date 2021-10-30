import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Layout from '../components/Layout'
import { mutate, query, tx, authenticate, unauthenticate, currentUser, verifyUserSignature } from '@onflow/fcl'
import { useAuth } from '../providers/AuthProvider'
import { Transactions, Scripts } from '../utils/flow'


export default function Home() {
  const { user, loggedIn, logIn, logOut } = useAuth()
  const [names, setNames] = useState({})

  useEffect(async () => {
    try {
      let res = await query({
        cadence: Scripts.LIST_MY_NAMES,
        args: (arg, t) => [arg(user?.addr, t.Address)]
      })
      setNames(res)
    } catch (err) {
      console.log(err)
    }

  }, [])

  // dunno how to make modals yet
  let displayButtons = false;

  return (
    <Layout title="Home">
      <main id="start-of-content" class="w-full mx-auto mt-6 mb-16 sm:mt-8 px-2.5 lg:px-7 max-w-screen-md">
        <div class="flex justify-between px-2.5 lg:px-0 items-center">
          <h1 class="text-gray-700 text-2xl font-normal">Your Names</h1>
          {displayButtons && (
            <div class="flex items-stretch gap-4">
              <button class="transition inline-block focus-visible:ring-2 focus-visible:ring-black focus:outline-none py-2.5 px-6 text-base text-gray-600 font-medium  border border-gray-300 rounded-xl hover:shadow hidden lg:inline h-full" alternate="true" title="Create a new playground" >New Playground</button>

              <a alternate="true" href="/new" small="true" id="new" class="transition inline-block focus-visible:ring-2 focus-visible:ring-black focus:outline-none py-2.5 px-6 text-base text-gray-600 font-medium  border border-gray-300 rounded-xl hover:shadow h-full">+&nbsp;&nbsp;&nbsp;New Project</a>
            </div>
          )}
        </div>
        <div class="mt-4"><div>
          {Object.entries(names).map(([key, value]) => (
            <Card name={key} signatures={value} />
          ))}
        </div>
        </div>
      </main>
    </Layout>

  )
}
