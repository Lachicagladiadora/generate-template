"use client";
import { useState } from "react";

export default function Home() {
  const [searchUrl, setSearchUrl] = useState<
    string | number | readonly string[] | undefined
  >("");

  const [template, setTemplate] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
      <form action="" className="flex gap-4 items-center justify-center">
        <input
          type="url"
          name=""
          id=""
          value={searchUrl}
          onChange={(e) => setSearchUrl(e.target.value)}
        />
        <button className="hover:border hover:border-violet-400 p-2 rounded-lg">
          Search
        </button>
      </form>
      <div className="border border-red-500 rounded-md p-8 text-rose-200">
        {template}
      </div>
    </main>
  );
}
