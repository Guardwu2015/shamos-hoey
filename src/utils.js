export function degreesToRadians(degrees) {
    // const radians = degrees % 360
    return degrees * Math.PI / 180
}

export function radiansToDegrees(radians) {
    // const degrees = radians % (2 * Math.PI)
    return radians * 180 / Math.PI
}

export function bearing(event1, event2) {

    const lon1 = degreesToRadians(event1.x)
    const lon2 = degreesToRadians(event2.x)
    const lat1 = degreesToRadians(event1.y)
    const lat2 = degreesToRadians(event2.y)

    const a = Math.sin(lon2 - lon1) * Math.cos(lat2)
    const b = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)

    return radiansToDegrees(Math.atan2(a, b))
}
