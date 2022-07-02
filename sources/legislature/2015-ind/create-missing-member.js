const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = (label) => {
  mem = {
    value: meta.position,
    qualifiers: {
      P2937: meta.term.id,
      P2715: meta.term.election || null,
    },
    references: {
      ...meta.reference,
      P813: new Date().toISOString().split('T')[0],
      P1810: label,
    }
  }

  claims = {
    P31: { value: 'Q5' }, // human
    P106: { value: 'Q82955' }, // politician
    P39: mem,
  }

  return {
    type: 'item',
    labels: { en: label },
    descriptions: meta.person_description,
    claims: claims,
  }
}
