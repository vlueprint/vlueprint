import fs from 'fs'
import path from 'path'
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
      resolve()
    })
  })
}

const main = async () => {
  const parseret = parse('../../sparql-endpoint/toLoad/resource-VirtualBeing.ttl')
  const store = new N3.Store(parseret.quads)
  const uris = store.getSubjects(null, null, null)
  parseret.quads = store.getQuads(null, null, null, null)
  interface fromto {
    from: string,
    to: string,
  }
  const fromtolist = [] as fromto[]
  const alltasklen = uris.length * uris.length;
  let count = 0;
  await write(parseret)
  uris.forEach(vb1 => {
    uris.forEach(vb2 => {
      console.log(`${count++}/${alltasklen}`)
      if(vb1.id == vb2.id) return;
      const key1 = vb1.id.replace(parseret.base, '')
      const key2 = vb2.id.replace(parseret.base, '')
      if(key1.includes(key2)) {
        fromtolist.push({
          from: vb2.id,
          to: vb1.id,
        })
      }
    })
  })
  console.log(fromtolist)
}

main()
