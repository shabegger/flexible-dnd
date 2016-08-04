jest.unmock('../../lib/index');
jest.unmock('../../lib/component/dragDropContext');

import React from 'react';

const { DragDropContext } = require('../../lib/index');

class ChildComponent extends React.Component {
  render() {
    return <div />;
  }
}

Object.assign(ChildComponent, {
  contextTypes: {
    __dragDropStore: React.PropTypes.object.isRequired
  }
});

export let Child = ChildComponent;

export class Container extends React.Component {
  render() {
    const { connectDragDropContext } = this.props;

    return connectDragDropContext(
      <div className="test-container">
        <Child />
      </div>
    );
  }
};

export let DragDropContextContainer = DragDropContext(Container);
