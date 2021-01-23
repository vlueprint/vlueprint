import fs from 'fs'
import * as N3 from 'n3'
import { DataFactory } from 'n3'
import * as cheerio from 'cheerio'
import axios from 'axios'

const { namedNode, literal, defaultGraph, quad } = DataFactory;

interface VTuber {
  name: string
  ID: string
}

const getVTuberDataFromSinglePage = async (pageNum: number) => {
  const ret = [] as VTuber[]
  const { data } = await axios.get(`https://virtual-youtuber.userlocal.jp/document/ranking?page=${pageNum}`)
  const $ = cheerio.load(data)
  const eles = $(`body > div.container.container-noamp.my-3.px-0 > table > tbody > tr > td.col-name > div:nth-child(1) > a`).toArray()
  eles.forEach( (e) => {
    const ele = $(e)
    ret.push({
      name: ele.text().trim(),
      ID: ele.attr('href')!.replace("/user/", "")
    })
  })
  return ret
}

const sleep= (ms:number) => new Promise(resolve=>setTimeout(resolve,ms))

const main = async () => {
  let ret = [] as VTuber[]
  for( let i = 1; i <= 40; i++) {
    console.log(`fetch page of ${i}`)
    const vdata = await getVTuberDataFromSinglePage(i)
    await sleep(1000)
    ret = ret.concat(vdata)
  }
  console.log(ret)
  fs.writeFileSync("./data.json", JSON.stringify(ret, null, 2))
}

main()
