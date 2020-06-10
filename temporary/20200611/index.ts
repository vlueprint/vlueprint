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

interface DicEntry {
  yomi: string
  kanji: string
  hinshi: string
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

const validNode = (base: string, key: string) => {
  const badCharas = [
    '\\', '\'', '|', '`', '^', '"', '<', '>', '}', '{', ']', '[',
    ' ', '　', '/', ';', '/', '?', ':', '@', '&', '=', '+', '$', ',', '%', '#'
    //これは抜いた ')', '(',
  ]
  badCharas.forEach(c => { key = key.replace(new RegExp('\\' + c, 'g'), '_') })
  return namedNode(base + key.normalize("NFKC"))
}

const main = async () => {

  const vTuberDic = JSON.parse(fs.readFileSync('./VTuberDic.json', 'utf8')) as DicEntry[]

  const parseretVirtualBeing = parse('../../sparql-endpoint/toLoad/resource-VirtualBeing.ttl')
  const storeVirtualBeing = new N3.Store(parseretVirtualBeing.quads)
  const base = parseretVirtualBeing.base

  const yomiQuads = [] as N3.Quad[]
  let counter = 0;
  vTuberDic.forEach(value => {
    const vb = storeVirtualBeing.getQuads(
      null,
      namedNode("http://www.w3.org/2000/01/rdf-schema#label"),
      literal(value.kanji),
      null
    )
    if (vb.length > 0) {
      yomiQuads.push(quad(
        vb[0].subject,
        namedNode('https://vlueprint.org/schema/yomi'),
        literal(value.yomi),
        undefined
      ))
    } else {
      const subject = validNode(base, value.kanji)
      yomiQuads.push(quad(
        subject,
        namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        namedNode("https://vlueprint.org/schema/VirtualBeing"),
        undefined
      ))
      yomiQuads.push(quad(
        subject,
        namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
        literal(value.kanji),
        undefined
      ))
      yomiQuads.push(quad(
        subject,
        namedNode('https://vlueprint.org/schema/yomi'),
        literal(value.yomi),
        undefined
      ))
    }
    console.log(`${counter++}/${vTuberDic.length}`)
  })
  storeVirtualBeing.addQuads(yomiQuads)
  parseretVirtualBeing.quads = storeVirtualBeing.getQuads(null, null, null, null)
  await write(parseretVirtualBeing)
}

(async () => await main())()
