import Head from 'next/head'
import BackgroundGradient from '../../components/background/Gradient'
import Header from '../../components/background/Header'
import Button from '../../components/Button'
import { useState } from 'react'
import { useRouter } from 'next/router'

let prettyName = {
  profilePic: 'Profile Picture',
  website: 'Website',
  twitterProfile: 'Twitter'
}

const Metadata = ({ m, remove }) => {
  console.log(m)
  let { type, uri, updatedAt } = m;
  let relativeDate = updatedAt;
  // TODO: import date-fns
  // Fri, June 11, 2021, 8:15:09 AM

  return (
    <div key={m.type} className="flex flex-col lg:flex-row lg:items-center w-full bg-white rounded-2xl transition shadow-slight hover:shadow-lg backdrop-filter backdrop-blur-3xl p-8 lg:p-10 mt-4">
      <div className="flex items-center mr-auto">
        <img className="h-14 w-14 mr-6 lg:mr-8" src="/img/avatars/1.png" alt="Project Avatar of 8a71da08-6c11-47ab-a25a-24f4b2ebec58" />
        <div class="flex flex-col">
          <h4 className="font-medium text-xl">{prettyName[type] || type}</h4>
          <p className="text-gray-400">{uri}</p>
        </div>
      </div>
      <button className="transition inline-block focus-visible:ring-2 focus-visible:ring-black focus:outline-none py-2.5 px-6 text-base text-gray-600 font-medium rounded-lg hover:shadow-lg lg:order-last lg:ml-5 mt-8 lg:mt-0 bg-red-100" onClick={remove}>Delete</button>

      {updatedAt && <p className="text-gray-400 text-sm text-center lg:ml-auto mt-4 lg:mt-0">Last updated <span title={updatedAt}>{relativeDate}</span></p>}
    </div>
  )
}

export default function Home({ data }) {
  const router = useRouter()
  const { name } = router.query

  let [metadata, setMeta] = useState([])
  const addMetadata = (type, data) => {
    setMeta([...metadata, { type, ...data }])
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{name} - Create</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BackgroundGradient />
      <Header />

      <main id="start-of-content" className="w-full mx-auto mt-6 mb-16 sm:mt-8 px-2.5 lg:px-7 max-w-screen-md">
        <div className="flex justify-start gap-2 items-baseline">
          <span className="text-green-300 text-4xl">{name}</span>
          <h1 className="text-gray-700 text-2xl font-normal mr-auto">will be your new ID</h1>
          <Button onClick={() => {

          }}>Create!</Button>
        </div>
        <div className="flex justify-center gap-2 items-baseline mt-8">
          <h1 className="text-gray-500 text-lg font-medium mr-4">Want to add some metadata?</h1>
        </div>
        <div className="flex justify-center gap-2 items-baseline mt-2 mb-8">
          <Button onClick={() => {
            addMetadata('twitterProfile', { uri: 'https://twitter.com/eoverse' })

          }}>Twitter url</Button>
          <Button onClick={() => {
            addMetadata('website', { uri: 'https://source.unsplash.com/random/50x50' })

          }}>Website</Button>
          <Button onClick={() => {
            addMetadata('profilePic', { uri: 'https://source.unsplash.com/random/50x50' })
          }}>Profile Pic</Button>
        </div>
        <div className="mt-4"><div>
          <div className="min-w-full">
            {metadata.map((m, idx) => (
              <Metadata m={m} remove={() => {
                let c = [...metadata]
                c.splice(idx, 1)
                setMeta(c);
              }} />
            ))}
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`${process.env.API_NAME}/api/hello`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}
