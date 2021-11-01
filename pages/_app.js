import "../styles/globals.css";

import { IdProvider } from "@radix-ui/react-id";
import AuthProvider from "../providers/AuthProvider";
import TransactionProvider from "../providers/TransactionProvider";

import "../utils/config";

function MyApp({ Component, pageProps }) {
  return (
    <IdProvider>
      <AuthProvider>
        <TransactionProvider>
          <Component {...pageProps} />
        </TransactionProvider>
      </AuthProvider>
    </IdProvider>
  );
}

export default MyApp;
