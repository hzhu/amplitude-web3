import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: 12,
      }}
    >
      <ConnectButton />
      <br />
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="page1">Page 1</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
