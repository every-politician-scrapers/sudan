const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = (id, label, party, startdate, enddate) => {
  qualifier = { }
  if(meta.term.id)       qualifier['P2937'] = meta.term.id
  if(meta.term.election) qualifier['P2715'] = meta.term.election
  if(party)              qualifier['P4100'] = party
  qualifier['P580'] = startdate || meta.term.start
  qualifier['P582'] = enddate || meta.term.end

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
