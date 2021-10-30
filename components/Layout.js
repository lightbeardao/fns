import Head from 'next/head'
import BackgroundGradient from './background/Gradient'
import Header from './background/Header'

export default function Layout({ children, title }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{title || 'Flow Name Service'}</title>
        <meta name="description" content="Your decentralized ID provider" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BackgroundGradient />
      <Header />

      {children}

    </div>
  )
}