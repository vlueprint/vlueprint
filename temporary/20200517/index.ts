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

const validNode = (base:string, key:string) => {
  const badCharas = [
    '\\', '\'', '|', '`', '^', '"', '<', '>', '}', '{', ']', '[',
    ' ', '　', '/', ';', '/', '?', ':', '@', '&', '=', '+', '$', ',', '%', '#'
    //これは抜いた ')', '(',
  ]
  badCharas.forEach( c => { key = key.replace( new RegExp('\\'+c, 'g'), '_') })
  return namedNode(base + key.normalize("NFKC"))
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

  // `member` to `belongTo`
  const memberTriples = storePerformingGroup.getQuads(null, 'https://vlueprint.org/schema/member', null, null)
  const convertedTriples = memberTriples.map(value => {
    return quad(
      namedNode(value.object.value),
      namedNode('https://vlueprint.org/schema/belongTo'),
      namedNode(value.subject.value),
      undefined
    )
  })
  storePerformingGroup.removeQuads(memberTriples)
  storeVirtualBeing.addQuads(convertedTriples)
  
  // `office` to `Organization`
  const officeTriplesInVirtualBeing = storeVirtualBeing.getQuads(null, 'https://vlueprint.org/schema/office', null, null)
  const officeTriplesInPerformingGroup = storePerformingGroup.getQuads(null, 'https://vlueprint.org/schema/office', null, null)
  const officeTriples = officeTriplesInVirtualBeing.concat(officeTriplesInPerformingGroup);
  const officeOrganizaytionTriplesStore =  new N3.Store();
  officeTriples.forEach(value => {
    const subject = validNode(base, value.object.value);
    if(officeOrganizaytionTriplesStore.getQuads(subject,null,null,null).length!=0) return;
    officeOrganizaytionTriplesStore.addQuad(quad(
      subject,
      namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      namedNode("https://vlueprint.org/schema/Organization"),
      undefined
    )) 
    officeOrganizaytionTriplesStore.addQuad(quad(
      subject,
      namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
      literal(value.object.value),
      undefined
    )) 
  })
  const offeci2belontto = (value:N3.Quad) => {
    return quad(
      namedNode(value.subject.value),
      namedNode('https://vlueprint.org/schema/belongTo'),
      validNode(base, value.object.value),
      undefined
    )
  }
  storeVirtualBeing.removeQuads(officeTriplesInVirtualBeing)
  storePerformingGroup.removeQuads(officeTriplesInPerformingGroup)
  storeVirtualBeing.addQuads(officeTriplesInVirtualBeing.map(offeci2belontto))
  storePerformingGroup.addQuads(officeTriplesInPerformingGroup.map(offeci2belontto))

  parseretPerformingGroup.quads = storePerformingGroup.getQuads(null,null,null,null)
  parseretVirtualBeing.quads = storeVirtualBeing.getQuads(null,null,null,null)
  
  await write(pathPerformingGroup, parseretPerformingGroup)
  await write(pathVirtualBeing, parseretVirtualBeing)

  const organizationWriteSetting = Object.assign({}, parseretVirtualBeing);
  organizationWriteSetting.quads = officeOrganizaytionTriplesStore.getQuads(null,null,null,null);
  const pathOrganization = '../../sparql-endpoint/toLoad/resource-Organization.ttl'
  await write(pathOrganization, organizationWriteSetting)
}

(async () => await main())()
