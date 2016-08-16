jest.unmock('./fixtures/component');
jest.unmock('./fixtures/container');
jest.unmock('../lib/store/actionCreators');

import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Component from './fixtures/component';
import { Child, Container, DragDropContextContainer } from './fixtures/container';

const dragDropReducer = require('../lib/store/dragDropReducer');
const Constants = require('../lib/constants/constants.json');

var contextContainer, container, child, store, dispatch;

describe('The DragDropContext composable', function () {
  beforeEach(function () {
    spyOn(dragDropReducer, 'default').and.returnValue({});

    contextContainer = TestUtils.renderIntoDocument(<DragDropContextContainer />);
    container = TestUtils.findRenderedComponentWithType(contextContainer, Container);
    child = TestUtils.findRenderedComponentWithType(container, Child);

    store = contextContainer.store;
    dispatch = () => {
      store.dispatch({ type: 'TEST' });
    };
  });

  it('provides the "connectDragDropContext" function', function () {
    expect(container.props.connectDragDropContext).toEqual(jasmine.any(Function));
  });

  it('only accepts a DOM element in "connectDragDropContext"', function () {
    var thrown = false;

    try {
      container.props.connectDragDropContext(<div />);
    } catch (ex) {
      thrown = true;
    }

    expect(thrown).toBe(false);

    try {
      container.props.connectDragDropContext(<Component />);
    } catch (ex) {
      thrown = true;
    }

    expect(thrown).toBe(true);
  });

  it('sets child context', function () {
    expect(child.context).toEqual({
      __dragDropStore: store
    });
  });

  it('calls "config.canDrop" on targets with drag source as an argument', function () {
    const source = TestUtils.renderIntoDocument(<Component name="source" />),
          target1 = TestUtils.renderIntoDocument(<Component name="target1" />),
          target2 = TestUtils.renderIntoDocument(<Component name="target2" />),
          config = jasmine.createSpyObj([ 'canDrop' ]);

    target1.component = TestUtils.findRenderedDOMComponentWithTag(target1, 'div');
    target2.component = TestUtils.findRenderedDOMComponentWithTag(target2, 'div');

    spyOn(store, 'getState').and.returnValue({
      dragSource: source,
      dragKey: 'source',
      dropTarget: null,
      dropKey: null,
      dropTargets: [
        { target: target1, config },
        { target: target2, config }
      ],
      currentTargets: [],
      start: { x: 200, y: 150 },
      end: { x: 200, y: 150 }
    });

    dispatch();

    expect(config.canDrop).toHaveBeenCalled();
    expect(config.canDrop.calls.count()).toBe(2);

    expect(config.canDrop.calls.first()).toEqual({
      object: target1.component,
      args: [ source, 'source' ]
    });

    expect(config.canDrop.calls.mostRecent()).toEqual({
      object: target2.component,
      args: [ source, 'source' ]
    });
  });

  it('dispatches the set DROP_TARGETS action when the drag source changes', function () {
    const source = TestUtils.renderIntoDocument(<Component name="source" />),
          target1 = TestUtils.renderIntoDocument(<Component name="target1" />),
          target2 = TestUtils.renderIntoDocument(<Component name="target2" />);

    const targets = [
      { target: target1, config: { canDrop: () => false }},
      { target: target2, config: { canDrop: () => true }}
    ];

    spyOn(store, 'dispatch').and.callThrough();
    spyOn(store, 'getState').and.returnValue({
      dragSource: source,
      dragKey: 'source',
      dropTarget: null,
      dropKey: null,
      dropTargets: targets,
      currentTargets: [],
      start: { x: 200, y: 150 },
      end: { x: 200, y: 150 }
    });

    dispatch();

    expect(store.dispatch).toHaveBeenCalledWith({
      type: Constants.ACTIONS.DRAG_DROP.DROP_TARGETS,
      targets: [ targets[1] ]
    });
  });

  describe('when there is no drag source', function () {
    var div;

    beforeEach(function () {
      div = TestUtils.findRenderedDOMComponentWithClass(container, 'test-container');

      spyOn(store, 'dispatch');
      spyOn(store, 'getState').and.returnValue({
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

    it('does not dispatch an action on mouse leave', function () {
      TestUtils.Simulate.mouseLeave(div, {});

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on mouse up', function () {
      TestUtils.Simulate.mouseUp(div, {});

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on mouse move', function () {
      TestUtils.Simulate.mouseMove(div, {
        clientX: 300,
        clientY: 450
      });

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on touch cancel', function () {
      TestUtils.Simulate.touchCancel(div, {});

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on touch end', function () {
      TestUtils.Simulate.touchEnd(div, {});

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch an action on touch move', function () {
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
    var source, target, config,
        div, targetDiv;

    beforeEach(function () {
      source = TestUtils.renderIntoDocument(<Component name="source" />);
      target = TestUtils.renderIntoDocument(<Component name="target" />);

      div = TestUtils.findRenderedDOMComponentWithClass(container, 'test-container');
      targetDiv = TestUtils.findRenderedDOMComponentWithTag(target, 'div');

      target.component = targetDiv;
      target.targets = [{ element: targetDiv, key: 'target' }];
      config = jasmine.createSpyObj([ 'canDrop', 'drop' ]);

      spyOn(store, 'dispatch');
      spyOn(store, 'getState').and.returnValue({
        dragSource: source,
        dragKey: 'source',
        dropTarget: { target, config },
        dropKey: 'target',
        dropTargets: [{ target, config }],
        currentTargets: [{ target, config }],
        start: { x: 100, y: 100 },
        end: { x: 250, y: 350 }
      });
    });

    it('dispatches the DRAG_CANCEL action on mouse leave', function () {
      TestUtils.Simulate.mouseLeave(div, {});

      expect(store.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL
      });
    });

    it('dispatches the DRAG_END action on mouse up', function () {
      TestUtils.Simulate.mouseUp(div, {});

      expect(store.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_END
      });
    });

    it('calls "config.drop" on drop target with arguments on mouse up', function () {
      TestUtils.Simulate.mouseUp(div, {});

      expect(config.drop).toHaveBeenCalled();
      expect(config.drop.calls.first()).toEqual({
        object: targetDiv,
        args: [ source, 'source', 'target' ]
      });
    });

    describe('on mouse move', function () {
      beforeEach(function () {
        spyOn(targetDiv, 'getBoundingClientRect').and.returnValue({
          left: 250,
          right: 350,
          top: 400,
          bottom: 500,
          x: 250,
          y: 400,
          width: 100,
          height: 100
        });
      });

      it('dispatches the DRAG_MOVE action with drop target and key', function () {
        TestUtils.Simulate.mouseMove(div, {
          clientX: 300,
          clientY: 450
        });

        expect(store.dispatch).toHaveBeenCalledWith({
          type: Constants.ACTIONS.DRAG_DROP.DRAG_MOVE,
          target: { target, config },
          key: 'target',
          x: 300,
          y: 450
        });
      });

      it('dispatches the DRAG_MOVE action without drop target and key', function () {
        TestUtils.Simulate.mouseMove(div, {
          clientX: 200,
          clientY: 450
        });

        expect(store.dispatch).toHaveBeenCalledWith({
          type: Constants.ACTIONS.DRAG_DROP.DRAG_MOVE,
          target: null,
          key: null,
          x: 200,
          y: 450
        });
      });
    });

    it('dispatches the DRAG_CANCEL action on touch cancel', function () {
      TestUtils.Simulate.touchCancel(div, {});

      expect(store.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL
      });
    });

    it('dispatches the DRAG_END action on touch end', function () {
      TestUtils.Simulate.touchEnd(div, {});

      expect(store.dispatch).toHaveBeenCalledWith({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_END
      });
    });

    it('calls "config.drop" on drop target with arguments on touch end', function () {
      TestUtils.Simulate.touchEnd(div, {});

      expect(config.drop).toHaveBeenCalled();
      expect(config.drop.calls.first()).toEqual({
        object: targetDiv,
        args: [ source, 'source', 'target' ]
      });
    });

    describe('on touch move', function () {
      beforeEach(function () {
        spyOn(targetDiv, 'getBoundingClientRect').and.returnValue({
          left: 250,
          right: 350,
          top: 400,
          bottom: 500,
          x: 250,
          y: 400,
          width: 100,
          height: 100
        });
      });

      it('dispatches the DRAG_MOVE action with drop target and key', function () {
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
          target: { target, config },
          key: 'target',
          x: 300,
          y: 450
        });
      });

      it('dispatches the DRAG_MOVE action without drop target and key', function () {
        TestUtils.Simulate.touchMove(div, {
          touches: {
            item: function () {
              return {
                clientX: 200,
                clientY: 450
              };
            }
          }
        });

        expect(store.dispatch).toHaveBeenCalledWith({
          type: Constants.ACTIONS.DRAG_DROP.DRAG_MOVE,
          target: null,
          key: null,
          x: 200,
          y: 450
        });
      });
    });
  });
});
