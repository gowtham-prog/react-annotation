import React from 'react';

function DrawingShape(props) {
  const { geometry } = props.annotation;

  if (!geometry || !geometry.coordinates || geometry.coordinates.length < 2) {
    return null;
  }

  // Extract coordinates
  const coordinates = geometry.coordinates;

  // Create a path string for the SVG with smooth cubic Bezier curves
  const pathString = generateSmoothPathString(coordinates);

  return (
    <div
      className={props.className}
      style={{
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        overflow: 'hidden', // Hide overflowing content
        ...props.style,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d={pathString}
          stroke="black" // Customize stroke color
          strokeWidth="0.5" // Customize stroke width (adjust as needed)
          fill="none"
          strokeLinecap="round" // Rounded line ends for smoother freehand drawing
          strokeLinejoin="round" // Rounded line joins for smoother freehand drawing
        />
      </svg>
    </div>
  );
}

// Function to generate a path string with smooth cubic Bezier curves
function generateSmoothPathString(coordinates) {
  const path = [];
  path.push(`M ${coordinates[0].x} ${coordinates[0].y}`);

  for (let i = 1; i < coordinates.length - 2; i++) {
    const x1 = (coordinates[i].x + coordinates[i + 1].x) / 2;
    const y1 = (coordinates[i].y + coordinates[i + 1].y) / 2;
    const x2 = (coordinates[i + 1].x + coordinates[i + 2].x) / 2;
    const y2 = (coordinates[i + 1].y + coordinates[i + 2].y) / 2;
    path.push(`Q ${coordinates[i + 1].x} ${coordinates[i + 1].y}, ${x1} ${y1}`);
    path.push(`Q ${coordinates[i + 1].x} ${coordinates[i + 1].y}, ${x2} ${y2}`);
  }

  // Add the last two coordinates as a straight line
  path.push(`L ${coordinates[coordinates.length - 1].x} ${coordinates[coordinates.length - 1].y}`);

  return path.join(' ');
}

DrawingShape.defaultProps = {
  className: '',
  style: {},
};

export default DrawingShape;
