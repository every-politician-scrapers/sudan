module.exports = (province, name) => {
  claims = {
    P31:   'Q294414', // instance of: public office
    P279:  'Q82366032', // subclass of: DRC provincial governor
    P17:   'Q974',    // country: DRC
    P1001:  province
  }

  return {
    type: 'item',
    labels: { en: `Governor of ${name}` },
    descriptions: { en: "position in DRC" },
    claims: claims
  }
}
