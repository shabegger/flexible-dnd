jest.unmock('./fixtures/container');

import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { Child, Container, DragDropContextContainer } from './fixtures/container';

const dragDropReducer = require('../lib/store/dragDropReducer').default;
const Constants = require('../lib/constants/constants.json');

var contextContainer, container, child, store;

describe('The DragDropContext composable', function () {
  beforeEach(function () {
    contextContainer = TestUtils.renderIntoDocument(<DragDropContextContainer />);
    container = TestUtils.findRenderedComponentWithType(contextContainer, Container);
    child = TestUtils.findRenderedComponentWithType(container, Child);
    store = contextContainer.store;
  });

  it('provides the "connectDragDropContext" function', function () {
    expect(container.props.connectDragDropContext).toEqual(jasmine.any(Function));
  });

  describe('when there is no drag source', function () {
    beforeEach(function () {
      spyOn(store, 'dispatch');
      spyOn(store, 'getState').and.returnValue({
        dragSource: null,
        dragKey: null,
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 }
      });
    });

    it('sets child context', function () {
      expect(child.context).toEqual({
        __dragDropStore: store
      });
    });

    it('does not dispatch an action on mouse leave', function () {
      const div = TestUtils.findRenderedDOMComponentWithClass(container, 'test-container');

      TestUtils.Simulate.mouseLeave(div, {});

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on mouse up', function () {
      const div = TestUtils.findRenderedDOMComponentWithClass(container, 'test-container');

      TestUtils.Simulate.mouseUp(div, {});

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on mouse move', function () {
      const div = TestUtils.findRenderedDOMComponentWithClass(container, 'test-container');

      TestUtils.Simulate.mouseMove(div, {
        clientX: 300,
        clientY: 450
      });

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on touch cancel', function () {
      const div = TestUtils.findRenderedDOMComponentWithClass(container, 'test-container');

      TestUtils.Simulate.touchCancel(div, {});

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on touch end', function () {
      const div = TestUtils.findRenderedDOMComponentWithClass(container, 'test-container');

      TestUtils.Simulate.touchEnd(div, {});

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on touch move', function () {
      const div = TestUtils.findRenderedDOMComponentWithClass(container, 'test-container');

      TestUtils.Simulate.touchMove(div, {
        touches: {
          item: function () {
            return {
              clientX: 300,
              clientY: 450
            };
          }
        }
      });

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('when there is a drag source', function () {
    beforeEach(function () {
      spyOn(store, 'dispatch');
      spyOn(store, 'getState').and.returnValue({
        dragSource: <div />,
        dragKey: 'abc',
        start: { x: 100, y: 100 },
        end: { x: 250, y: 350 }
      });
    });

    it('sets child context', function () {
      expect(child.context).toEqual({
        __dragDropStore: store
      });
    });

    it('dispatches the DRAG_CANCEL action on mouse leave', function () {
      const div = TestUtils.findRenderedDOMComponentWithClass(container, 'test-container');

      TestUtils.Simulate.mouseLeave(div, {});

      expect(store.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL
      });
    });

    it('dispatches the DRAG_END action on mouse up', function () {
      const div = TestUtils.findRenderedDOMComponentWithClass(container, 'test-container');

      TestUtils.Simulate.mouseUp(div, {});

      expect(store.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_END
      });
    });

    it('dispatches the DRAG_MOVE action on mouse move', function () {
      const div = TestUtils.findRenderedDOMComponentWithClass(container, 'test-container');

      TestUtils.Simulate.mouseMove(div, {
        clientX: 300,
        clientY: 450
      });

      expect(store.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_MOVE,
        x: 300,
        y: 450
      });
    });

    it('dispatches the DRAG_CANCEL action on touch cancel', function () {
      const div = TestUtils.findRenderedDOMComponentWithClass(container, 'test-container');

      TestUtils.Simulate.touchCancel(div, {});

      expect(store.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL
      });
    });

    it('dispatches the DRAG_END action on touch end', function () {
      const div = TestUtils.findRenderedDOMComponentWithClass(container, 'test-container');

      TestUtils.Simulate.touchEnd(div, {});

      expect(store.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_END
      });
    });

    it('dispatches the DRAG_MOVE action on touch move', function () {
      const div = TestUtils.findRenderedDOMComponentWithClass(container, 'test-container');

      TestUtils.Simulate.touchMove(div, {
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
        type: Constants.ACTIONS.DRAG_DROP.DRAG_MOVE,
        x: 300,
        y: 450
      });
    });
  });
});
