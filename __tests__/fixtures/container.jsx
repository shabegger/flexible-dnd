jest.unmock('../../lib/component/dragDropContext');
jest.unmock('../../lib/store/dragDropStore');

import React from 'react';

const DragDropContext = require('../../lib/component/dragDropContext').default;

class ChildComponent extends React.Component {
  render() {
    return <div />;
  }
}

Object.assign(ChildComponent, {
  contextTypes: {
    __dragDropContext: React.PropTypes.object.isRequired
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
