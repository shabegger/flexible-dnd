jest.unmock('../../lib/index');
jest.unmock('../../lib/component/dragSource');

import React from 'react';

const { DragSource } = require('../../lib/index');

export class Draggable extends React.Component {
  render() {
    const { connectDragSource } = this.props;

    return connectDragSource(<div key="dragTest" />);
  }
}

export let DragSourceDraggable = DragSource(Draggable);
