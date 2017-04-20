import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import AnimatedBg from './AnimatedBg';
import Transition from '../Transition';

let sandbox;

const transitionProps = {
  from: '#fff',
  to: '#000',
  height: '100px'
};

const jsx = (
  <AnimatedBg>
    <h1>Not a transition</h1>
    <Transition eventKey={1} {...transitionProps} />
    <Transition eventKey={2} {...transitionProps} />
  </AnimatedBg>
);

beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

afterEach(() => {
  sandbox.restore();
})

test('<AnimatedBg> findTransitionsNum should return the num of child transitions', () => {
  const wrapper = mount(jsx);

  const testKeyNum = () => {
    const { keyNum, findTransitionsNum } = wrapper.node;
    findTransitionsNum(wrapper.prop('children'));
    expect(keyNum).toEqual(2)
  };

  testKeyNum();
  testKeyNum();
});

test('<AnimatedBg> findTransitionsNum should trigger on componentWillMount', () => {
  const stub = sandbox.stub(AnimatedBg.prototype, 'findTransitionsNum');
  const wrapper = mount(jsx);
  expect(stub.callCount).toEqual(1);
});

test('<AnimatedBg> childrenWithTransition should trigger on componentWillMount', () => {
  const stub = sandbox.stub(AnimatedBg.prototype, 'childrenWithTransition');
  const wrapper = mount(jsx);
  expect(stub.callCount).toEqual(1);
});

test('<AnimatedBg> findTransitionsNum should trigger on componentWillReceiveProps', () => {
  const stub = sandbox.stub(AnimatedBg.prototype, 'findTransitionsNum');
  const wrapper = mount(jsx);

  const children = wrapper.prop('children');
  wrapper.setProps({
    children: [
      ...children,
      <Transition {...transitionProps} />
    ]
  });

  expect(stub.callCount).toEqual(2);
});

test('<AnimatedBg> childrenWithTransition should trigger on componentWillReceiveProps', () => {
  const stub = sandbox.stub(AnimatedBg.prototype, 'childrenWithTransition');
  const wrapper = mount(jsx);

  const children = wrapper.prop('children');
  wrapper.setProps({
    children: [
      ...children,
      <Transition {...transitionProps} />
    ]
  });

  expect(stub.callCount).toEqual(2);
});

test('<AnimatedBg> transitions should get injected with a handleTransition cb', () => {
  const wrapper = mount(jsx);

  const result = wrapper
    .find(Transition)
    .nodes
    .map(child => typeof child.props.handleTransition);

  const expected = [ 'function', 'function' ];

  expect(result).toEqual(expected);
});

test('<AnimateBg> transitions should get injected with an index eventKey', () => {
  const wrapper = mount(jsx);

  const result = wrapper
    .find(Transition)
    .nodes
    .map(child => child.props.eventKey);

  const expected = [ 0, 1 ];

  expect(result).toEqual(expected);
})

test('<AnimateBg> should inherit the bg color on setup', () => {
  const wrapper = mount(<AnimatedBg />);
  expect(wrapper.state().backgroundColor).toMatch('transparent');
});

test('<AnimatedBg> handleTransition should set the bg to the currently active transition', () => {
  const stub = sandbox.stub();

  const Container = Object.assign(
    AnimatedBg,
    {
      keyNum: 2,
      colors: [],
      setState: stub,
      state: {
        backgroundColor: 'test'
      }
    }
  );

  const handleTransition = Container.prototype.handleTransition.bind(Container);

  const testHandleTransition = (status1, status2) => {
    handleTransition(0, 'color', status1);
    handleTransition(1, 'color2', status2);
  };

  // if the color is the same, don't make any changes
  handleTransition(0, 'test', 'current');
  handleTransition(1, 'color2', 'pre');
  expect(stub.callCount).toEqual(0);

  // if no transition has been reached yet, pick the first transition
  testHandleTransition('pre', 'pre');
  expect(stub.callCount).toEqual(1);
  expect(stub.lastCall.args[0].backgroundColor).toEqual('color');

  // if second transition has not been reached, pick first
  testHandleTransition('post', 'pre');
  expect(stub.callCount).toEqual(2);
  expect(stub.lastCall.args[0].backgroundColor).toEqual('color');

  // if second transition has been reached pick second
  testHandleTransition('post', 'current');
  expect(stub.callCount).toEqual(3);
  expect(stub.lastCall.args[0].backgroundColor).toEqual('color2');

  // if all transitions have passed, pick last
  testHandleTransition('post', 'post');
  expect(stub.callCount).toEqual(4);
  expect(stub.lastCall.args[0].backgroundColor).toEqual('color2');
});
