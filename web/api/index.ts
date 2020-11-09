import express from 'express'
import { Router, Request, Response } from "express"

import axios from 'axios'
import { SparqlResponse } from '~/types/SparqlResponse'
import { SampleQuery } from '~/types/SampleQuery'

const router = Router()
router.get("/samples", async (req, res) => {
  const query = `
  PREFIX schema: <http://schema.org/>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

  SELECT *
  WHERE {
    ?s schema:name ?title ;
      schema:text	?query ;
      schema:keywords    ?keywords ;
      schema:url	       ?url ;
      schema:creator		 ?creator ;
      schema:dateCreated ?created .
    FILTER( regex(?keywords, "Vlueprint:sample") && ?creator = "takanakahiko")
  }
  ORDER BY ?created
  `
  const response = await axios.get<SparqlResponse>('https://space.pikopikopla.net/sparql/', {
    params: { query },
  })
  const queries = response.data.results.bindings.map(binding => {
    return {
      title: binding["title"].value,
      query: binding["query"].value,
      keywords: binding["keywords"].value,
      url: binding["url"].value,
      created: binding["created"].value,
    } as SampleQuery
  })
  res.json(queries)
})

const app = express()
app.set('json spaces', 2)
app.use("/", router)
module.exports = app
