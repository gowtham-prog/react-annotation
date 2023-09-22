import React from 'react'
import styled, { keyframes } from 'styled-components'
import TextEditor from '../TextEditor'
import { getHorizontallyCentralPoint, getVerticallyLowestPoint } from '../../utils/pointsUtils';

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
`

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
  animation: ${fadeInScale} 0.31s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
`

function Editor (props) {
  const { geometry } = props.annotation
  if (!geometry) return null

  return (
    <Container
      className={props.className}
      style={{
        position: 'absolute',
        left: `${geometry.type === 'POLYGON' ? getHorizontallyCentralPoint(geometry.points) + '%' : geometry.x + '%'}`,
        top: `${geometry.type === 'POLYGON'
        ? `${getVerticallyLowestPoint(geometry.points) + 10 * (1 / 5) + 10 * (4 / 5)*(1/10)}%`
        : `${geometry.y + geometry.height}%`}`,        ...props.style
      }}
    >
      <TextEditor
        onChange={e => props.onChange({
          ...props.annotation,
          data: {
            ...props.annotation.data,
            text: e.target.value
          }
        })}
        onSubmit={props.onSubmit}
        value={props.annotation.data && props.annotation.data.text}
      />
    </Container>
  )
}

Editor.defaultProps = {
  className: '',
  style: {}
}

export default Editor
