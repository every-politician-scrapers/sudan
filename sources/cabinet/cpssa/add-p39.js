const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = (id, named, position, stated, startdate, enddate) => {
  qualifier = {
    P580: startdate,
    P582: enddate,
  }

  refs = {
    P248: 'Q96743901',
    P813: new Date().toISOString().split('T')[0],
    P1810: named,
    P1932: stated,
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
