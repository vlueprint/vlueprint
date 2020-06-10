<h1 align="center">vlueprint</h1>

![logo](./logos/facebook_cover_photo_2.png)

[![Actions Status](https://github.com/vlueprint/vlueprint/workflows/Delivery%20Containers/badge.svg?branch=master)](https://github.com/vlueprint/vlueprint/actions)

## Develop

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

## Deploy

master にコミットすると サービスが以下 URL で立ち上がります．

https://vlueprint.org/


## Sponsors

<h3 align="center">Special Sponsor(インフラ費用 & ドメイン取得費用)</h3>
<p align="center">
  <a href="https://github.com/uneco" target="_blank">
    <img width="64px"  src="https://github.com/uneco.png">
    <span></span>
  </a>
</p>

## Contributors

<a href="https://github.com/vlueprint/vlueprint/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=vlueprint/vlueprint" />
</a>

Made with [contributors-img](https://contributors-img.web.app).

## Special Thanks

### WFLE/GREE VR Studio Lab

Special Thanks WFLE/GREE VR Studio Lab!

[WFLE/GREE VR Studio Lab の IME 辞書を取り込み by takanakahiko · Pull Request #53 · vlueprint/vlueprint](https://github.com/vlueprint/vlueprint/pull/53)

[@o_ob氏](https://twitter.com/o_ob)よりご紹介いただきました

- https://twitter.com/o_ob/status/1267652499919368193
- https://twitter.com/VRStudioLab/status/1136889624360472577

## 貢献について

Issue や PullRequest を歓迎します！
不明点があれば遠慮なく @takanakahiko までお尋ねください．
VTuber 関連の創作の支えになるよう，ぜひとも協力よろしくお願いいたします．
