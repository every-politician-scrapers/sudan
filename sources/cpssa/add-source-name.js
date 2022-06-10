const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = (guid, name, position) => ({
    guid,
    snaks: {
      P248: 'Q96743901',
      P813: new Date().toISOString().split('T')[0],
      P1810: name, // named as (Person)
      P1932: position, //stated as (Position)
    }
})
