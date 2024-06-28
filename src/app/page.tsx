"use client";

import { useState } from "react";

export default function Home() {
  const [searchUrl, setSearchUrl] = useState("");
  const [template, setTemplate] = useState("");

  const getData = async () => {
    const data = await fetch("http://localhost:3000/api/hello", {
      method: "GET",
    });
    console.log({ data });
    const response = await data.json();
    console.log({ response });
    const res = response.message;
    console.log({ res });
    setTemplate(res);
  };
  getData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-242345678">
      <form action="" className="flex gap-4 items-center justify-center">
        <input
          type="url"
          name=""
          id=""
          value={searchUrl}
          onChange={(e) => setSearchUrl(e.target.value)}
          className="text-black"
        />
        <button className="hover:border hover:border-violet-400 p-2 rounded-lg">
          Search
        </button>
      </form>
      <pre className="min-w-[300px] min-h-[400px] border border-red-500 rounded-md p-8 text-rose-200">
        {template}
      </pre>
    </main>
  );
}
