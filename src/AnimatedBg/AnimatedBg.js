import React, { Component } from 'react';
import Transition from '../Transition/Transition';

class AnimatedBg extends Component {
  constructor(props) {
    super(props);
    this.handleTransition = this.handleTransition.bind(this);
    this.findTransitionsNum = this.findTransitionsNum.bind(this);

    this.colors = [];
    this.keyNum = 0;
    this.state = {
      backgroundColor: 'transparent'
    };
  }

  componentWillMount() {
    this.findTransitionsNum(this.props.children);
    this.childrenWithTransition(this.props.children);
  }

  componentWillReceiveProps(nextProps) {
    this.findTransitionsNum(nextProps.children);
    this.childrenWithTransition(nextProps.children);
  }

  handleTransition(eventKey, color, activity) {
    this.colors[eventKey] = { color, activity };

    if (this.colors.length === this.keyNum) {
      const colorArr = this.colors.reverse();
      this.colors = [];

      for (let i = 0; i < this.keyNum; i++) {
        const { color, activity } = colorArr[i];

        if (activity === 'pre' && i + 1 !== this.keyNum) continue;
        if (color !== this.state.backgroundColor) this.setState ({
          backgroundColor: color
        });

        break;
      }
    }
  }

  findTransitionsNum(children) {
    this.keyNum = 0;
    React.Children.forEach(children, child => {
      if (child.type === Transition) this.keyNum += 1;
    });
  }

  childrenWithTransition(children) {
    const { handleTransition } = this;
    let eventKey = -1;

    this.children = React.Children.map(children, child => {
      if (child.type === Transition) {
        eventKey += 1;
        return React.cloneElement(child, { eventKey, handleTransition })
      }

      return child;
    });
  }

  render() {
    const { backgroundColor } = this.state;

    return (
      <div style={{ backgroundColor }}>
        { this.children }
      </div>
    );
  }
}

export default AnimatedBg;
