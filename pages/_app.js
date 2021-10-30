import '../styles/globals.css'

import { IdProvider } from '@radix-ui/react-id';
import AuthProvider from '../providers/AuthProvider';

import '../utils/config'

function MyApp({ Component, pageProps }) {
  return (
    <IdProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </IdProvider>
  )
}

export default MyApp
