jest.unmock('./fixtures/component');
jest.unmock('./fixtures/droppable');
jest.unmock('../lib/store/actionCreators');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import stubContext from 'react-stub-context';
import { createStore } from 'redux';

import Component from './fixtures/component';
import { Droppable, DropTargetDroppable, config } from './fixtures/droppable';

const Constants = require('../lib/constants/constants.json');

var root, targetDroppable, droppable, store, dispatch;

describe('The DropTarget composable', function () {
  beforeEach(function () {
    var Root;

    store = createStore(() => {});
    spyOn(store, 'dispatch').and.callThrough();
    dispatch = () => {
      store.dispatch({ type: 'TEST' });
    };

    Root = stubContext(DropTargetDroppable, { __dragDropStore: store });

    root = TestUtils.renderIntoDocument(<Root />);
    targetDroppable = TestUtils.findRenderedComponentWithType(root, DropTargetDroppable);
    droppable = TestUtils.findRenderedComponentWithType(targetDroppable, Droppable);
  });

  it('provides the "connectDropTarget" function', function () {
    expect(droppable.props.connectDropTarget).toEqual(jasmine.any(Function));
  });

  it('only accepts a DOM element in "connectDropTarget"', function () {
    var thrown = false;

    try {
      droppable.props.connectDropTarget(<div />);
    } catch (ex) {
      thrown = true;
    }

    expect(thrown).toBe(false);

    try {
      droppable.props.connectDropTarget(<Component />);
    } catch (ex) {
      thrown = true;
    }

    expect(thrown).toBe(true);
  });

  it('provides an (initially false) "isHovering" property', function () {
    expect(droppable.props.isHovering).toBe(false);
  });

  it('provides hover props when it is the current dropTarget', function () {
    spyOn(store, 'getState').and.returnValue({
      dropTarget: { target: targetDroppable, config: {} },
      dropKey: 'dropTest'
    });

    dispatch();

    expect(droppable.props).toEqual(jasmine.objectContaining({
      isHovering: true,
      dropKey: 'dropTest'
    }));
  });

  it('does not provide hover props when it is not the current dropTarget', function () {
    spyOn(store, 'getState').and.returnValue({
      dropTarget: { target: TestUtils.renderIntoDocument(<Component />), config: {} },
      dropKey: 'dropTest'
    });

    dispatch();

    expect(droppable.props.isHovering).toBe(false);
    expect(droppable.props.dropKey).toBeUndefined();
  });

  it('re-renders when it is the current dropTarget', function () {
    spyOn(targetDroppable, 'render').and.callThrough();
    spyOn(store, 'getState').and.returnValue({
      dropTarget: { target: targetDroppable, config: {} },
      dropKey: 'dropTest'
    });

    dispatch();

    expect(targetDroppable.render).toHaveBeenCalled();
  });

  it('re-renders when it stops being the current dropTarget', function () {
    spyOn(targetDroppable, 'render').and.callThrough();
    spyOn(store, 'getState').and.returnValue({
      dropTarget: null,
      dropKey: null
    });

    targetDroppable.state.isHovering = true;
    dispatch();

    expect(targetDroppable.render).toHaveBeenCalled();
  });

  it('does not re-render when it is not the current dropTarget', function () {
    spyOn(targetDroppable, 'render').and.callThrough();
    spyOn(store, 'getState').and.returnValue({
      dropTarget: { target: TestUtils.renderIntoDocument(<Component />), config: {} },
      dropKey: 'dropTest'
    });

    dispatch();

    expect(targetDroppable.render).not.toHaveBeenCalled();
  });

  it('registers itself upon mounting', function () {
    expect(store.dispatch).toHaveBeenCalledWith({
      type: Constants.ACTIONS.REGISTER.DROP_TARGET,
      target: targetDroppable,
      config: config
    });
  });

  it('unregisters itself upon unmounting', function () {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(targetDroppable).parentNode);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: Constants.ACTIONS.UNREGISTER.DROP_TARGET,
      target: targetDroppable
    });
  });

  it('provides the wrapped component instance', function () {
    expect(targetDroppable.component).toBe(droppable);
  });

  it('provides an array of target DOM elements', function () {
    const div = TestUtils.findRenderedDOMComponentWithTag(droppable, 'div');

    expect(targetDroppable.targets).toEqual([{ element: div, key: 'dropTest' }]);
  });
});
