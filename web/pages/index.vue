<template>
  <div class="container">
    <section class="hero">
      <Logo />
    </section>
    <section class="content">
      <p class="concept">「 Vtuber の創作をもっと身近に」</p>
      <div class="concept-details">
        <p>Vlueprint は Virtual 世界の人やモノに関するオープンデータプラットフォームです．</p>
        <p>様々なデータを共通のスキーマにして管理，提供することが目的です．</p>
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
    <section class="lets-start content">
      <h2 class="title">さあ，始めましょう</h2>
      <div class="links">
        <a href="#" target="_blank" class="button--green">Document</a>
        <a href="https://github.com/vlueprint/vlueprint" target="_blank" class="button--grey">GitHub</a>
      </div>
    </section>
    <footer class="footer has-text-centered">
      <p>© Copyright Vlueprint All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";

export default {
  components: {
    Logo
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
  width: 80%;
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

.lets-start {
  margin-top: 150px;
}

.links {
  margin-top: 20px;
  padding-top: 20px;
  text-align: center;
}
</style>
