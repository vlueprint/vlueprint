# vtuber-lod
VTuber の LOD です (リポジトリ名やORG名は仮のものであり，変更される可能性があります)

## develop

http://localhost:8890 に Virtuoso を立ち上げます

```bash
$ docker-compose build
$ docker-compose up
```

http://localhost:8890/sparql/ でクエリを投げたり出来ます

例えば
```sparql
select ?uri ?label { ?uri rdfs:label ?label }
```

## デプロイまわり

master にコミットすると Virtuoso が以下 URL で立ち上がります．

https://foobar-moezsesd6a-an.a.run.app/
