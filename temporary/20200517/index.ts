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
    base: (parser as any)._base as string,
    prefixes: (parser as any)._prefixes as { [key: string]: string }
  }
}

const write = async (path:string, options:any) => {
  const { quads, base, prefixes } = options
  const writer = new N3.Writer({ prefixes: prefixes })

  // 書き出すときの書式を弄っているが複雑なので気にしなくていいです
  const replaceFunction = (proxied: { apply: Function }) => {
    (writer as any)._writeQuad = function (subject: { equals: Function }) {
      if (!subject.equals(this._subject)) {
        this._write(this._subject === null ? '' : '.\n\n')
        this._subject = null
      }
      proxied.apply(this, arguments)
    }
  }
  replaceFunction((writer as any)._writeQuad)

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

const main = async () => {

  // ファイルパスを指定する
  const pathPerformingGroup = '../../sparql-endpoint/toLoad/resource-PerformingGroup.ttl'
  const pathVirtualBeing = '../../sparql-endpoint/toLoad/resource-VirtualBeing.ttl'

  const parseretPerformingGroup = parse(pathPerformingGroup)
  const parseretVirtualBeing = parse(pathVirtualBeing)

  const storePerformingGroup = new N3.Store(parseretPerformingGroup.quads)
  const storeVirtualBeing = new N3.Store(parseretVirtualBeing.quads)

  const base = parseretPerformingGroup.base

  // const memberTriples = storePerformingGroup.getQuads(null, 'https://vlueprint.org/schema/member', null, null)
  // const convertedTriples = memberTriples.map(value => {
  //   return quad(
  //     namedNode(value.object.value),
  //     namedNode('https://vlueprint.org/schema/belongTo'),
  //     namedNode(value.subject.value),
  //     undefined
  //   )
  // })
  // storePerformingGroup.removeQuads(memberTriples);
  // storeVirtualBeing.addQuads(convertedTriples)

  parseretPerformingGroup.quads = storePerformingGroup.getQuads(null,null,null,null)
  parseretVirtualBeing.quads = storeVirtualBeing.getQuads(null,null,null,null)

  await write(pathPerformingGroup, parseretPerformingGroup)
  await write(pathVirtualBeing, parseretVirtualBeing)
}

(async () => await main())()
