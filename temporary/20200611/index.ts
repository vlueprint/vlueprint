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

const AddYomi = (dicEntry: DicEntry, store: N3.N3Store) => {
  const vb = store.getQuads(
    null,
    namedNode("http://www.w3.org/2000/01/rdf-schema#label"),
    literal(dicEntry.kanji),
    null
  )
  if (vb.length > 0) {
    store.addQuad(quad(
      vb[0].subject,
      namedNode('https://vlueprint.org/schema/yomi'),
      literal(dicEntry.yomi),
      undefined
    ))
  }
  return vb.length > 0
}

const main = async () => {

  const vTuberDic = JSON.parse(fs.readFileSync('./VTuberDic.json', 'utf8')) as DicEntry[]

  const parseretVirtualBeing = parse('../../sparql-endpoint/toLoad/resource-VirtualBeing.ttl')
  const storeVirtualBeing = new N3.Store(parseretVirtualBeing.quads)

  const parseretPerformingGroup = parse('../../sparql-endpoint/toLoad/resource-PerformingGroup.ttl')
  const storePerformingGroup = new N3.Store(parseretPerformingGroup.quads)

  const parseretOrganization = parse('../../sparql-endpoint/toLoad/resource-Organization.ttl')
  const storeOrganization = new N3.Store(parseretOrganization.quads)

  const parseretCompany = parse('../../sparql-endpoint/toLoad/resource-Company.ttl')
  const storeCompany = new N3.Store(parseretCompany.quads)

  const storeKeyword = new N3.Store([])

  const base = parseretVirtualBeing.base

  let counter = 0;
  vTuberDic.forEach(value => {
    console.log(`${counter++}/${vTuberDic.length}`)
    if (AddYomi(value, storeVirtualBeing)) return
    else if (AddYomi(value, storePerformingGroup)) return
    else if (AddYomi(value, storeOrganization)) return
    else if (AddYomi(value, storeCompany)) return
    else {
      const isVB = (value.hinshi == "人名")
      const subject = validNode(base, value.kanji)
      const store = isVB ? storeVirtualBeing : storeKeyword
      const className = isVB ? "VirtualBeing" : "Keyword"
      const exists = store.getQuads(subject, null, null, null).length > 0
      store.addQuad(quad(
        subject,
        namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        namedNode(`https://vlueprint.org/schema/${className}`),
        undefined
      ))
      if (isVB) {
        if (exists) {
          const comment = store.getQuads(
            subject,
            namedNode("http://www.w3.org/2000/01/rdf-schema#comment"),
            literal("[TODO]名前が取得できなかったので，URIは仮のものです"),
            null
          )[0];
          if (comment) store.removeQuad(comment)
        } else {
          store.addQuad(quad(
            subject,
            namedNode("http://www.w3.org/2000/01/rdf-schema#comment"),
            literal("[TODO]IME辞書に対応するVirtualBeingが見つからなかったため、「よみ」のみが登録されています"),
            undefined
          ))
        }
      }
      store.addQuad(quad(
        subject,
        namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
        literal(value.kanji),
        undefined
      ))
      store.addQuad(quad(
        subject,
        namedNode('https://vlueprint.org/schema/yomi'),
        literal(value.yomi),
        undefined
      ))
    }
  })

  parseretVirtualBeing.quads = storeVirtualBeing.getQuads(null, null, null, null)
  parseretPerformingGroup.quads = storePerformingGroup.getQuads(null, null, null, null)
  parseretOrganization.quads = storeOrganization.getQuads(null, null, null, null)
  parseretCompany.quads = storeCompany.getQuads(null, null, null, null)

  await write(parseretVirtualBeing)
  await write(parseretPerformingGroup)
  await write(parseretOrganization)
  await write(parseretCompany)

  await write({
    quads: storeKeyword.getQuads(null, null, null, null),
    base: base,
    prefixes: parseretVirtualBeing.prefixes,
    path: '../../sparql-endpoint/toLoad/resource-Keyword.ttl'
  })
}

(async () => await main())()
