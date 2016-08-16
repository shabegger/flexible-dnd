jest.unmock('../../lib/index');
jest.unmock('../../lib/component/dropTarget');

import React from 'react';

const { DropTarget } = require('../../lib/index');

export class Droppable extends React.Component {
  render() {
    const { connectDropTarget } = this.props;

    return connectDropTarget(<div key="dropTest" />);
  }
}

function canDrop() {
  return true;
}

function drop() {
  return;
}

export let config = {
  canDrop,
  drop
};

export let DropTargetDroppable = DropTarget(Droppable, config);
