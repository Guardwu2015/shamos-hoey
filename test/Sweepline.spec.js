import test from 'ava';
import Event from '../src/Event'
import Sweepline from '../src/Sweepline'

test('Sweepline has correct properties', function (t) {

    const e1 = new Event([-1, 0])
    const e2 = new Event([0, 0])

    e1.otherEvent = e2
    e2.otherEvent = e1
    e1.isLeftEndpoint = true;
    e2.isLeftEndpoint = false;

    const sl = new Sweepline()
    const seg = sl.addSegment(e1)
    const segOut = sl.findSegment(seg)
    t.is(seg, segOut)
})


test('Sweepline can add an endpoint', function (t) {
    const e1 = new Event([-1, 0])
    const e2 = new Event([0, 0])

    e1.otherEvent = e2
    e2.otherEvent = e1
    e1.isLeftEndpoint = true;
    e2.isLeftEndpoint = false;

    const sl = new Sweepline()
    const midLine = sl.addSegment(e1)

    t.is(midLine.leftSweepEvent, e1)
    t.is(midLine.segmentAbove, null)
    t.is(midLine.segmentBelow, null)

    const e3 = new Event([0, 1])
    const e4 = new Event([1, 1])

    e3.otherEvent = e4
    e4.otherEvent = e3
    e3.isLeftEndpoint = true;
    e4.isLeftEndpoint = false;

    const topLine = sl.addSegment(e3)

    t.is(midLine.segmentAbove, topLine)
    t.is(midLine.segmentBelow, null)
    t.is(topLine.segmentAbove, null)
    t.is(topLine.segmentBelow, midLine)

    const e5 = new Event([0, -1])
    const e6 = new Event([2, -1])

    e5.otherEvent = e6
    e6.otherEvent = e5
    e5.isLeftEndpoint = true;
    e6.isLeftEndpoint = false;

    const bottomLine = sl.addSegment(e5)

    t.is(midLine.segmentBelow, bottomLine)
    t.is(midLine.segmentAbove, topLine)

    t.is(bottomLine.segmentAbove, midLine)
    t.is(bottomLine.segmentBelow, null)

    t.is(topLine.segmentAbove, null)
    t.is(topLine.segmentBelow, midLine)
})

test('Sweepline can remove an endpoint', function (t) {
    const e1 = new Event([-1, 0])
    const e2 = new Event([0, 0])

    e1.otherEvent = e2
    e2.otherEvent = e1
    e1.isLeftEndpoint = true;
    e2.isLeftEndpoint = false;

    const sl = new Sweepline()
    const midLine = sl.addSegment(e1)

    t.is(midLine.segmentAbove, null)
    t.is(midLine.segmentBelow, null)

    const e3 = new Event([0, 1])
    const e4 = new Event([1, 1])

    e3.otherEvent = e4
    e4.otherEvent = e3
    e3.isLeftEndpoint = true;
    e4.isLeftEndpoint = false;

    const topLine = sl.addSegment(e3)

    t.is(midLine.segmentAbove, topLine)
    t.is(midLine.segmentBelow, null)
    t.is(topLine.segmentAbove, null)
    t.is(topLine.segmentBelow, midLine)

    const e5 = new Event([0, -1])
    const e6 = new Event([2, -1])

    e5.otherEvent = e6
    e6.otherEvent = e5
    e5.isLeftEndpoint = true;
    e6.isLeftEndpoint = false;

    const bottomLine = sl.addSegment(e5)

    t.is(midLine.segmentBelow, bottomLine)
    t.is(midLine.segmentAbove, topLine)

    t.is(bottomLine.segmentAbove, midLine)
    t.is(bottomLine.segmentBelow, null)

    t.is(topLine.segmentAbove, null)
    t.is(topLine.segmentBelow, midLine)

    sl.removeSegmentFromSweepline(midLine)

    t.is(bottomLine.segmentAbove, topLine)
    t.is(bottomLine.segmentBelow, null)

    t.is(topLine.segmentAbove, null)
    t.is(topLine.segmentBelow, bottomLine)
})


test('Sweepline can testIntersects', function (t) {
    const e1 = new Event([-1, 0])
    const e2 = new Event([0, 0])

    e1.otherEvent = e2
    e2.otherEvent = e1
    e1.isLeftEndpoint = true;
    e2.isLeftEndpoint = false;

    const sl = new Sweepline()
    const midLine = sl.addSegment(e1)

    const e3 = new Event([0, 1])
    const e4 = new Event([1, 1])

    e3.otherEvent = e4
    e4.otherEvent = e3
    e3.isLeftEndpoint = true;
    e4.isLeftEndpoint = false;

    const topLine = sl.addSegment(e3)
    t.is(sl.testIntersect(midLine, topLine), false)

    const e5 = new Event([-0.5, 0.5])
    const e6 = new Event([-0.5, -1])

    e5.otherEvent = e6
    e6.otherEvent = e5
    e5.isLeftEndpoint = true;
    e6.isLeftEndpoint = false;

    const crossLine = sl.addSegment(e5)
    t.deepEqual(sl.testIntersect(midLine, crossLine), {x: -0.5, y: 0})

    t.is(sl.testIntersect(topLine, crossLine), false)

    const e7 = new Event([0, 0])
    const e8 = new Event([0, -1])

    e7.otherEvent = e8
    e8.otherEvent = e7
    e7.isLeftEndpoint = true;
    e8.isLeftEndpoint = false;

    const touchEndpointLine = sl.addSegment(e7)
    t.is(sl.testIntersect(midLine, touchEndpointLine), false)
    t.is(sl.testIntersect(topLine, touchEndpointLine), false)
})

