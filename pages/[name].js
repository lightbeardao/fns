import Head from 'next/head'
import BackgroundGradient from '../components/background/Gradient'
import Header from '../components/background/Header'
import { useRouter } from 'next/router'

export default function Home({ data }) {
  const router = useRouter()
  const { name } = router.query
  const emoji = '🦄'

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{name} - FlowNames</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BackgroundGradient />
      <Header />

      <main id="start-of-content" className="w-full mx-auto mt-6 mb-16 sm:mt-8 px-2.5 lg:px-7 max-w-screen-md">
        <div className="flex justify-between px-2.5 lg:px-0 items-center">
          <h1 className="text-gray-700 text-2xl font-normal">{emoji} {name}</h1>
          <div className="flex items-stretch gap-4">
            <button className="transition inline-block focus-visible:ring-2 focus-visible:ring-black focus:outline-none py-2.5 px-6 text-base text-gray-600 font-medium  border border-gray-300 rounded-xl hover:shadow hidden lg:inline h-full" alternate="true" title="Create a new playground" >New Playground</button>

            <a alternate="true" href="/new" small="true" id="new" className="transition inline-block focus-visible:ring-2 focus-visible:ring-black focus:outline-none py-2.5 px-6 text-base text-gray-600 font-medium  border border-gray-300 rounded-xl hover:shadow h-full">+&nbsp;&nbsp;&nbsp;New Project</a>
          </div>
        </div>
        <div className="mt-4"><div>
          <div className="min-w-full">
            <a className="flex flex-col lg:flex-row lg:items-center w-full bg-white rounded-2xl transition shadow-slight hover:shadow-lg backdrop-filter backdrop-blur-3xl p-8 lg:p-10 mt-4" href="/projects/warm-ant-46">
              <div className="flex items-center">
                <img className="h-14 w-14 mr-6 lg:mr-8" src="/img/avatars/1.png" alt="Project Avatar of 8a71da08-6c11-47ab-a25a-24f4b2ebec58" />
                <div>
                  <h4 className="font-medium text-xl">warm-ant-46</h4>
                </div>
              </div>
              <button className="transition inline-block focus-visible:ring-2 focus-visible:ring-black focus:outline-none py-2.5 px-6 text-base text-gray-600 font-medium   rounded-lg hover:shadow-lg lg:order-last lg:ml-5 mt-8 lg:mt-0" style={{ background: 'linear-gradient(279.56deg, rgb(238, 255, 245) -52.57%, rgb(186, 233, 239) 126.35%)' }}>View</button>

              <p className="text-gray-400 text-sm text-center lg:ml-auto mt-4 lg:mt-0">Last updated <span title="Fri, June 11, 2021, 8:15:09 AM">4 mo. ago</span></p>
            </a>
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
  const res = await fetch(`${NEXT_PUBLIC_API}/api/hello`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}
