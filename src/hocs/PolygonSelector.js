import { polygon as polygonTools } from 'polygon-tools';
import { getHorizontallyCentralPoint, getVerticallyLowestPoint } from '../utils/pointsUtils';
import PolygonLookup from 'polygon-lookup';

const getCoordPercentage = (e) => {
  return {
    x: e.nativeEvent.offsetX / e.currentTarget.offsetWidth * 100,
    y: e.nativeEvent.offsetY / e.currentTarget.offsetHeight * 100,
  };
};

export const TYPE = 'POLYGON';

function isPointOnLine(pointA, pointB, pointToCheck) {
  return (
    Math.hypot(pointToCheck[0] - pointA[0], pointToCheck[1] - pointA[1]) +
    Math.hypot(pointB[0] - pointToCheck[0], pointB[1] - pointToCheck[1]) ===
    Math.hypot(pointB[0] - pointA[0], pointB[1] - pointA[1])
  );
}

function isPointOnPolygonEdge({ x, y }, polygonPoints) {
  if (!polygonPoints || polygonPoints.length < 3 || !x || !y) {
    return false;
  }

  for (let i = 0; i < polygonPoints.length - 1; ++i) {
    if (i === 0) {
      if (isPointOnLine(polygonPoints[0], polygonPoints[polygonPoints.length - 1], [x, y])) {
        return true;
      }
    } else {
      if (isPointOnLine(polygonPoints[i], polygonPoints[i + 1], [x, y])) {
        return true;
      }
    }
  }
  return false;
}

export function intersects({ x, y }, geometry) {
  if (!geometry || !geometry.points || geometry.points.length < 3) return false;

  const pointsAsArrays = geometry.points.map((point) => [point.x, point.y]);

  const featureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        geometry: {
          type: 'Polygon',
          coordinates: [pointsAsArrays],
        },
      },
    ],
  };

  const lookup = new PolygonLookup(featureCollection);
  const poly = lookup.search(x, y);

  return poly !== undefined || isPointOnPolygonEdge({ x, y }, pointsAsArrays);
}

export function area(geometry) {
  if (!geometry || !geometry.points || geometry.points.length < 3) return 0;

  return polygonTools.area(geometry.points.map((point) => [point.x, point.y]));
}

export const methods = {
  onSelectionComplete: (annotation) => ({
    ...annotation,
    selection: {
      ...annotation.selection,
      showEditor: true,
      mode: 'EDITING',
    },
  }),

  onSelectionClear: (annotation) => ({
    ...annotation,
    geometry: {
      ...annotation.geometry,
      points: [],
    },
  }),

  onSelectionUndo: (annotation) => ({
    ...annotation,
    geometry: {
      ...annotation.geometry,
      points: annotation.geometry.points.slice(0, -1),
    },
  }),

  onClick: (annotation, e) => {
    const coordOfClick = getCoordPercentage(e);

    return {
      ...annotation,
      geometry: {
        ...annotation.geometry,
        type: TYPE,
        points: !annotation.geometry ? [coordOfClick] : [...annotation.geometry.points, coordOfClick],
      },
      selection: {
        ...annotation.selection,
        mode: 'SELECTING',
      },
    };
  },
};

export default {
  TYPE: TYPE,
  intersects: intersects,
  area: area,
  methods: methods,
};
