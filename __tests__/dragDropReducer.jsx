jest.unmock('../lib/store/dragDropReducer');

import React from 'react';

const dragDropReducer = require('../lib/store/dragDropReducer').default;
const Constants = require('../lib/constants/constants.json');

describe('The dragDropReducer function', function () {
  it('provides an initial state with null and 0 values', function () {
    expect(dragDropReducer()).toEqual({
      dragSource: null,
      dragKey: null,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    });
  });

  it('reinitializes state on drag cancel', function () {
    var beforeState = Object.freeze({
      dragSource: <div />,
      dragKey: 'abc',
      start: { x: 150, y: 200 },
      end: { x: 300, y: 100 }
    });

    var afterState = dragDropReducer(beforeState, {
      type: Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL
    });

    expect(afterState).toEqual({
      dragSource: null,
      dragKey: null,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    });
  });

  it('reinitializes state on drag end', function () {
    var beforeState = Object.freeze({
      dragSource: <div />,
      dragKey: 'abc',
      start: { x: 150, y: 200 },
      end: { x: 300, y: 100 }
    });

    var afterState = dragDropReducer(beforeState, {
      type: Constants.ACTIONS.DRAG_DROP.DRAG_END
    });

    expect(afterState).toEqual({
      dragSource: null,
      dragKey: null,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    });
  });

  it('updates state on drag start', function () {
    var beforeState = Object.freeze({
      dragSource: null,
      dragKey: null,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    });

    var afterState = dragDropReducer(beforeState, {
      type: Constants.ACTIONS.DRAG_DROP.DRAG_START,
      source: <div />,
      key: 'abc',
      x: 625,
      y: 430
    });

    expect(afterState).toEqual({
      dragSource: <div />,
      dragKey: 'abc',
      start: { x: 625, y: 430 },
      end: { x: 625, y: 430 }
    });
  });

  it('updates state on drag move', function () {
    var beforeState = Object.freeze({
      dragSource: <div />,
      dragKey: 'abc',
      start: { x: 625, y: 430 },
      end: { x: 625, y: 430 }
    });

    var afterState = dragDropReducer(beforeState, {
      type: Constants.ACTIONS.DRAG_DROP.DRAG_MOVE,
      x: 345,
      y: 985
    });

    expect(afterState).toEqual({
      dragSource: <div />,
      dragKey: 'abc',
      start: { x: 625, y: 430 },
      end: { x: 345, y: 985 }
    });
  });
});
