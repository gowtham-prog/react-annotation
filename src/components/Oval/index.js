import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  border: dotted 2px red;
  border-radius: 100%;
  box-shadow: 0px 0px px 1px black inset;
  background-color:rgba(128, 0, 0, 0.5); 
  transition: box-shadow 0.21s ease-in-out;
`

function Oval (props) {
  const { geometry } = props.annotation
  if (!geometry) return null

  return (
    <Container
      className={props.className}
      style={{
        position: 'absolute',
        left: `${geometry.x}%`,
        top: `${geometry.y}%`,
        height: `${geometry.height}%`,
        width: `${geometry.width}%`,
        boxShadow: props.active && '0 0 3px 3px black inset',
        ...props.style
      }}
    />
  )
}

Oval.defaultProps = {
  className: '',
  style: {}
}

export default Oval
