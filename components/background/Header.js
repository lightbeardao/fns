import { query } from "@onflow/fcl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Scripts } from "../../utils/flow";

export default function Header() {
  const [count, setCount] = useState("");
  useEffect(async () => {
    let res = await query({
      cadence: Scripts.REGISTER_COUNT,
    });
    if (res) setCount(res);
  }, []);

  return (
    <header className="text-gray-500 w-full h-12 lg:h-20 px-3 lg:px-14 relative flex justify-between items-center mb-12 ">
      <p className="flex items-center text-sm">
        <Link href="/">
          <a title="Go to Home" className="flex items-center flex-shrink-0">
            <img
              src="/img/logo3.svg"
              alt="deno logo"
              className="w-7 h-7 flex-shrink-0"
            />
            <span className="hidden sm:inline ml-3 text-xs bg-gray-200 py-0.5 px-2 rounded-md">
              BETA {process.env.NEXT_PUBLIC_VERSION}
            </span>
          </a>
        </Link>
        <span className="mx-2 lg:mx-4 opacity-50">/</span>
        <span className="font-medium opacity-50 last:opacity-100 whitespace-nowrap">
          {count ? `${count} names registered!` : "mwufi"}
        </span>
      </p>

      <div className="hidden lg:flex items-center space-x-8">
        <Link href="/register">
          <a
            textclass="text-sm text-gray-500"
            className="focus-visible:ring-2 focus-visible:ring-black focus:outline-none hover:underline text-sm text-gray-500"
          >
            + New
          </a>
        </Link>
        <Link href="/ipfs">
          <a
            textclass="text-sm text-gray-500"
            className="focus-visible:ring-2 focus-visible:ring-black focus:outline-none hover:underline text-sm text-gray-500"
          >
            DID Playground
          </a>
        </Link>

        <a
          href={process.env.NEXT_PUBLIC_FEEDBACK_SITE}
          textclass="text-sm text-gray-500"
          external="true"
          target="_blank"
          rel="noopener noreferrer"
          className="focus-visible:ring-2 focus-visible:ring-black focus:outline-none hover:underline  text-sm text-gray-500"
        >
          Feedback
        </a>

        <a
          href={process.env.NEXT_PUBLIC_DOCS_SITE}
          textclass="text-sm text-gray-500"
          className="focus-visible:ring-2 focus-visible:ring-black focus:outline-none hover:underline  text-sm text-gray-500"
        >
          Docs
        </a>

        <Link href="/account">
          <a>
            <img
              src="https://avatars.githubusercontent.com/u/30219253?v=4"
              alt="Zen Tang avatar image"
              className="rounded-full w-7 h-7 "
            />
          </a>
        </Link>
      </div>

      <button
        aria-label="Navigation Menu Toggle"
        className="h-6 focus-visible:ring-2 focus-visible:ring-black focus:outline-none transition  text-black hover:text-gray-500 flex flex-gap-x-2 items-center justify-center pl-4 inline-block lg:hidden text-gray-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 "
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
    </header>
  );
}
