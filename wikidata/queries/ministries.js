const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = function () {
    return `SELECT DISTINCT ?item ?itemLabel ?minister ?ministerLabel WHERE {
      ?item wdt:P31/wdt:P279* wd:Q192350; wdt:P1001 wd:${meta.jurisdiction.id}.
      OPTIONAL { ?item wdt:P2388 ?minister }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    }
    # ${new Date().toISOString()}
    ORDER BY ?itemLabel`
}
