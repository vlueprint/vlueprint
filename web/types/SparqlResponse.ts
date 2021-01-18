interface RdfTerms1 {
  type: 'uri'
  value: string
}

interface RdfTerms2 {
  type: 'literal'
  value: string
}

interface RdfTerms3 {
  type: 'literal'
  value: string
  'xml:lang': string
}

interface RdfTerms4 {
  type: 'literal'
  value: string
  datatype: string
}

interface RdfTerms5 {
  type: 'bnode'
  value: string
}

export interface SparqlResponse {
  head: {
    vars: string[]
    link: string[]
  }
  results: {
    bindings: {
      [key: string]: RdfTerms1 | RdfTerms2 | RdfTerms3 | RdfTerms4 | RdfTerms5
    }[]
  }
}
