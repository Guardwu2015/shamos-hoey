const path = require('path')
const Benchmark = require('benchmark')
const shamosHoey = require('../dist/shamosHoey.js')
const loadJsonFile = require('load-json-file')
const gpsi = require('geojson-polygon-self-intersections')
const Polygon = require('polygon')

const switzerland = loadJsonFile.sync(path.join(__dirname, 'fixtures', 'simple', 'switzerland.geojson'))
const switzerlandKinked = loadJsonFile.sync(path.join(__dirname, 'fixtures', 'notSimple', 'switzerlandKinked.geojson'))

const p = new Polygon(switzerland.geometry.coordinates[0].map(function (c) {
    return {x: c[0], y: c[1]}
}))


const options = {
    onStart () { console.log(this.name) },
    onError (event) { console.log(event.target.error) },
    onCycle (event) { console.log(String(event.target)) },
    onComplete () {
        console.log(`- Fastest is ${this.filter('fastest').map('name')}`)
    }
}

// No intersections
// ShamosHoey - No Intersects x 3,043 ops/sec ±2.03% (95 runs sampled)
// GPSI - No Intersects x 37.18 ops/sec ±0.39% (64 runs sampled)
// Polygon - No Intersects x 54.93 ops/sec ±1.23% (57 runs sampled)
// - Fastest is ShamosHoey - No Intersects
const suite = new Benchmark.Suite('No intersections', options)
suite
    .add('ShamosHoey - No Intersects', function () {
        shamosHoey(switzerland)
    })
    .add('GPSI - No Intersects', function () {
        gpsi(switzerland)
    })
    .add('Polygon - No Intersects', function () {
        p.selfIntersections()
    })
    .run()

// Has intersections
// ShamosHoey - Has Intersects x 4,089 ops/sec ±0.60% (95 runs sampled)
// ShamosHoey - Get Intersects x 3,106 ops/sec ±1.27% (93 runs sampled)
// GPSI - Has Intersects x 36.85 ops/sec ±1.06% (64 runs sampled)
// - Fastest is ShamosHoey - Has Intersects
const suite2 = new Benchmark.Suite('Has intersections', options)
suite2
    .add('ShamosHoey - Has Intersects', function () {
        shamosHoey(switzerlandKinked)
    })
    .add('ShamosHoey - Get Intersects', function () {
        shamosHoey(switzerlandKinked, {booleanOnly: false})
    })
    .add('GPSI - Has Intersects', function () {
        gpsi(switzerlandKinked)
    })
    .run()
