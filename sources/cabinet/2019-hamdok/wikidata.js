const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = function () {
  let fromd = `"${meta.cabinet.start}T00:00:00Z"^^xsd:dateTime`
  let until = meta.cabinet.end ? `"${meta.cabinet.end}T00:00:00Z"^^xsd:dateTime` : "NOW()"

  return `SELECT DISTINCT ?item ?itemLabel ?position ?positionLabel
           ?startDate ?endDate ?source ?sourceDate
           (STRAFTER(STR(?ps), STR(wds:)) AS ?psid)
    WITH {
      SELECT DISTINCT ?item ?position ?startNode ?endNode ?ps
      WHERE {
          # Positions currently in the cabinet
          ?position p:P361 ?cs .
          ?cs ps:P361 wd:${meta.cabinet.parent} .
          FILTER NOT EXISTS { ?cs pq:P582 [] }

          # Who held those positions
          ?item wdt:P31 wd:Q5 ; p:P39 ?ps .
          ?ps ps:P39 ?position .
          FILTER NOT EXISTS { ?ps wikibase:rank wikibase:DeprecatedRank }

          OPTIONAL { ?item p:P570 [ a wikibase:BestRank ; psv:P570 ?dod ] }
          OPTIONAL { ?ps pqv:P580 ?p39start }
          OPTIONAL { ?ps pqv:P582 ?p39end }
          OPTIONAL {
            ?ps pq:P5054 ?cabinet .
            OPTIONAL { ?cabinet p:P571 [ a wikibase:BestRank ; psv:P571 ?cabinetInception ] }
            OPTIONAL { ?cabinet p:P580 [ a wikibase:BestRank ; psv:P580 ?cabinetStart ] }
            OPTIONAL { ?cabinet p:P576 [ a wikibase:BestRank ; psv:P576 ?cabinetAbolished ] }
            OPTIONAL { ?cabinet p:P582 [ a wikibase:BestRank ; psv:P582 ?cabinetEnd ] }
          }
          wd:Q18354756 p:P580/psv:P580 ?farFuture .

          BIND(COALESCE(?p39start, ?cabinetInception, ?cabinetStart) AS ?startNode)
          BIND(COALESCE(?p39end,   ?cabinetAbolished, ?cabinetEnd, ?dod, ?farFuture) AS ?endNode)
          FILTER(BOUND(?startNode))
      }
    } AS %statements
    WHERE {
      INCLUDE %statements .
      ?startNode wikibase:timeValue ?startV ; wikibase:timePrecision ?startP .
      ?endNode   wikibase:timeValue ?endV   ; wikibase:timePrecision ?endP .

      FILTER (
        IF(?startV > ${fromd}, ?startV, ${fromd}) < IF(?endV < ${until}, ?endV, ${until})
      )

      BIND (
        COALESCE(
          IF(?startP = 11, SUBSTR(STR(?startV), 1, 10), 1/0),
          IF(?startP = 10, SUBSTR(STR(?startV), 1, 7), 1/0),
          IF(?startP = 9,  SUBSTR(STR(?startV), 1, 4), 1/0),
          IF(?startP = 8,  CONCAT(SUBSTR(STR(?startV), 1, 4), "s"), 1/0),
          ""
        ) AS ?startDate
      )

      BIND (
        COALESCE(
          IF(?endV > NOW(), "", 1/0),
          IF(?endP = 11, SUBSTR(STR(?endV), 1, 10), 1/0),
          IF(?endP = 10, SUBSTR(STR(?endV), 1, 7), 1/0),
          IF(?endP = 9,  SUBSTR(STR(?endV), 1, 4), 1/0),
          IF(?endP = 8,  CONCAT(SUBSTR(STR(?endV), 1, 4), "s"), 1/0),
          ""
        ) AS ?endDate
      )

      OPTIONAL {
        ?ps prov:wasDerivedFrom ?ref .
        ?ref pr:P4656 ?source FILTER CONTAINS(STR(?source), '${meta.source}') .
        OPTIONAL { ?ref pr:P1810 ?sourceName }
        OPTIONAL { ?ref pr:P1932 ?statedName }
        OPTIONAL { ?ref pr:P813  ?sourceDate }
      }
      OPTIONAL { ?item rdfs:label ?labelName FILTER(LANG(?labelName) = "en") }
      BIND(COALESCE(?sourceName, ?labelName) AS ?itemLabel)

      OPTIONAL { ?position rdfs:label ?positionEN FILTER(LANG(?positionEN) = "en") }
      BIND(COALESCE(?statedName, ?positionEN) AS ?positionLabel)
    }
    # ${new Date().toISOString()}
    ORDER BY ?sourceDate ?item ?psid`
}
