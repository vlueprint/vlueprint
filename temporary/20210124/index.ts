import fs from 'fs'
import * as N3 from 'n3'
import { DataFactory } from 'n3'

const { namedNode, literal, defaultGraph, quad } = DataFactory;

interface TurtleInfo {
  quads: N3.Quad[]
  base: string,
  prefixes: { [key: string]: string }
  path: string
}

interface fromto {
  from: string,
  to: string,
}

const parse = (path: string) => {
  const text = fs.readFileSync(path, 'utf-8')
  const parser = new N3.Parser();
  const quads = parser.parse(text)
  return {
    quads: quads,
    base: (parser as any)._base,
    prefixes: (parser as any)._prefixes,
    path: path
  } as TurtleInfo
}

const write = async (turtleInfo: TurtleInfo) => {
  const { quads, base, prefixes, path } = turtleInfo

  const writer = new N3.Writer({ prefixes: prefixes })

  // 書き出すときの書式を弄っているけど複雑なので気にしなくていいです
  const replaceFunction = (proxied: { apply: Function }) => {
    (writer as any)._writeQuad = function (subject: { equals: Function }) {
      if (!subject.equals(this._subject)) {
        this._write(this._subject === null ? '' : ';\n    .\n\n')
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
      result = `@base <${base}> .\n\n` + result.replace(baseReg, '')
      result = result.slice(0, -2) + ';\n    .\n';
      fs.writeFileSync(path, result)
      resolve(null)
    })
  })
}

const main = async () => {
  const parseret = parse('../../sparql-endpoint/toLoad/resource-VirtualBeing.ttl')
  let quads = parseret.quads
  const store = new N3.Store(quads)
  const target = [
    "https://vlueprint.org/resource/にじさんじ(1・2期生)",
    "https://vlueprint.org/resource/にじさんじ(ゲーマーズ出身)",
    "https://vlueprint.org/resource/にじさんじ(統合後)",
    "https://vlueprint.org/resource/にじさんじ(SEEDs出身)",
  ]
  quads.forEach( q => {
    if( q.predicate.value == "https://vlueprint.org/schema/belongTo" && target.includes(q.object.value) ) {
      store.addQuad(q.subject, namedNode("https://vlueprint.org/schema/belongTo"), namedNode("https://vlueprint.org/resource/にじさんじ"))
      store.addQuad(q.subject, namedNode("https://vlueprint.org/schema/tag"), q.object)
      store.removeQuad(q)
    }
  })
  parseret.quads = store.getQuads(null, null, null, null)
  await write(parseret)
}

main()
