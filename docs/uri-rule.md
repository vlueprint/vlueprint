# URI のルールについて

## ルール

### パスについて

- リソース : https://vluprint.org/resource/${key}
- プロパティ : https://vluprint.org/schema/${key}
- クラス : https://vluprint.org/schema/${Key}

### リソースの命名規則について

- 正式名称(日本語含む)をそのまま key とする(この時点のものを rdfs:label とする)
- Unicode正規化 : key = key.normalize("NFKC")
- 空白を _ に変換 : key = key.replace(/ /g,"_").replace(/　/g,"_")
- 同一 key のリソースが出た場合
  - 対応するオントロジーを追加 : key = key + "_(" + ontology + ")"
  - オントロジーも同じ場合は注釈を追加 : key = key + "_(" + annotation + ")"

## プロパティやクラスの命名規則について

- クラス名はパスカルケース
- プロパティ名はキャメルケース

### ルール

- 1ヶ月程度は「URI は仮です」みたいな勧告をしたほうが良さそう
- クラス名はパスカルケース，プロパティ名はキャメルケース
- 注釈の意味等に関しては積極的に rdfs:comment で補足する

## 例

### リソース名

- :ok: `https://vluprint.org/resource/キズナアイ`
- :ok: `https://vluprint.org/resource/輝夜_月`

- :ng: `https://vluprint.org/resource/㈱㌧㌦Ⅲ` (Unicode正規化されてない)
- :ng: `https://vluprint.org/resource/輝夜 月` (スペースがある)

### クラス名

- :ok: `https://vluprint.org/schema/VirtualBeing`

- :ng: `https://vluprint.org/schema/Virtual_Being`
- :ng: `https://vluprint.org/schema/virtualBeing`

### プロパティ名

- :ok: `https://vluprint.org/schema/youtubeChannel`

- :ng: `https://vluprint.org/schema/YoutubeChannel`
- :ng: `https://vluprint.org/schema/youtube_Channel`

## 参考

- https://github.com/vlueprint/vlueprint/issues/16
