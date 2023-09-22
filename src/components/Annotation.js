import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import compose from '../utils/compose';
import isMouseHovering from '../utils/isMouseHovering';
import withRelativeMousePos from '../utils/withRelativeMousePos';
import { PolygonSelector } from '../selectors';
import defaultProps from './defaultProps';
import Overlay from './Overlay';

const Container = styled.div`
  clear: both;
  position: relative;
  width: 100%;
  &:hover ${Overlay} {
    opacity: 1;
  }
`;

const Img = styled.img`
  display: block;
  width: 100%;
`;

const Items = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const Target = Items;

class Annotation extends Component {
  componentDidMount() {
    window.addEventListener("resize", this.forceUpdateComponent);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.forceUpdateComponent);
  }

  forceUpdateComponent = () => {
    this.forceUpdate();
  };

  componentDidUpdate(prevProps) {
    if (prevProps.imageZoomAmount !== this.props.imageZoomAmount) {
      this.forceUpdateComponent();
    }
  }

  setInnerRef = (el) => {
    this.container = el;
    this.props.relativeMousePos.innerRef(el);
    this.props.innerRef(el);
  };

  getSelectorByType = (type) => {
    return this.props.selectors.find((s) => s.TYPE === type);
  };

  getTopAnnotationAt = (x, y) => {
    const { annotations, getSelectorByType, container } = this.props;

    if (!container) return;

    const intersections = annotations.map((annotation) => {
      const { geometry } = annotation;
      const selector = getSelectorByType(geometry.type);

      return selector.intersects({ x, y }, geometry, container) ? annotation : false;
    }).filter(a => !!a).sort((a, b) => {
      const aSelector = getSelectorByType(a.geometry.type);
      const bSelector = getSelectorByType(b.geometry.type);

      return aSelector.area(a.geometry, container) - bSelector.area(b.geometry, container);
    });

    return intersections[0];
  };

  onTargetMouseMove = (e) => {
    this.props.relativeMousePos.onMouseMove(e);
    this.onMouseMove(e);
  };

  onTargetMouseLeave = (e) => {
    this.props.relativeMousePos.onMouseLeave(e);
  };

  onMouseUp = (e) => {
    this.callSelectorMethod('onMouseUp', e);
  };

  onMouseDown = (e) => {
    this.callSelectorMethod('onMouseDown', e);
  };

  onMouseMove = (e) => {
    this.callSelectorMethod('onMouseMove', e);
  };

  onClick = (e) => {
    const { onClickCheckFunc } = this.props;

    if (!onClickCheckFunc || onClickCheckFunc(e)) {
      this.callSelectorMethod('onClick', e);
    }
  };

  onSelectionComplete = () => {
    this.callSelectorMethod('onSelectionComplete');
  };

  onSelectionClear = () => {
    this.callSelectorMethod('onSelectionClear');
  };

  onSelectionUndo = () => {
    this.callSelectorMethod('onSelectionUndo');
  };

  onSubmit = () => {
    this.props.onSubmit(this.props.value);
  };

  callSelectorMethod = (methodName, e) => {
    if (this.props.disableAnnotation) {
      return;
    }

    if (this.props[methodName]) {
      this.props[methodName](e);
    } else {
      const selector = this.getSelectorByType(this.props.type);
      if (selector && selector.methods[methodName]) {
        const value = selector.methods[methodName](this.props.value, e);

        if (typeof value === 'undefined') {
          if (process.env.NODE_ENV !== 'production') {
            console.error(`
              ${methodName} of selector type ${this.props.type} returned undefined.
              Make sure to explicitly return the previous state
            `);
          }
        } else {
          this.props.onChange(value);
        }
      }
    }
  };

  shouldAnnotationBeActive = (annotation, top) => {
    if (this.props.activeAnnotations) {
      const isActive = !!this.props.activeAnnotations.find(active =>
        this.props.activeAnnotationComparator(annotation, active)
      );

      return isActive || top === annotation;
    } else {
      return top === annotation;
    }
  };

  render() {
    const {
      isMouseHovering,
      renderHighlight,
      renderContent,
      renderSelector,
      renderEditor,
      renderOverlay,
      renderPolygonControls,
      topAnnotationAtMouse
    } = this.props;

    return (
      <Container
        style={this.props.style}
        innerRef={isMouseHovering.innerRef}
        onMouseLeave={this.onTargetMouseLeave}
      >
        <Img
          className={this.props.className}
          style={this.props.style}
          alt={this.props.alt}
          src={this.props.src}
          draggable={false}
          innerRef={this.setInnerRef}
        />
        <Items>
          {this.props.annotations.map(annotation =>
            renderHighlight({
              key: annotation.data.id,
              annotation: annotation,
              active: this.shouldAnnotationBeActive(annotation, topAnnotationAtMouse)
            })
          )}
          {!this.props.disableSelector && this.props.value && this.props.value.geometry &&
            renderSelector({ annotation: this.props.value })}
        </Items>
        <Target
          onClick={this.onClick}
          onMouseUp={this.onMouseUp}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onTargetMouseMove}
        />
        {!this.props.disableOverlay &&
          renderOverlay({
            type: this.props.type,
            annotation: this.props.value
          })}
        {this.props.annotations.map(annotation => (
          /* this.shouldAnnotationBeActive(annotation, topAnnotationAtMouse)
          && ( */
          renderContent({
            key: annotation.data.id,
            annotation: annotation,
            imageZoomAmount: this.props.imageZoomAmount
          })
          // )
        ))}
        {!this.props.disableEditor && this.props.value && this.props.value.selection &&
          this.props.value.selection.showEditor &&
          renderEditor({
            annotation: this.props.value,
            onChange: this.props.onChange,
            onSubmit: this.onSubmit,
            imageZoomAmount: this.props.imageZoomAmount
          })}
        {this.props.value && this.props.value.geometry &&
          this.props.value.geometry.type === PolygonSelector.TYPE &&
          (!this.props.value.selection || !this.props.value.selection.showEditor) &&
          renderPolygonControls({
            annotation: this.props.value,
            onSelectionComplete: this.onSelectionComplete,
            onSelectionClear: this.onSelectionClear,
            onSelectionUndo: this.onSelectionUndo,
            imageZoomAmount: this.props.imageZoomAmount
          })}
      </Container>
    );
  }
}

