import fs from 'fs'
import crypto from 'crypto'
import * as N3 from 'n3'
import { DataFactory } from 'n3'
const urlSlug = require('url-slug')


const { namedNode, literal, defaultGraph, quad } = DataFactory;

const parse = (path:string) => {
  const text = fs.readFileSync(path, 'utf-8')
  const parser = new N3.Parser();
  const quads = parser.parse(text)
  return {
    quads: quads,
    base: parser._base,
    prefixes: parser._prefixes
  }
}

const write = async (path:string, options:any) => {
  const { quads, base, prefixes } = options
  const writer = new N3.Writer({ prefixes: prefixes })

  // 書き出すときの書式を弄っているが複雑なので気にしなくていいです
  const replaceFunction = (proxied: { apply: Function }) => {
    writer._writeQuad = function (subject: { equals: Function }) {
      if (!subject.equals(this._subject)) {
        this._write(this._subject === null ? '' : '.\n\n')
        this._subject = null
      }
      proxied.apply(this, arguments)
    }
  }
  replaceFunction(writer._writeQuad)

  writer.addQuads(quads)
  const baseReg = new RegExp(base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
  new Promise((resolve, reject) => {
    writer.end((error, result) => {
      if (error) reject()
      const result2 = result.replace(baseReg, '')
      fs.writeFileSync(path, `@base <${base}> .\n\n` + result2)
      resolve()
    })
  })
}

const replace = (quads:N3.Quad[], sub:string, pred:string, oldObj:string, newObj:string) => {
  const store = new N3.Store(quads);
  store.removeQuads(store.getQuads(sub, pred, oldObj))
  store.addQuad(sub, pred, newObj)
  return store.getQuads()
}

const main = async () => {

  // ファイルパスを指定する
  const path = '../../sparql-endpoint/toLoad/resource-PerformingGroup.ttl'

  // ttlファイルからデータを読み込む
  // parseRet.quads に実際に読み込んだデータ
  // parseRet.base に @base で指定されている URI
  // parseRet.prefixes に @prefixe で指定されているプレフィックス一覧
  // が格納される
  const parseRet = parse(path)

  // ここで書き換えをする
  // 例: 「ヒメヒナ」の「メンバー」内の「田中ヒメ」を「田中ヒメ（かわいい）」に置き換える
  const sub = parseRet.base + 'ヒメヒナ'
  const pred = 'https://vlueprint.org/schema/member'
  const oldObj = parseRet.base + '田中ヒメ'
  const newObj = parseRet.base + '田中ヒメ(かわいい)'
  parseRet.quads = replace(parseRet.quads, sub, pred, oldObj, newObj)

  // データをファイルに書き出す
  await write(path, parseRet)
}

(async () => await main())()
