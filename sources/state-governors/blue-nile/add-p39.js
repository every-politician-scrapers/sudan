// qsv search -s item Q diff.csv | qsv search -s @@ '\+\+' | qsv select item,itemlabel,startdate,enddate | qsv behead | qsv fmt -t " "  | wd ee add-p39.js --batch

const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = (id, label, startdate, enddate) => {
  qualifier = { }
  if(startdate) qualifier['P580'] = startdate
  if(enddate)   qualifier['P582'] = enddate

  return {
    id,
    claims: {
      P39: {
        value: meta.position,
        qualifiers: qualifier,
        references: {
          P4656: meta.source,
          P813: new Date().toISOString().split('T')[0],
          P1810: label,
        }
      }
    }
  }
}
