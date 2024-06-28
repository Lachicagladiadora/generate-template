"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [searchUrl, setSearchUrl] = useState("");
  const [template, setTemplate] = useState("");

  const getData = async (url: string) => {
    setTemplate("... Loading");
    const data = await fetch(`http://localhost:3000/api/hello?param=${url}`, {
      method: "GET",
    });
    console.log({ data });
    const response = await data.json();
    console.log({ response });
    const res = response.message;
    console.log({ res });
    setTemplate(res);
  };

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(searchUrl);
    console.log("onSearch");
    setSearchUrl("");
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(template);
      console.log("succes");
    } catch (error) {
      console.error({ error });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-242345678">
      <form
        action=""
        className="flex gap-4 items-center justify-center"
        onSubmit={(e) => onSearch(e)}
      >
        <input
          type="url"
          name=""
          id=""
          value={searchUrl}
          onChange={(e) => setSearchUrl(e.target.value)}
          className="text-black"
        />
        <button
          className="hover:border hover:border-violet-400 p-2 rounded-lg"
          onClick={() => console.log("search")}
        >
          Search
        </button>
      </form>
      <pre className="min-w-[300px] min-h-[400px] max-h-[50vh] border border-red-500 rounded-md p-8 text-rose-200 relative overflow-auto">
        <button
          className="absolute -top-0 -left-0 p-2 rounded-lg border border-green-400 bg-green-950"
          onClick={onCopy}
        >
          copy
        </button>
        {template}
      </pre>
    </main>
  );
}
