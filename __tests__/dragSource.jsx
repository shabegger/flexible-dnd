jest.unmock('./fixtures/draggable');

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import stubContext from 'react-stub-context';

import { Draggable, DragSourceDraggable } from './fixtures/draggable';

const DragDropStore = require('../lib/store/dragDropStore').default;
const Constants = require('../lib/constants/constants.json');

function getRenderedDraggable(context, fn) {
  var Root = context ? stubContext(DragSourceDraggable, context) : DragSourceDraggable,
      root = TestUtils.renderIntoDocument(<Root />);

  if (fn) {
    fn(TestUtils.findRenderedComponentWithType(root, DragSourceDraggable));
  }

  return TestUtils.findRenderedComponentWithType(root, Draggable);
}

describe('The DragSource composition constructor', function () {
  it('provides the "connectDragSource" function', function () {
    const renderedDraggable = getRenderedDraggable({
      __dragDropContext: {}
    });

    expect(renderedDraggable.props.connectDragSource).toEqual(jasmine.any(Function));
  });

  it('provides an (initially false) "isDragging" property', function () {
    const renderedDraggable = getRenderedDraggable({
      __dragDropContext: {}
    });

    expect(renderedDraggable.props.isDragging).toBe(false);
  });

  describe('on mouse down', function () {
    beforeEach(function () {
      spyOn(DragDropStore, 'dispatch');
    });

    it('sets dragging props', function () {
      var context = {
        __dragDropContext: {}
      };

      const renderedDraggable = getRenderedDraggable(context, function (dragEl) {
        context.__dragDropContext.dragSource = dragEl;
      });

      const renderedDiv = TestUtils.findRenderedDOMComponentWithTag(renderedDraggable, 'div');

      TestUtils.Simulate.mouseDown(renderedDiv, {});

      expect(renderedDraggable.props.isDragging).toBe(true);
      expect(renderedDraggable.props.dragKey).toBe('dragTest');
    });

    it('sets drag deltas based on context', function () {
      var context = {
        __dragDropContext: {
          dragDelta: {
            x: 50,
            y: -40
          }
        }
      };

      const renderedDraggable = getRenderedDraggable(context, function (dragEl) {
        context.__dragDropContext.dragSource = dragEl;
      });

      const renderedDiv = TestUtils.findRenderedDOMComponentWithTag(renderedDraggable, 'div');

      TestUtils.Simulate.mouseDown(renderedDiv, {});

      expect(renderedDraggable.props.dragDeltaX).toBe(50);
      expect(renderedDraggable.props.dragDeltaY).toBe(-40);
    });

    it('dispatches the DRAG_START action', function () {
      var context = {
        __dragDropContext: {}
      };

      var dragSourceDraggable;

      const renderedDraggable = getRenderedDraggable(context, function (dragEl) {
        dragSourceDraggable = dragEl;
      });

      const renderedDiv = TestUtils.findRenderedDOMComponentWithTag(renderedDraggable, 'div');

      TestUtils.Simulate.mouseDown(renderedDiv, {
        clientX: 300,
        clientY: 450
      });

      expect(DragDropStore.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_START,
        source: dragSourceDraggable,
        x: 300,
        y: 450
      });
    });
  });

  describe('on touch start', function () {
    beforeEach(function () {
      spyOn(DragDropStore, 'dispatch');
    });

    it('sets dragging props', function () {
      var context = {
        __dragDropContext: {}
      };

      const renderedDraggable = getRenderedDraggable(context, function (dragEl) {
        context.__dragDropContext.dragSource = dragEl;
      });

      const renderedDiv = TestUtils.findRenderedDOMComponentWithTag(renderedDraggable, 'div');

      TestUtils.Simulate.touchStart(renderedDiv, {});

      expect(renderedDraggable.props.isDragging).toBe(true);
      expect(renderedDraggable.props.dragKey).toBe('dragTest');
    });

    it('sets drag deltas based on context', function () {
      var context = {
        __dragDropContext: {
          dragDelta: {
            x: 50,
            y: -40
          }
        }
      };

      const renderedDraggable = getRenderedDraggable(context, function (dragEl) {
        context.__dragDropContext.dragSource = dragEl;
      });

      const renderedDiv = TestUtils.findRenderedDOMComponentWithTag(renderedDraggable, 'div');

      TestUtils.Simulate.touchStart(renderedDiv, {});

      expect(renderedDraggable.props.dragDeltaX).toBe(50);
      expect(renderedDraggable.props.dragDeltaY).toBe(-40);
    });

    it('dispatches the DRAG_START action', function () {
      var context = {
        __dragDropContext: {}
      };

      var dragSourceDraggable;

      const renderedDraggable = getRenderedDraggable(context, function (dragEl) {
        dragSourceDraggable = dragEl;
      });

      const renderedDiv = TestUtils.findRenderedDOMComponentWithTag(renderedDraggable, 'div');

      TestUtils.Simulate.mouseDown(renderedDiv, {
        touches: {
          item: function () {
            return {
              clientX: 300,
              clientY: 450
            };
          }
        }
      });

      expect(DragDropStore.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_START,
        source: dragSourceDraggable,
        x: 300,
        y: 450
      });
    });
  });
});
