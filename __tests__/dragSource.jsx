jest.unmock('./fixtures/draggable');

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import stubContext from 'react-stub-context';
import { createStore } from 'redux';

import { Draggable, DragSourceDraggable } from './fixtures/draggable';

const Constants = require('../lib/constants/constants.json');

var root, sourceDraggable, draggable, store, dispatch;

describe('The DragSource composable', function () {
  beforeEach(function () {
    var Root;

    store = createStore(() => {});
    dispatch = () => {
      store.dispatch({ type: 'TEST' });
    };

    Root = stubContext(DragSourceDraggable, { __dragDropStore: store });

    root = TestUtils.renderIntoDocument(<Root />);
    sourceDraggable = TestUtils.findRenderedComponentWithType(root, DragSourceDraggable);
    draggable = TestUtils.findRenderedComponentWithType(sourceDraggable, Draggable);
  });

  it('provides the "connectDragSource" function', function () {
    expect(draggable.props.connectDragSource).toEqual(jasmine.any(Function));
  });

  it('provides an (initially false) "isDragging" property', function () {
    expect(draggable.props.isDragging).toBe(false);
  });

  it('provides dragging props when it is the current dragSource', function () {
    spyOn(store, 'getState').and.returnValue({
      dragSource: sourceDraggable,
      dragKey: 'dragTest',
      start: { x: 100, y: 100 },
      end: { x: 350, y: 250 }
    });

    dispatch();

    expect(draggable.props).toEqual(jasmine.objectContaining({
      isDragging: true,
      dragKey: 'dragTest',
      dragDeltaX: 250,
      dragDeltaY: 150
    }));
  });

  it('does not provide dragging props when it is not the current dragSource', function () {
    spyOn(store, 'getState').and.returnValue({
      dragSource: <div />,
      dragKey: 'dragTest',
      start: { x: 100, y: 100 },
      end: { x: 350, y: 250 }
    });

    dispatch();

    expect(draggable.props.isDragging).toBe(false);
    expect(draggable.props.dragKey).toBeUndefined();
    expect(draggable.props.dragDeltaX).toBeUndefined();
    expect(draggable.props.dragDeltaY).toBeUndefined();
  });

  it('re-renders when it is the current dragSource', function () {
    spyOn(sourceDraggable, 'render').and.callThrough();
    spyOn(store, 'getState').and.returnValue({
      dragSource: sourceDraggable,
      dragKey: 'dragTest',
      start: { x: 100, y: 100 },
      end: { x: 350, y: 250 }
    });

    dispatch();

    expect(sourceDraggable.render).toHaveBeenCalled();
  });

  it('re-renders when it stops being the current dragSource', function () {
    spyOn(sourceDraggable, 'render').and.callThrough();
    spyOn(store, 'getState').and.returnValue({
      dragSource: null,
      dragKey: null,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    });

    sourceDraggable.state.isDragging = true;
    dispatch();

    expect(sourceDraggable.render).toHaveBeenCalled();
  });

  it('does not re-render when it is not the current dragSource', function () {
    spyOn(sourceDraggable, 'render').and.callThrough();
    spyOn(store, 'getState').and.returnValue({
      dragSource: <div />,
      dragKey: 'dragTest',
      start: { x: 100, y: 100 },
      end: { x: 350, y: 250 }
    });

    dispatch();

    expect(sourceDraggable.render).not.toHaveBeenCalled();
  });

  it('dispatches the DRAG_START action on mouse down', function () {
    const div = TestUtils.findRenderedDOMComponentWithTag(draggable, 'div');

    spyOn(store, 'dispatch');

    TestUtils.Simulate.mouseDown(div, {
      clientX: 300,
      clientY: 450
    });

    expect(store.dispatch).toHaveBeenCalledWith({
      type: Constants.ACTIONS.DRAG_DROP.DRAG_START,
      source: sourceDraggable,
      key: 'dragTest',
      x: 300,
      y: 450
    });
  });

  it('dispatches the DRAG_START action on touch start', function () {
    const div = TestUtils.findRenderedDOMComponentWithTag(draggable, 'div');

    spyOn(store, 'dispatch');

    TestUtils.Simulate.touchStart(div, {
      touches: {
        item: function () {
          return {
            clientX: 300,
            clientY: 450
          };
        }
      }
    });

    expect(store.dispatch).toHaveBeenCalledWith({
      type: Constants.ACTIONS.DRAG_DROP.DRAG_START,
      source: sourceDraggable,
      key: 'dragTest',
      x: 300,
      y: 450
    });
  });
});
