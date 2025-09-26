"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [getRes, setGetRes] = useState<string>("");
  const [postRes, setPostRes] = useState<string>("");
  const [longRes, setLongRes] = useState<string>("");
  const [loading, setLoading] = useState<string>("");

  async function callApi(method: 'GET' | 'POST', url: string, body?: Record<string, unknown>, setRes?: (v: string) => void) {
    setLoading(url);
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      setRes && setRes(JSON.stringify(data));
    } catch (e: unknown) {
      if (setRes) {
        setRes(
          typeof e === "string"
            ? e
            : e instanceof Error
            ? e.message
            : "error"
        );
      }
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
 

  <div className="flex gap-4 items-center flex-col sm:flex-row">
        <div className="flex flex-col gap-4 mt-8">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading === '/api/test'}
            onClick={() => callApi('GET', '/api/test', undefined, setGetRes)}
          >
         Call Test GET API
          </button>
          <div className="break-all text-xs text-gray-700 dark:text-gray-300">{getRes}</div>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            disabled={loading === '/api/test'}
            onClick={() => callApi('POST', '/api/test', { foo: 'bar' }, setPostRes)}
          >
            Call Test POST API (1 min delay)
          </button>
          <div className="break-all text-xs text-gray-700 dark:text-gray-300">{postRes}</div>

          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            disabled={loading === '/api/test/long'}
            onClick={() => callApi('GET', '/api/test/long', undefined, setLongRes)}
          >
            Call Long GET API (5 min delay)
          </button>
          <div className="break-all text-xs text-gray-700 dark:text-gray-300">{longRes}</div>
        </div>
         
        </div>
      </main>

    </div>
  );
}
