import React from 'react';
import styled from 'styled-components';
import { getHorizontallyCentralPoint, getVerticallyLowestPoint } from '../../utils/pointsUtils';

const Container = styled.div`
  background: white;
  border-radius: 5px; 
  box-shadow:
    0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  padding: 12px 20px; 
  margin-top: 8px;
  margin-left: 8px;
  color: black; 
  font-weight: bold; 
`;

function Content(props) {
  const { geometry } = props.annotation;
  if (!geometry) return null;

  return (
    <Container
      style={{
        position: 'absolute',
        left: `${geometry.type === 'POLYGON' ? getHorizontallyCentralPoint(geometry.points) + '%' : geometry.x + '%'}`,
        top: `${geometry.type === 'POLYGON'
        ? `${getVerticallyLowestPoint(geometry.points) + 10 * (1 / 5) + 10 * (4 / 5)*(1/100)}%`
        : `${geometry.y + geometry.height}%`}`,        ...props.style
      }}
      className={props.className}
      geometry={geometry}
    >
      {props.annotation.data && props.annotation.data.text}
    </Container>
  );
}

Content.defaultProps = {
  style: {},
  className: '',
};

export default Content;
