"use sever"
import type { NextApiRequest, NextApiResponse } from 'next'

import puppeteer, { Page } from "puppeteer";
import fs from "fs";

const YOUTUBE_SEARCH_URL = "https://www.youtube.com/results";
const ALBUM_URL =
  "https://musicbrainz.org/release/de2c9c1d-62e6-40f3-b55e-56389992777a"; // 👈 fill this

type AlbumData = {
  albumTitle: string;
  albumCover: string;
  albumYear: string;
  songsName: string[];
};

const wait = (time: number = 300) =>
  new Promise((res) => {
    const timerId = setTimeout(() => {
      clearTimeout(timerId);
      res(true);
    }, time);
  });

const getUrl = (baseUrl: string, query?: string) => {
  const url = new URL(baseUrl);
  if (query) {
    const params = new URLSearchParams();
    params.append("search_query", query);
    url.search = params.toString();
  }
  return url.toString();
};

const getAlbumData = async (page: Page) => {
  return await page.evaluate(() => {
    const songsName = (
      Array.from(document.querySelectorAll("tbody tr td.title")) as HTMLElement[]
    ).map((c) => c.innerText.split("\n")[0].trim());
  
    const albumTitle = document.querySelector("h1")?.innerText;
    if (!albumTitle) throw Error("Error: Can't detect album title");

    const albumCover = (
      document.querySelector(".artwork-image") as HTMLAnchorElement
    )?.href;
    const albumYear = (document.querySelector(".release-date") as HTMLElement)
      ?.innerText;

    const albumData: AlbumData = {
      albumTitle,
      albumCover,
      albumYear,
      songsName,
    };
    console.log({ albumData });
    return albumData;
  });
};

const getSongLink = async (page: Page) => {
  return await page.evaluate(() => {
    const videoTitle = document.querySelector(
      "a#video-title"
    ) as HTMLAnchorElement;

    if (!videoTitle) return "";
    return videoTitle.href;
  });
};

const buildTemplate = (
  albumTitle: string,
  albumCover: string,
  albumYear: string,
  songs: { title: string; youtubeId: string }[]
) => {
  const albumCoverData = albumCover ? `thumbnail="${albumCover}"` : "\r";
  const albumYearData = albumYear ? `year="${albumYear}"` : "\r";
  const data = songs.reduce(
    (acu, cur) => `${acu}\t\t\t${JSON.stringify(cur)},\n`,
    ""
  );
  const songsData = `[\n${data}\t\t]`;
  return `
<AlbumMusic
    title="${albumTitle}"
    ${albumCoverData}
    ${albumYearData}
    songs={${songsData}}
/>
`;
};

const getQueryParameter = (url: string, queryParameter: string): string => {
  const urlObj = new URL(url);
  const params = urlObj.searchParams;
  return params.get(queryParameter) || "";
};

const getAlbum = async (albumUrl:string) => {
  if (!albumUrl) throw Error("Error: Album url is empty!");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });

  await page.goto(albumUrl);
  console.log("0/n");
  const { songsName, albumTitle, albumCover, albumYear } = await getAlbumData(
    page
  );
  console.log("1/n");

  const songs = [];
  for (let i = 0; i < songsName.length; i++) {
    const c = songsName[i];
    const searchQuery = `${albumTitle} | ${c}`;
    const searchUrl = getUrl(YOUTUBE_SEARCH_URL, searchQuery);
    console.log("11 ->", searchUrl);
    await page.goto(searchUrl);
    await wait();
    console.log("12");
    const link = await getSongLink(page);
    console.log("13", link);
    const videoId = getQueryParameter(link, "v");
    console.log(`${i + 2}/${songsName.length + 1}`, videoId);
    songs.push({ title: c, youtubeId: videoId });
  }
  const template = buildTemplate(albumTitle, albumCover, albumYear, songs);
  console.log("✅ done!");
  console.log({template})
  fs.writeFileSync("./template.txt", template);
  await browser.close();
  return template
}

type ResponseData = {
  message: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
try {
  const {param} = req.query
  if(!param || typeof param !== 'string'){
    res.status(400).json({message: 'Invalid parameter or missing write'})
    return
  }

  const albumData = await getAlbum(param)
  
  res.status(200).json({ message: albumData })
  return albumData
} catch (error) {
  res.status(500).json({message: 'an error ocurred, try again later'})
}
}