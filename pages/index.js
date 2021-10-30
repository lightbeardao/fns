import { useState, useEffect } from 'react'
import Button from '../components/Button'
import Layout from '../components/Layout'
import { mutate, query, tx, authenticate, unauthenticate, currentUser, verifyUserSignature } from '@onflow/fcl'
import { useAuth } from '../providers/AuthProvider'
import { Transactions, Scripts } from '../utils/flow'

let Card = ({ name }) => {
  let url = `/${name}`

  return (
    <div class="min-w-full">
      <a class="flex flex-col lg:flex-row lg:items-center w-full bg-white rounded-2xl transition shadow-slight hover:shadow-lg backdrop-filter backdrop-blur-3xl p-8 lg:p-10 mt-4" href={url}>
        <div class="flex items-center">
          <img class="h-14 w-14 mr-6 lg:mr-8" src="/img/avatars/1.png" alt="Project Avatar of 8a71da08-6c11-47ab-a25a-24f4b2ebec58" />
          <div>
            <h4 class="font-medium text-xl">{name}</h4>
          </div>
        </div>
        <div className="order-last">
          <Button>View</Button>
        </div>

        <p class="text-gray-400 text-sm text-center lg:ml-auto mt-4 lg:mt-0">Last updated <span title="Fri, June 11, 2021, 8:15:09 AM">4 mo. ago</span></p>
      </a>
    </div>
  )
}

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
    <Layout>
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
            <Card name={key} />
          ))}
        </div>
        </div>
      </main>
    </Layout>

  )
}
