jest.unmock('./fixtures/container');

import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { Child, Container, DragDropContextContainer } from './fixtures/container';

const DragDropStore = require('../lib/store/dragDropStore').default;
const Constants = require('../lib/constants/constants.json');

function getRenderedContainer() {
  var root = TestUtils.renderIntoDocument(<DragDropContextContainer />);

  return TestUtils.findRenderedComponentWithType(root, Container);
}

describe('The DragDropContext composition constructor', function () {
  it('provides the "connectDragDropContext" function', function () {
    spyOn(DragDropStore, 'getState').and.returnValue({
      dragSource: null,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 }
    });

    const renderedContainer = getRenderedContainer();

    expect(renderedContainer.props.connectDragDropContext).toEqual(jasmine.any(Function));
  });

  describe('when there is no drag source', function () {
    beforeEach(function () {
      spyOn(DragDropStore, 'dispatch');
      spyOn(DragDropStore, 'getState').and.returnValue({
        dragSource: null,
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 }
      });
    });

    it('sets child context', function () {
      const renderedContainer = getRenderedContainer();
      const renderedChild = TestUtils.findRenderedComponentWithType(renderedContainer, Child);

      expect(renderedChild.context).toEqual({
        __dragDropContext: {
          dragSource: null,
          dragDelta: { x: 0, y: 0 }
        }
      });
    });

    it('does not dispatch an action on mouse leave', function () {
      const renderedContainer = getRenderedContainer();
      const renderedDiv =
        TestUtils.findRenderedDOMComponentWithClass(renderedContainer, 'test-container');

      TestUtils.Simulate.mouseLeave(renderedDiv, {});

      expect(DragDropStore.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on mouse up', function () {
      const renderedContainer = getRenderedContainer();
      const renderedDiv =
        TestUtils.findRenderedDOMComponentWithClass(renderedContainer, 'test-container');

      TestUtils.Simulate.mouseUp(renderedDiv, {});

      expect(DragDropStore.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on mouse move', function () {
      const renderedContainer = getRenderedContainer();
      const renderedDiv =
        TestUtils.findRenderedDOMComponentWithClass(renderedContainer, 'test-container');

      TestUtils.Simulate.mouseMove(renderedDiv, {
        clientX: 300,
        clientY: 450
      });

      expect(DragDropStore.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on touch cancel', function () {
      const renderedContainer = getRenderedContainer();
      const renderedDiv =
        TestUtils.findRenderedDOMComponentWithClass(renderedContainer, 'test-container');

      TestUtils.Simulate.touchCancel(renderedDiv, {});

      expect(DragDropStore.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on touch end', function () {
      const renderedContainer = getRenderedContainer();
      const renderedDiv =
        TestUtils.findRenderedDOMComponentWithClass(renderedContainer, 'test-container');

      TestUtils.Simulate.touchEnd(renderedDiv, {});

      expect(DragDropStore.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on touch move', function () {
      const renderedContainer = getRenderedContainer();
      const renderedDiv =
        TestUtils.findRenderedDOMComponentWithClass(renderedContainer, 'test-container');

      TestUtils.Simulate.touchMove(renderedDiv, {
        touches: {
          item: function () {
            return {
              clientX: 300,
              clientY: 450
            };
          }
        }
      });

      expect(DragDropStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('when there is a drag source', function () {
    beforeEach(function () {
      spyOn(DragDropStore, 'dispatch');
      spyOn(DragDropStore, 'getState').and.returnValue({
        dragSource: <div />,
        start: { x: 100, y: 100 },
        end: { x: 250, y: 350 }
      });
    });

    it('sets child context', function () {
      const renderedContainer = getRenderedContainer();
      const renderedChild = TestUtils.findRenderedComponentWithType(renderedContainer, Child);

      expect(renderedChild.context).toEqual({
        __dragDropContext: {
          dragSource: <div />,
          dragDelta: { x: 150, y: 250 }
        }
      });
    });

    it('dispatches the DRAG_CANCEL action on mouse leave', function () {
      const renderedContainer = getRenderedContainer();
      const renderedDiv =
        TestUtils.findRenderedDOMComponentWithClass(renderedContainer, 'test-container');

      TestUtils.Simulate.mouseLeave(renderedDiv, {});

      expect(DragDropStore.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL
      });
    });

    it('dispatches the DRAG_END action on mouse up', function () {
      const renderedContainer = getRenderedContainer();
      const renderedDiv =
        TestUtils.findRenderedDOMComponentWithClass(renderedContainer, 'test-container');

      TestUtils.Simulate.mouseUp(renderedDiv, {});

      expect(DragDropStore.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_END
      });
    });

    it('dispatches the DRAG_MOVE action on mouse move', function () {
      const renderedContainer = getRenderedContainer();
      const renderedDiv =
        TestUtils.findRenderedDOMComponentWithClass(renderedContainer, 'test-container');

      TestUtils.Simulate.mouseMove(renderedDiv, {
        clientX: 300,
        clientY: 450
      });

      expect(DragDropStore.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_MOVE,
        x: 300,
        y: 450
      });
    });

    it('dispatches the DRAG_CANCEL action on touch cancel', function () {
      const renderedContainer = getRenderedContainer();
      const renderedDiv =
        TestUtils.findRenderedDOMComponentWithClass(renderedContainer, 'test-container');

      TestUtils.Simulate.touchCancel(renderedDiv, {});

      expect(DragDropStore.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL
      });
    });

    it('dispatches the DRAG_END action on touch end', function () {
      const renderedContainer = getRenderedContainer();
      const renderedDiv =
        TestUtils.findRenderedDOMComponentWithClass(renderedContainer, 'test-container');

      TestUtils.Simulate.touchEnd(renderedDiv, {});

      expect(DragDropStore.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_END
      });
    });

    it('dispatches the DRAG_MOVE action on touch move', function () {
      const renderedContainer = getRenderedContainer();
      const renderedDiv =
        TestUtils.findRenderedDOMComponentWithClass(renderedContainer, 'test-container');

      TestUtils.Simulate.touchMove(renderedDiv, {
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
        type: Constants.ACTIONS.DRAG_DROP.DRAG_MOVE,
        x: 300,
        y: 450
      });
    });
  });
});
