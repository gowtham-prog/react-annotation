export function getHorizontallyCentralPoint(points) {
    const leftMostHorizontalPoint = points.reduce((prev, curr) => (curr.x < prev.x ? curr : prev)).x;
    const rightMostHorizontalPoint = points.reduce((prev, curr) => (curr.x > prev.x ? curr : prev)).x;

    return leftMostHorizontalPoint + Math.round((rightMostHorizontalPoint - leftMostHorizontalPoint) / 2);
}

export function getVerticallyLowestPoint(points) {
    return points.reduce((prev, curr) => (curr.y > prev.y ? curr : prev)).y;
}
