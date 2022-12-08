import "../styles/global.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
  chain,
  useAccount,
  WagmiConfig,
  createClient,
  configureChains,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { useRef, useEffect } from "react";
import { init, identify, Identify } from "@amplitude/analytics-browser";

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.mainnet,
    chain.polygon,
    chain.optimism,
    chain.arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [chain.goerli]
      : []),
  ],
  [
    alchemyProvider({ apiKey: "MzUaa0A87yexjd8UKcHm8HIr1f4aghxT" }),
    publicProvider(),
  ]
);

const { wallets } = getDefaultWallets({
  appName: "RainbowKit demo",
  chains,
});

const demoAppInfo = {
  appName: "Rainbowkit Demo",
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ chains }),
      trustWallet({ chains }),
      ledgerWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function useIdentify() {
  const initializedRef = useRef(false); // was amplitude sdk initialized?
  const identifiedRef = useRef(false); // was the user identified?
  const { address } = useAccount({
    onConnect: ({ address }) => {
      if (initializedRef.current === true && identifiedRef.current === false) {
        // identify a user when they connect to an account
        console.log(`.identify(identifyObj, { user_id: ${address} })`);
        const identifyObj = new Identify();
        identify(identifyObj, { user_id: address });

        identifiedRef.current = true;
      }
    },
  });

  useEffect(() => {
    if (initializedRef.current === false) {
      // initialize the sdk when the app loads
      console.log(`7e96df35bc6183b480fb6b26ed5716e3, ${address})`);
      init("7e96df35bc6183b480fb6b26ed5716e3", address);
      initializedRef.current = true;
      if (address) {
        identifiedRef.current = true;
      }
    }
  }, [address]);
}

function MyApp({ Component, pageProps }: AppProps) {
  useIdentify();

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
