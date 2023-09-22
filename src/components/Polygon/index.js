import React from 'react';
import LineTo from 'react-lineto';
import styled from 'styled-components';

const PointDot = styled.div`
border: solid 3px white;
border-radius: 50%;
box-sizing: border-box;
box-shadow:
  0 0 0 1px rgba(0,0,0,0.3),
  0 0 0 2px rgba(0,0,0,0.2),
  0 5px 4px rgba(0,0,0,0.4);
height: 10px;
position: absolute;
transform: translate3d(-50%, -50%, 0);
width: 10px;
`;

function edgesFromPoints(points) {
  if (!points || points.length < 3) return [];

  const edges = [];
  for (let i = 0; i < points.length; ++i) {
    if (i + 1 === points.length) {
      edges.push(Math.hypot(points[0].x - points[i].x, points[0].y - points[i].y));
    } else {
      edges.push(Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y));
    }
  }

  return edges;
}

function Polygon(props) {
  const { geometry } = props.annotation;

  if (!geometry || !geometry.points || geometry.points.length === 0) return null;

  return (
    <div
      className={`linesContainer ${props.className}`}
      style={{
        width: '100%',
        height: '100%',
        ...props.style,
      }}
    >
      {geometry.points.length >= 3 &&
        geometry.points.map((item, i) => {
          const prevItem = i === 0 ? geometry.points[geometry.points.length - 1] : geometry.points[i - 1];
          return (
            <LineTo
              key={`${i}_${item.x}_${item.y}_${prevItem.x}_${prevItem.y}`}
              from="linesContainer"
              fromAnchor={`${item.x}% ${item.y}%`}
              to="linesContainer"
              toAnchor={`${prevItem.x}% ${prevItem.y}%`}
              borderColor="white"
              borderStyle="dashed"
              borderWidth={2}
              className={!props.active ? 'Polygon-LineTo' : 'Polygon-LineToActive'}
            />
          );
        })}
      {geometry.points.map((item, i) => (
        <PointDot
          key={`${i}_${item.x}_${item.y}`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
        />
      ))}
    </div>
  );
}

Polygon.defaultProps = {
  className: '',
  style: {},
};

export default Polygon;
