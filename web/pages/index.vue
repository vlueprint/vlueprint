<template>
  <div class="container">
    <section class="hero">
      <Logo />
    </section>
    <section class="content">
      <p class="concept">「Virtual Worldに共通のスキーマを」</p>
      <div class="concept-details">
        <p>Vlueprint は Virtual 世界の人やモノに関するオープンデータプラットフォームです．</p>
        <p>様々なデータを共通のスキーマにして管理，提供することが目的です．</p>
        <p><a href="https://takanakahiko.hatenablog.com/entry/2020/12/30/091654" target="_blank">詳しくはこちらの記事に</a></p>
      </div>
    </section>
    <section class="points content">
      <div class="point">
        <p class="point-title">つながりを可視化する</p>
        <img class="point-img" src="~/assets/hubspot.svg" />
        <p>RDF 形式で管理した Linked Open Data を取り扱います</p>
        <p>今までバラバラだった情報を紐付けていくと新たな発見があるかもしれません．</p>
      </div>
      <div class="point">
        <p class="point-title">皆で作る。皆で使う。</p>
        <b-icon icon="account-group" size="is-large" class="point-img"></b-icon>
        <p>Vlueprint は GitHub 上で公開され，オープンに運営されています．</p>
        <p>また，GitHubアカウントを持っていればどなたでも編集や開発に参加することができます，</p>
      </div>
    </section>
    <section class="content">
      <h2 class="title">データの取得例</h2>
      <p>Powered by <a href="https://space.pikopikopla.net/">☆ピコピコプラネット☆ SPACE</a></p>
      <div>
        <Samples />
      </div>
    </section>
    <section class="content usecase">
      <h2 class="title">利用例(JavaScript)</h2>
      <p>以下のソースコードをブラウザのJavaScriptコンソールで実行してみてください</p>
      <pre>{{code}}</pre>
    </section>
    <section class="lets-start content">
      <h2 class="title">さあ，始めましょう</h2>
      <div class="links">
        <a href="#" target="_blank" class="button is-outlined is-primary">Document</a>
        <a href="https://github.com/vlueprint/vlueprint" target="_blank" class="button is-outlined is-dark">GitHub</a>
      </div>
    </section>
    <footer class="footer has-text-centered">
      <p>© Copyright Vlueprint All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
import Samples from "~/components/Samples.vue";

export default {
  components: {
    Logo,
    Samples
  },
  head () {
    return {
      htmlAttrs: {
        class: ""
      }
    }
  },
  data() {
    return {
      code: `
const query = \`
  prefix vlueprint: <https://vlueprint.org/schema/>
  prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

  select ?id {
    ?uri vlueprint:youtubeChannelId ?id.
    ?uri rdfs:label "月ノ美兎".
  }
\`;
const ret = await fetch(
  "https://vlueprint.org/sparql?query=" + encodeURIComponent(query),
  {
    headers: { Accept: "application/json" }
  }
);
const retJson = await ret.json();
const suddest = retJson.results.bindings[0]
  ? retJson.results.bindings[0].id.value
  : "";
console.log(suddest); // 月ノ美兎の Youtube チャンネルの ID が表示される`
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~bulma/sass/utilities/_all";

.container {
  margin: 0 auto;
  min-height: 100vh;
  width: 100%;
}

.content {
  margin: 80px auto;
  width: 90%;
  max-width: 1100px;
  text-align: center;
}

.hero {
  background: #eeeeee;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.concept {
  margin-top: 50px;
  text-align: center;
  font-size: 2rem;
}

.concept-details {
  margin-top: 20px;
  text-align: center;
  font-size: 1.1rem;
}

@media only screen and (max-width: 600px) {
  .concept {
    font-size: 1.2rem;
    margin-bottom: 40px;
    font-weight: bold;
  }
  .concept-details {
    font-size: 1rem;
  }
}

.points {
  display: flex;
  width: 80%;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 800px;
  margin-top: 30px;
}

.point {
  max-width: 350px;
  text-align: center;
  margin-top: 60px;

  p {
    margin-top: 10px;
  }
  .point-title {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .point-img {
    width: 48px;
  }
}

.usecase {
  text-align: left;
}

.lets-start {
  margin-top: 150px;
}

.links {
  margin-top: 20px;
  padding-top: 20px;
  text-align: center;
}
</style>
