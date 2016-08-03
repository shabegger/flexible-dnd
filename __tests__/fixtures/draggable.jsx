jest.unmock('../../lib/component/dragSource');

import React from 'react';

const DragSource = require('../../lib/component/dragSource').default;

export class Draggable extends React.Component {
  render() {
    const { connectDragSource } = this.props;

    return connectDragSource(<div key="dragTest" />);
  }
};

export let DragSourceDraggable = DragSource(Draggable);
