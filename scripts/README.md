# Scirpts for Vlueprint

お便利系スクリプトをまとめたものです

## Setup

```sh
$ npm i
```

## Usage

```sh
# ttl を整形したい
$ npm run format
```

## 開発

何かスクリプトを追加する場合は `src/<name>.ts` を追加して処理を記述した上で以下のように npm scripts を追加してください

```json
{
  // 省略
  "scripts": {
    // 省略
    "<name>": "ts-node src/<name>.ts"
  },
  // 省略
}
```
