<h1 align="center">vlueprint</h1>

![logo](./logos/facebook_cover_photo_2.png)

## develop

http://localhost:8080 に Virtuoso を立ち上げます

```bash
$ docker-compose build
$ docker-compose up
```

http://localhost:8080/sparql/ でクエリを投げたり出来ます

例えば，これで VTuber 一覧が取得できます

```sparql
prefix vlueprint: <https://vlueprint.org/schema/>
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select ?label {
  ?uri a vlueprint:VirtualBeing ;
       rdfs:label ?label.
}
```

## デプロイまわり

master にコミットすると それぞれのサービスが以下 URL で立ち上がります．

- sparqle-endpoint : https://sparql-endpoint-moezsesd6a-an.a.run.app
- web : https://web-moezsesd6a-an.a.run.app