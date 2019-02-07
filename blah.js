const shamosHoey = require('./dist/shamosHoey.js')

const line = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            126,
            -11
          ],
          [
            129,
            -21
          ],
          [
            123,
            -18
          ],
          [
            125.46386718749999,
            -15.156973713377667
          ],
          [
            129.0673828125,
            -15.580710739162123
          ],
          [
            131,
            -14
          ]
        ]
      }
    }
  ]
}

const ip = shamosHoey(line.features[0], {booleanOnly: false})
console.log(ip)