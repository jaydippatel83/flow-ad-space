import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import Layout from "../components/layout";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useRouter } from "next/router";
import { MetaMaskProvider } from "metamask-react";
import Meta from "../components/Meta";
import UserContext from "../components/UserContext";
import { useRef } from "react";
import * as fcl from "@onflow/fcl";
// import { Amplify, API } from 'aws-amplify';
// import awsmobile from '../src/aws-exports';

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

// Amplify.configure(awsmobile);

fcl
  .config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.authn.endpoint","https://fcl-discovery.onflow.org/api/testnet/authn")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");

  
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pid = router.asPath;
  const scrollRef = useRef({
    scrollPos: 0,
  });

  return (
    <>
      <Meta title="Home" />
      <Provider store={store}>
        <ThemeProvider enableSystem={true} attribute="class">
          <MetaMaskProvider>
            <UserContext.Provider value={{ scrollRef: scrollRef }}>
              {pid === "/login" ? (
                <Component {...pageProps} />
              ) : (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              )}
            </UserContext.Provider>
          </MetaMaskProvider>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;
