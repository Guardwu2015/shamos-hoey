import SplayTree from 'splaytree'
import Segment from './Segment'
import {compareSegments} from './compareSegments'
import {degreesToRadians, radiansToDegrees, bearing} from './utils'

export default class SweepLine {
    constructor (useGeodesicIntersect) {
        this.tree = new SplayTree(compareSegments)
        this.intersectionOperationIsGeodesic = useGeodesicIntersect
    }

    addSegment (event) {
        const seg = new Segment(event)
        const node = this.tree.insert(seg)
        const nextNode = this.tree.next(node)
        const prevNode = this.tree.prev(node)
        if (nextNode !== null) {
            seg.segmentAbove = nextNode.key
            seg.segmentAbove.segmentBelow = seg
        }
        if (prevNode !== null) {
            seg.segmentBelow = prevNode.key
            seg.segmentBelow.segmentAbove = seg
        }
        return node.key
    }

    findSegment (seg) {
        const node = this.tree.findStatic(seg)
        if (node === null) return null
        return node.key
    }

    removeSegmentFromSweepline (seg) {
        const node = this.tree.findStatic(seg)
        if (node === null) return
        const nextNode = this.tree.next(node)
        if (nextNode !== null) {
            const nextSeg = nextNode.key
            nextSeg.segmentBelow = seg.segmentBelow
        }
        const prevNode = this.tree.prev(node)
        if (prevNode !== null) {
            const prevSeg = prevNode.key
            prevSeg.segmentAbove = seg.segmentAbove
        }
        this.tree.remove(seg)
    }

    testIntersect (seg1, seg2) {
        return this.intersectionOperationIsGeodesic ? this._testGeodesicIntersect(seg1, seg2) : this._testIntersect(seg1, seg2)
    }

    _testIntersect (seg1, seg2) {
        if (seg1 === null || seg2 === null) return false

        if (seg1.rightSweepEvent.isSamePoint(seg2.leftSweepEvent) ||
            seg1.rightSweepEvent.isSamePoint(seg2.rightSweepEvent) ||
            seg1.leftSweepEvent.isSamePoint(seg2.leftSweepEvent) ||
            seg1.leftSweepEvent.isSamePoint(seg2.rightSweepEvent)) return false

        const x1 = seg1.leftSweepEvent.x
        const y1 = seg1.leftSweepEvent.y
        const x2 = seg1.rightSweepEvent.x
        const y2 = seg1.rightSweepEvent.y
        const x3 = seg2.leftSweepEvent.x
        const y3 = seg2.leftSweepEvent.y
        const x4 = seg2.rightSweepEvent.x
        const y4 = seg2.rightSweepEvent.y

        const denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1))
        const numeA = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))
        const numeB = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))

        if (denom === 0) {
            if (numeA === 0 && numeB === 0) return false
            return false
        }

        const uA = numeA / denom
        const uB = numeB / denom

        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            const x = x1 + (uA * (x2 - x1))
            const y = y1 + (uA * (y2 - y1))
            return {x, y}
        }
        return false
    }

    _testGeodesicIntersect (seg1, seg2) {
        if (seg1 === null || seg2 === null) return false

        if (seg1.rightSweepEvent.isSamePoint(seg2.leftSweepEvent) ||
            seg1.rightSweepEvent.isSamePoint(seg2.rightSweepEvent) ||
            seg1.leftSweepEvent.isSamePoint(seg2.leftSweepEvent) ||
            seg1.leftSweepEvent.isSamePoint(seg2.rightSweepEvent)) return false


        const φ1 = degreesToRadians(seg1.leftSweepEvent.y), λ1 = degreesToRadians(seg1.leftSweepEvent.x)
        const φ2 = degreesToRadians(seg2.leftSweepEvent.y), λ2 = degreesToRadians(seg2.leftSweepEvent.x)
        const θ13 = degreesToRadians(bearing(seg1.leftSweepEvent, seg1.rightSweepEvent)), θ23 = degreesToRadians(bearing(seg2.leftSweepEvent, seg2.rightSweepEvent))
        const Δφ = φ2 - φ1, Δλ = λ2 - λ1

        const δ12 = 2 * Math.asin(Math.sqrt(Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)))
        if (δ12 === 0) return false

        // initial/final bearings between points
        // const cosθa = (Math.sin(φ2) - Math.sin(φ1) * Math.cos(δ12)) / (Math.sin(δ12) * Math.cos(φ1))
        // const cosθb = (Math.sin(φ1) - Math.sin(φ2) * Math.cos(δ12)) / (Math.sin(δ12) * Math.cos(φ2))
        // const θa = Math.acos(Math.min(Math.max(cosθa, -1), 1))
        // const θb = Math.acos(Math.min(Math.max(cosθb, -1), 1))
    var θa = Math.acos( ( Math.sin(φ2) - Math.sin(φ1)*Math.cos(δ12) ) / ( Math.sin(δ12)*Math.cos(φ1) ) );
    if (isNaN(θa)) θa = 0; // protect against rounding
    var θb = Math.acos( ( Math.sin(φ1) - Math.sin(φ2)*Math.cos(δ12) ) / ( Math.sin(δ12)*Math.cos(φ2) ) );
        const θ12 = Math.sin(λ2 - λ1) > 0 ? θa : 2 * Math.PI - θa
        const θ21 = Math.sin(λ2 - λ1) > 0 ? 2 * Math.PI - θb : θb

        const α1 = θ13 - θ12
        const α2 = θ21 - θ23

        if (Math.sin(α1) === 0 && Math.sin(α2) === 0) return false
        if (Math.sin(α1) * Math.sin(α2) < 0) return false

        const α3 = Math.acos(-Math.cos(α1) * Math.cos(α2) + Math.sin(α1) * Math.sin(α2) * Math.cos(δ12))
        const δ13 = Math.atan2(Math.sin(δ12) * Math.sin(α1) * Math.sin(α2), Math.cos(α2) + Math.cos(α1) * Math.cos(α3))
        const φ3 = Math.asin(Math.sin(φ1) * Math.cos(δ13) + Math.cos(φ1) * Math.sin(δ13) * Math.cos(θ13))
        const Δλ13 = Math.atan2(Math.sin(θ13) * Math.sin(δ13) * Math.cos(φ1), Math.cos(δ13) - Math.sin(φ1) * Math.sin(φ3))
        const λ3 = λ1 + Δλ13
        return {y: radiansToDegrees(φ3), x: (radiansToDegrees(λ3) + 540) % 360 - 180}
    }
}
