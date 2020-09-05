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
      resolve()
    })
  })
}

const main = async () => {
  const fromtolist = JSON.parse(fs.readFileSync('./list_checke.json', 'utf8')) as fromto[]
  const parseret = parse('../../sparql-endpoint/toLoad/resource-VirtualBeing.ttl')
  let quads = parseret.quads
  console.log(fromtolist)
  quads = quads.filter( value => {
    for( let fromto of fromtolist){

      if (
        (fromto.from == value.subject.id || fromto.to == value.subject.id) &&
        value.predicate.id == "http://www.w3.org/2000/01/rdf-schema#comment" &&
        (
          value.object.value == "[TODO]IME辞書に対応するVirtualBeingが見つからなかったため、「よみ」のみが登録されています" || 
          value.object.value == "[TODO]名前が取得できなかったので，URIは仮のものです"
        )
      ) return false

      if (
        fromto.from == value.subject.id &&
        value.predicate.value == "http://www.w3.org/2000/01/rdf-schema#label"
      ) return false

    }
    return true
  })
  quads.forEach( quad => {
    fromtolist.forEach( fromto => {
      if(fromto.from === quad.subject.id) {
        quad.subject = namedNode(fromto.to)
      }
    })
  })
  const store = new N3.Store(quads)
  parseret.quads = store.getQuads(null, null, null, null)
  await write(parseret)
}

main()
