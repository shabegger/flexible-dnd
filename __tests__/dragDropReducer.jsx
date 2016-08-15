jest.unmock('deep-freeze');
jest.unmock('./fixtures/component');
jest.unmock('../lib/store/dragDropReducer');

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import deepFreeze from 'deep-freeze';

import Component from './fixtures/component';

const dragDropReducer = require('../lib/store/dragDropReducer').default;
const Constants = require('../lib/constants/constants.json');

var source, target1, target2;

describe('The dragDropReducer function', function () {
  beforeEach(function () {
    source = TestUtils.renderIntoDocument(<Component name="source" />);
    target1 = TestUtils.renderIntoDocument(<Component name="target1" />);
    target2 = TestUtils.renderIntoDocument(<Component name="target2" />);
  });

  it('provides an initial state with null and 0 values', function () {
    expect(dragDropReducer()).toEqual({
      dragSource: null,
      dragKey: null,
      dropTarget: null,
      dropKey: null,
      dropTargets: [],
      currentTargets: [],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    });
  });

  it('returns current state when action is unrecognized', function () {
    const beforeState = deepFreeze({
      dragSource: source,
      dragKey: 'source',
      dropTarget: target1,
      dropKey: 'target1',
      dropTargets: [
        { target: target1, config: {} },
        { target: target2, config: {} }
      ],
      currentTargets: [{ target: target1, config: {} }],
      start: { x: 111, y: 222 },
      end: { x: 333, y: 444 }
    });

    const afterState = dragDropReducer(beforeState, {
      type: 'TEST'
    });

    expect(afterState).toEqual(beforeState);
  });

  it('reinitializes state on drag cancel', function () {
    const beforeState = deepFreeze({
      dragSource: source,
      dragKey: 'source',
      dropTarget: target1,
      dropKey: 'target1',
      dropTargets: [],
      currentTargets: [],
      start: { x: 150, y: 200 },
      end: { x: 300, y: 100 }
    });

    const afterState = dragDropReducer(beforeState, {
      type: Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL
    });

    expect(afterState).toEqual({
      dragSource: null,
      dragKey: null,
      dropTarget: null,
      dropKey: null,
      dropTargets: [],
      currentTargets: [],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    });
  });

  it('reinitializes state on drag end', function () {
    const beforeState = deepFreeze({
      dragSource: source,
      dragKey: 'source',
      dropTarget: target1,
      dropKey: 'target1',
      dropTargets: [],
      currentTargets: [],
      start: { x: 150, y: 200 },
      end: { x: 300, y: 100 }
    });

    const afterState = dragDropReducer(beforeState, {
      type: Constants.ACTIONS.DRAG_DROP.DRAG_END
    });

    expect(afterState).toEqual({
      dragSource: null,
      dragKey: null,
      dropTarget: null,
      dropKey: null,
      dropTargets: [],
      currentTargets: [],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    });
  });

  it('updates state on drag start', function () {
    const beforeState = deepFreeze({
      dragSource: null,
      dragKey: null,
      dropTarget: null,
      dropKey: null,
      dropTargets: [],
      currentTargets: [],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    });

    const afterState = dragDropReducer(beforeState, {
      type: Constants.ACTIONS.DRAG_DROP.DRAG_START,
      source: source,
      key: 'source',
      x: 625,
      y: 430
    });

    expect(afterState).toEqual({
      dragSource: source,
      dragKey: 'source',
      dropTarget: null,
      dropKey: null,
      dropTargets: [],
      currentTargets: [],
      start: { x: 625, y: 430 },
      end: { x: 625, y: 430 }
    });
  });

  it('updates state on drag move', function () {
    const beforeState = deepFreeze({
      dragSource: source,
      dragKey: 'source',
      dropTarget: null,
      dropKey: null,
      dropTargets: [],
      currentTargets: [],
      start: { x: 625, y: 430 },
      end: { x: 625, y: 430 }
    });

    const afterState = dragDropReducer(beforeState, {
      type: Constants.ACTIONS.DRAG_DROP.DRAG_MOVE,
      target: target2,
      key: 'target2',
      x: 345,
      y: 985
    });

    expect(afterState).toEqual({
      dragSource: source,
      dragKey: 'source',
      dropTarget: target2,
      dropKey: 'target2',
      dropTargets: [],
      currentTargets: [],
      start: { x: 625, y: 430 },
      end: { x: 345, y: 985 }
    });
  });

  it('updates drop targets on registration', function () {
    const beforeState = deepFreeze({
      dragSource: null,
      dragKey: null,
      dropTarget: null,
      dropKey: null,
      dropTargets: [
        { target: target1, config: {} }
      ],
      currentTargets: [],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    });

    const afterState = dragDropReducer(beforeState, {
      type: Constants.ACTIONS.REGISTER.DROP_TARGET,
      target: target2,
      config: {}
    });

    expect(afterState).toEqual({
      dragSource: null,
      dragKey: null,
      dropTarget: null,
      dropKey: null,
      dropTargets: [
        { target: target1, config: {} },
        { target: target2, config: {} }
      ],
      currentTargets: [],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    });
  });

  it('updates drop targets on unregistration', function () {
    const beforeState = deepFreeze({
      dragSource: null,
      dragKey: null,
      dropTarget: null,
      dropKey: null,
      dropTargets: [
        { target: target1, config: {} },
        { target: target2, config: {} }
      ],
      currentTargets: [],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    });

    const afterState = dragDropReducer(beforeState, {
      type: Constants.ACTIONS.UNREGISTER.DROP_TARGET,
      target: target1
    });

    expect(afterState).toEqual({
      dragSource: null,
      dragKey: null,
      dropTarget: null,
      dropKey: null,
      dropTargets: [
        { target: target2, config: {} }
      ],
      currentTargets: [],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    });
  });

  it('updates current targets', function () {
    const beforeState = deepFreeze({
      dragSource: source,
      dragKey: 'source',
      dropTarget: null,
      dropKey: null,
      dropTargets: [
        { target: target1, config: {} },
        { target: target2, config: {} }
      ],
      currentTargets: [ target1 ],
      start: { x: 100, y: 200 },
      end: { x: 100, y: 200 }
    });

    const afterState = dragDropReducer(beforeState, {
      type: Constants.ACTIONS.DRAG_DROP.DROP_TARGETS,
      targets: [{ target: target2, config: {} }]
    });

    expect(afterState).toEqual({
      dragSource: source,
      dragKey: 'source',
      dropTarget: null,
      dropKey: null,
      dropTargets: [
        { target: target1, config: {} },
        { target: target2, config: {} }
      ],
      currentTargets: [{ target: target2, config: {} }],
      start: { x: 100, y: 200 },
      end: { x: 100, y: 200 }
    });
  });
});
