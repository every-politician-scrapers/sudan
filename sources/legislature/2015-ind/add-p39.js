const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = (id, label, party, startdate, enddate) => {
  qualifier = {
    P2937: meta.term.id,
    P2715: meta.term.election || null,
  }

  reference = {
    ...meta.reference,
    P813: new Date().toISOString().split('T')[0],
    P1810: label,
  }

  return {
    id,
    claims: {
      P39: {
        value:      meta.position,
        qualifiers: qualifier,
        references: reference,
      }
    }
  }
}
