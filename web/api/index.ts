import express, { Router } from 'express'

import axios from 'axios'
import { SparqlResponse } from '~/types/SparqlResponse'
import { SampleQuery } from '~/types/SampleQuery'

const router = Router()
router.get('/samples', async (_, res) => {
  const query = `
  PREFIX schema: <http://schema.org/>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

  SELECT *
  WHERE {
    ?s 
      schema:name ?title;
      schema:text ?query;
      schema:keywords ?keywords;
      schema:url ?url;
      schema:creator ?creator;
      schema:dateCreated ?created.
    FILTER( regex(?keywords, "Vlueprint:sample") && ?creator = "takanakahiko")
  }
  ORDER BY ?created
  `
  const response = await axios.get<SparqlResponse>('https://space.pikopikopla.net/sparql/', {
    params: { query }
  })
  const queries = response.data.results.bindings.map((binding) => {
    return {
      title: binding.title.value,
      query: binding.query.value,
      keywords: binding.keywords.value,
      url: binding.url.value,
      created: binding.created.value
    } as SampleQuery
  })
  res.json(queries)
})

// とりあえずローカルキャッシュしておく
// なぜ→APIのレートに到達してしまうため
// 本当はFIrestoreとかを使ったほうが良いと思うけど、急ぎでやるものでもない
const iconCache = {} as { [key: string]: { url: string, updatedAt: number } }

// 絶対悪用されるこれ。早めに潰しておこう。仮措置。
router.get('/icon', async (req, res) => {
  if (!process.env.TWITTER_TOKEN || !req.query.screen_name) {
    res.json({
      url: 'https://placehold.jp/400x400.png',
      cached: false
    })
    return
  }
  if (iconCache[`${req.query.screen_name}`]) {
    res.json({
      url: iconCache[`${req.query.screen_name}`].url,
      cached: true
    })
    return
  }
  try {
    const response = await axios.get(
      `https://api.twitter.com/1.1/users/show.json?screen_name=${req.query.screen_name}`,
      {
        headers: { Authorization: `Bearer ${process.env.TWITTER_TOKEN}` }
      }
    )
    const url = response.data.profile_image_url_https.replace('_normal', '_400x400')
    iconCache[`${req.query.screen_name}`] = {
      updatedAt: Date.now(),
      url
    }
    res.json({
      url,
      cached: false
    })
  } catch (error) {
    res.json({
      url: 'https://placehold.jp/400x400.png',
      cached: false
    })
  }
})

const app = express()
app.set('json spaces', 2)
app.use('/', router)
module.exports = app
