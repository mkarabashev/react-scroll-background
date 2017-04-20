import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Transition from './Transition';

const originalHeight = window.innerHeight;

const posEvalStubBegin = sinon.stub();
const posEvalStubEnd = sinon.stub();

const posStubsVals = (val) => {
  posEvalStubBegin.returns({ bottom: val });
  posEvalStubEnd.returns({ bottom: val +  2 * Math.abs(val) });
};

const handleBgSetup = (ComponentInstance, vpHeight) => {
  posStubsVals(20);
  window.innerHeight = vpHeight;
  ComponentInstance.handleBg();
  return ComponentInstance.props.handleTransition.lastCall.args;
};

const data = {
  props: {
    from: '#03a9f4',
    to: '#ffffff',
    eventKey: 1,
    height: '100px',
    handleTransition: sinon.spy()
  },
  begin: {
    getBoundingClientRect: posEvalStubBegin
  },
  end: {
    getBoundingClientRect: posEvalStubEnd
  }
};

const TransitionInstance = Object.assign(new Transition, data);

afterEach(() => {
  window.innerHeight = originalHeight;
});

test('<Transition> clacRange should return the dif between two numbers', () => {
  const calcRange = TransitionInstance.calcRange;
  expect(calcRange(0, 1)).toEqual(1);
  expect(calcRange(1, 1)).toEqual(0);
  expect(calcRange(1, 0)).toEqual(-1);
});

test('<Transition> calcProgress should return completion rate of the transition', () => {
  const calcProgress = TransitionInstance.calcProgress;
  expect(calcProgress(0, 100, 0)).toEqual(0);
  expect(calcProgress(0, 100, 100)).toEqual(1);
  expect(calcProgress(0, 100, 50)).toEqual(0.5);
  expect(calcProgress(50, 100, 75)).toEqual(0.5);
  expect(calcProgress(-100, 100, 0)).toEqual(0.5);
});

test('<Transition> clacColorVector should return an rgb vector value', () => {
  const calcColorVector = TransitionInstance.calcColorVector;
  expect(calcColorVector(0, 100, 0.5)).toEqual(50);
  expect(calcColorVector(100, 0, 0.5)).toEqual(50);
  expect(calcColorVector(100, 100, 0.5)).toEqual(100);
});

test('<Transition> determineBg should return a new hex color', () => {
  const determineBg = TransitionInstance.determineBg
  expect(determineBg(0)).toEqual(TransitionInstance.props.from);
  expect(determineBg(1)).toEqual(TransitionInstance.props.to);
  expect(determineBg(0.5)).toEqual('#81d4f9');
});

test('<Transition> calcPosition should return an object with the relevant data', () => {
  const calcPosition = TransitionInstance.calcPosition;
  posStubsVals(20);
  const result = Object.keys(calcPosition());
  expect(result).toEqual([ 'vh', 'beginPos', 'endPos' ]);
});

test('<Transition> handleBg should return an eventKey, color, and status', () => {
  const result = handleBgSetup(TransitionInstance, 100);
  expect(result.length).toEqual(3);
  expect(result[0]).toBe(data.props.eventKey);
  expect(result[1]).toMatch(/^#\w.*$/);
  expect(result[2]).toBe('current');
});

test('<Transition> handleBg should handle pre event', () => {
  const result = handleBgSetup(TransitionInstance, 0);
  const expected = [ data.props.eventKey, data.props.from, 'pre' ];
  expect(result).toEqual(expected);
});

test('<Transition> handleBg should handle post event', () => {
  const result = handleBgSetup(TransitionInstance, 200);
  const expected = [ data.props.eventKey, data.props.to, 'post' ];
  expect(result).toEqual(expected);
});

test('<Transition> handleBg should handle current event', () => {
  const result = handleBgSetup(TransitionInstance, 80);
  const expected = [ data.props.eventKey, '#81d4f9', 'current' ];
  expect(result).toEqual(expected);
});

test('<Transition> handleBg should trigger the transition at the specified position', () => {
  const propsWithPosition = {
    props: {
      ...data.props,
      position: 0
    }
  }

  const PageBeginning = Object.assign(
    TransitionInstance,
    propsWithPosition
  );

  const result = handleBgSetup(PageBeginning, 80);
  const expected = [ data.props.eventKey, data.props.from, 'pre' ];
  expect(result).toEqual(expected);
});

test('<Transition> listers should be created on mount', () => {
  const fake = sinon.sandbox.create();
  window.addEventListener = fake.spy();
  const wrapper = mount(<Transition {...data.props} />);

  expect(window.addEventListener.secondCall.args[0]).toEqual('resize');
  expect(window.addEventListener.thirdCall.args[0]).toEqual('scroll');
  expect(window.addEventListener.callCount).toEqual(3);

  fake.restore();
});

test('<Transition> listers should be removed on unmount', () => {
  const fake = sinon.sandbox.create();
  window.removeEventListener = fake.spy();
  const wrapper = mount(<Transition {...data.props} />);
  wrapper.unmount();

  expect(window.removeEventListener.firstCall.args[0]).toEqual('resize');
  expect(window.removeEventListener.secondCall.args[0]).toEqual('scroll');
  expect(window.removeEventListener.callCount).toEqual(2);

  fake.restore();
})

test('<Transition> should setup the height of the transition', () => {
  const wrapper = shallow(<Transition {...data.props} />);
  const children = wrapper.children();

  expect(children.length).toEqual(2);
  expect(children.nodes[0].type).toBe('div');
  expect(children.nodes[1].type).toBe('div');
  expect(children.nodes[1].props).toMatchObject({ style: { height: '100px' } });
})

test('<Transition> should be able to incorporate through children', () => {
  const wrapper = shallow(
    <Transition {...data.props}>
      testChild
    </Transition>
  );

  expect(wrapper.find('div').nodes[2].props).toMatchObject({
    children: 'testChild',
    style: {
      height: '100px'
    }
  });
});
