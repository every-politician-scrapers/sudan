const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = (id, name, position, startdate) => {
  qualifier = {
    P580: startdate || '2019-04-10'
  }

  refs = {
    P4656: meta.source,
    P813:  new Date().toISOString().split('T')[0],
    P1810: name,
  }

  return {
    id,
    claims: {
      P39: {
        value: position,
        qualifiers: qualifier,
        references: refs
      }
    }
  }
}
