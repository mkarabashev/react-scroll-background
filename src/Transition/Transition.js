import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hexToRgb from '../utils/hex-rgb';
import rgbToHex from '../utils/rgb-hex';

class Transition extends Component {
  constructor(props) {
    super(props);
    this.handleBg = this.handleBg.bind(this);
    this.determineBg = this.determineBg.bind(this);
    this.calcPosition = this.calcPosition.bind(this);
    this.calcColorVector = this.calcColorVector.bind(this);
  }

  componentDidMount() {
    this.handleBg();
    window.addEventListener('resize', () => this.handleBg());
    window.addEventListener('scroll', () => this.handleBg());
  }

  componentWillUnmount() {
    window.removeEventListener('resize');
    window.removeEventListener('scroll');
  }

  handleBg() {
    const {
      calcPosition,
      calcProgress,
      determineBg,
      props: { from, to, eventKey, handleTransition }
    } = this;

    const { vh, beginPos, endPos } = calcPosition();

    // send back the bg color
    if (vh < beginPos) handleTransition(eventKey, from, 'pre');
    else if (vh > endPos) handleTransition(eventKey, to, 'post');
    else handleTransition(
      eventKey,
      determineBg(calcProgress(beginPos, endPos, vh)),
      'current'
    )
  }

  // fns for calculating element position
  calcPosition() {
    const { begin, end, props: { position } } = this;

    const shouldConfigureVhPos = typeof position === 'number'
      && position >= 0
      && position <= 1;

    const vh = window.innerHeight * (shouldConfigureVhPos ? position : 0.5);
    const beginPos = begin.getBoundingClientRect().bottom;
    const endPos = end.getBoundingClientRect().bottom;

    // window height and offset position of the elements
    return { vh, beginPos, endPos };
  }

  calcProgress(begin, end, current) {
    return (current - begin) / (end - begin);
  }

  calcRange(start, finish) {
    return finish - start;
  }

  /**
  * fns for calculating the bg color
  * progress is determined by element pos
  **/

  calcColorVector(start, finish, progress) {
    return start + this.calcRange(start, finish) * progress;
  }

  determineBg(progress) {
    const { calcColorVector, props: { from, to } } = this;
    const [ sR, sG, sB ] = hexToRgb(from, to);
    const [ fR, fG, fB ] = hexToRgb(to, from);

    return '#' + rgbToHex(
      calcColorVector(sR, fR, progress),
      calcColorVector(sG, fG, progress),
      calcColorVector(sB, fB, progress),
    );
  }

  render() {
    const { height = 0, children } = this.props;

    return (
      <div>
        <div ref={node => this.begin = node} />
        <div ref={node => this.end = node} style={{ height }}>
          { children }
        </div>
      </div>
    );
  }
}

Transition.propTypes = {
  eventKey: PropTypes.number,
  handleTransition: PropTypes.func,
  height: PropTypes.string,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  position: PropTypes.number
};

export default Transition;
