import fs from 'fs'
import crypto from 'crypto'
import * as N3 from 'n3'
import { DataFactory } from 'n3'

const { namedNode, literal, defaultGraph, quad } = DataFactory;

const writer = new N3.Writer({
  prefixes: {
    vlueprint: "https://vlueprint.org/schema/",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  }
});

interface VtuberData {
  name: string,
  channelName: string,
  channelId: string,
  office: string,
  twitter: string
}

const json = JSON.parse(fs.readFileSync(`./output/output_all.json`, 'utf8')) as VtuberData[];

json.forEach( data => {
  console.log(data.channelName)
  const key = (data.name.length!=0)? data.name : data.channelName
  const uri = `https://vlueprint.org/resource/${ key.normalize("NFKC").replace(/ /g,"_").replace(/　/g,"_").replace(/\//g,"_").replace(/\\/g,"_") }`
  writer.addQuad(
    namedNode(uri),
    namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
    namedNode('https://vlueprint.org/schema/VirtualBeing')
  );
  if(data.name.length>0){
    writer.addQuad(
      namedNode(uri),
      namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
      literal(data.name)
    );
  }else{
    writer.addQuad(
      namedNode(uri),
      namedNode('http://www.w3.org/2000/01/rdf-schema#comment'),
      literal("[TODO]名前が取得できなかったので，URIは仮のものです")
    );
  }
  if(data.channelId!=="[TODO]"){
    writer.addQuad(
      namedNode(uri),
      namedNode('https://vlueprint.org/schema/youtubeChannelId'),
      literal(data.channelId)
    );
  }else{
    writer.addQuad(
      namedNode(uri),
      namedNode('http://www.w3.org/2000/01/rdf-schema#comment'),
      literal("[TODO]チャンネルIDが取得できなかったので「vlueprint:youtubeChannelId」は指定されていません")
    );
  }
  writer.addQuad(
    namedNode(uri),
    namedNode('https://vlueprint.org/schema/youtubeChannelName'),
    literal(data.channelName)
  );
  writer.addQuad(
    namedNode(uri),
    namedNode('https://vlueprint.org/schema/twitterAccount'),
    literal(data.twitter)
  );
  if(data.office.length>0){
    writer.addQuad(
      namedNode(uri),
      namedNode('https://vlueprint.org/schema/office'),
      literal(data.office)
    );
  }
})

const write = async(writer:N3.N3Writer, path: string):Promise<void> => {
  return new Promise((resolve, reject) => {
      writer.end((error, result) => {
          if(error) reject()
          fs.writeFileSync(path, result)
          resolve()
      })
  })
}

write(writer, 'resource.turtle')