test('Sweepline can test geodesic intersects', function (t) {
    const e1 = new Event([51.8853, 0.2545])
    const e2 = new Event([50.1539, 6.5552])
    e1.otherEvent = e2
    e2.otherEvent = e1
    e1.isLeftEndpoint = true;
    e2.isLeftEndpoint = false;
    const doGeodesicIntersects = true

    const sl = new Sweepline(doGeodesicIntersects)
    const midLine = sl.addSegment(e1)

    const e3 = new Event([49.0034, 2.5735])
    const e4 = new Event([52.4403, 6.3320])
    e3.otherEvent = e4
    e4.otherEvent = e3
    e3.isLeftEndpoint = true;
    e4.isLeftEndpoint = false;

    const topLine = sl.addSegment(e3)
    const ip1 = sl.testIntersect(midLine, topLine)
    t.deepEqual(ip1, {y: 4.468639332370773, x: 50.73015681840923})

    const e5 = new Event([-0.5, 0.5])
    const e6 = new Event([-0.5, -1])

    e5.otherEvent = e6
    e6.otherEvent = e5
    e5.isLeftEndpoint = true;
    e6.isLeftEndpoint = false;

    const crossLine = sl.addSegment(e5)
    const ip = sl.testIntersect(midLine, crossLine)
    t.deepEqual(ip, false)
})


test('Sweepline is correctly sorted', function (t) {
    const e1 = new Event([-1, 0])
    const e2 = new Event([0, 0])

    e1.otherEvent = e2
    e2.otherEvent = e1
    e1.isLeftEndpoint = true;
    e2.isLeftEndpoint = false;

    const sl = new Sweepline()
    const midLine = sl.addSegment(e1)

    t.is(midLine.leftSweepEvent, e1)
    t.is(midLine.segmentAbove, null)
    t.is(midLine.segmentBelow, null)

    const e3 = new Event([-1, 0])
    const e4 = new Event([0.5, 1])

    e3.otherEvent = e4
    e4.otherEvent = e3
    e3.isLeftEndpoint = true;
    e4.isLeftEndpoint = false;

    const topLine = sl.addSegment(e3)

    t.is(midLine.segmentAbove, topLine)
    t.is(midLine.segmentBelow, null)
    t.is(topLine.segmentAbove, null)
    t.is(topLine.segmentBelow, midLine)

    const e5 = new Event([-1, 0])
    const e6 = new Event([0.5, -1])

    e5.otherEvent = e6
    e6.otherEvent = e5
    e5.isLeftEndpoint = true;
    e6.isLeftEndpoint = false;

    const bottomLine = sl.addSegment(e5)

    t.is(midLine.segmentBelow, bottomLine)
    t.is(midLine.segmentAbove, topLine)

    t.is(bottomLine.segmentAbove, midLine)
    t.is(bottomLine.segmentBelow, null)

    t.is(topLine.segmentAbove, null)
    t.is(topLine.segmentBelow, midLine)

    sl.removeSegmentFromSweepline(midLine)
    t.is(topLine.segmentAbove, null)
    t.is(topLine.segmentBelow, bottomLine)
    t.is(bottomLine.segmentAbove, topLine)
})


test('Sweepline is correctly sorted again', function (t) {
    const e1 = new Event([-1, 0])
    const e2 = new Event([0, 0])

    e1.otherEvent = e2
    e2.otherEvent = e1
    e1.isLeftEndpoint = true;
    e2.isLeftEndpoint = false;

    const sl = new Sweepline()
    const midLine = sl.addSegment(e1)

    t.is(midLine.leftSweepEvent, e1)
    t.is(midLine.segmentAbove, null)
    t.is(midLine.segmentBelow, null)

    const e3 = new Event([-1.5, 1])
    const e4 = new Event([0, 0])

    e3.otherEvent = e4
    e4.otherEvent = e3
    e3.isLeftEndpoint = true;
    e4.isLeftEndpoint = false;

    const topLine = sl.addSegment(e3)

    t.is(midLine.segmentAbove, topLine)
    t.is(midLine.segmentBelow, null)
    t.is(topLine.segmentAbove, null)
    t.is(topLine.segmentBelow, midLine)

    const e5 = new Event([-1.5, -1])
    const e6 = new Event([0, 0])

    e5.otherEvent = e6
    e6.otherEvent = e5
    e5.isLeftEndpoint = true;
    e6.isLeftEndpoint = false;

    const bottomLine = sl.addSegment(e5)

    t.is(midLine.segmentBelow, bottomLine)
    t.is(midLine.segmentAbove, topLine)

    t.is(bottomLine.segmentAbove, midLine)
    t.is(bottomLine.segmentBelow, null)

    t.is(topLine.segmentAbove, null)
    t.is(topLine.segmentBelow, midLine)

    sl.removeSegmentFromSweepline(midLine)
    t.is(topLine.segmentAbove, null)
    t.is(topLine.segmentBelow, bottomLine)
    t.is(bottomLine.segmentAbove, topLine)

})