Annotation.propTypes = {
  innerRef: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseMove: PropTypes.func,
  onClick: PropTypes.func,
  // This prop represents how zoom the image is (default: 1)
  imageZoomAmount: PropTypes.number,
  // This function is run before the onClick callback is executed (onClick
  // is only called if onClickCheckFunc resolve to true or doesn't exist)
  onClickCheckFunc: PropTypes.func,
  // For Polygon Selector
  onSelectionComplete: PropTypes.func,
  onSelectionClear: PropTypes.func,
  onSelectionUndo: PropTypes.func,

  annotations: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string
  })).isRequired,
  type: PropTypes.string,
  selectors: PropTypes.arrayOf(PropTypes.shape({
    TYPE: PropTypes.string,
    intersects: PropTypes.func.isRequired,
    area: PropTypes.func.isRequired,
    methods: PropTypes.object.isRequired
  })).isRequired,

  value: PropTypes.shape({
    selection: PropTypes.object,
    geometry: PropTypes.shape({
      type: PropTypes.string.isRequired
    }),
    data: PropTypes.object
  }),
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,

  activeAnnotationComparator: PropTypes.func,
  activeAnnotations: PropTypes.arrayOf(PropTypes.any),

  disableAnnotation: PropTypes.bool,
  disableSelector: PropTypes.bool,
  renderSelector: PropTypes.func,
  disableEditor: PropTypes.bool,
  renderEditor: PropTypes.func,

  renderHighlight: PropTypes.func.isRequired,
  renderContent: PropTypes.func.isRequired,

  disableOverlay: PropTypes.bool,
  renderOverlay: PropTypes.func.isRequired,
  renderPolygonControls: PropTypes.func.isRequired
};

Annotation.defaultProps = defaultProps;

export default compose(isMouseHovering(), withRelativeMousePos())(Annotation);
