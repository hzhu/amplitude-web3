import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { track } from "@amplitude/analytics-browser";

const Page1: NextPage = () => {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  // server doesn't know user is connected or not, so only render on client
  // alternatively, let the server know if user is connected, easier in remix, doable in next
  useEffect(() => setMounted(true), []);

  return (
    <div>
      <h1>PAGE 1</h1>
      <Link href="/">Home</Link>
      <h2>Anyone can like dog coins</h2>
      <button
        onClick={() => {
          alert("I like Doge.");
          track("Dogecoin");
        }}
      >
        Doge
      </button>
      {isConnected && mounted ? (
        <div>
          <h2>Only connected users can like BTC and ETH</h2>
          <button
            onClick={() => {
              alert("I like Bitcoin.");
              track("Bitcoin");
            }}
          >
            BTC
          </button>
          <button
            onClick={() => {
              alert("I like Ethereum");
              track("Ethereum");
            }}
          >
            ETH
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Page1;
