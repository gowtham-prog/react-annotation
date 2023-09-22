import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color:rgba(128, 0, 0, 0.5); 
  border: 2px dashed red; 
  box-sizing: border-box;
  transition: box-shadow 0.21s ease-in-out;
  box-shadow: ${({ active }) => (active ? '0 0 3px 3px black inset' : 'none')};
`;

function Rectangle(props) {
  const { geometry } = props.annotation;
  if (!geometry) return null;

  return (
    <Container
      className={props.className}
      style={{
        left: `${geometry.x}%`,
        top: `${geometry.y}%`,
        height: `${geometry.height}%`,
        width: `${geometry.width}%`,
        ...props.style,
      }}
      active={props.active}
    />
  );
}

Rectangle.defaultProps = {
  className: '',
  style: {},
};

export default Rectangle;
