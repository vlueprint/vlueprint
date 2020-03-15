<h1 align="center">vlueprint</h1>

![logo](./logos/facebook_cover_photo_2.png)

[![Actions Status](https://github.com/vlueprint/vlueprint/workflows/Delivery%20Containers/badge.svg?branch=master)](https://github.com/vlueprint/vlueprint/actions)

## develop

### Virtuoso オンリー

http://localhost:3001/ に Virtuoso を立ち上げます

```bash
$ docker-compose build sparql-endpoint
$ docker-compose up sparql-endpoint
```

http://localhost:3001/sparql/ でクエリを投げたり出来ます

例えば，これで VTuber 一覧が取得できます

```sparql
prefix vlueprint: <https://vlueprint.org/schema/>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?label {
  ?uri a vlueprint:VirtualBeing ;
       rdfs:label ?label.
}
```

### Nuxt + Virtuoso

http://localhost:3000/ に Nuxt を立ち上げます

```bash
$ docker-compose build
$ docker-compose up 
```

## デプロイまわり

master にコミットすると サービスが以下 URL で立ち上がります．

https://vlueprint.org/
