import React from 'react';

import { DragSource, DropTarget } from '../../lib/index';

class Line extends React.Component {
  constructor() {
    super();

    this.state = {
      startX: 20,
      startY: 150,
      endTag: 'middle'
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isDragging && !nextProps.isDragging) {
      if (this.props.dragKey === 'start') {
        this.setState({
          startX: this.state.startX + this.props.dragDeltaX,
          startY: this.state.startY + this.props.dragDeltaY
        });
      }
    }
  }

  render() {
    var { startX, startY, endTag } = this.state,
        strokeTop = 'black',
        strokeMiddle = 'black',
        strokeBottom = 'black',
        endX = 280, endY;

    switch (endTag) {
      case 'top':
        endY = 50;
        break;
      case 'middle':
        endY = 150;
        break;
      case 'bottom':
        endY = 250;
        break;
    }

    const { connectDragSource, connectDropTarget } = this.props;

    if (this.props.isHovering) {
      switch (this.props.dropKey) {
        case 'top':
          strokeTop = 'red';
          break;
        case 'middle':
          strokeMiddle = 'red';
          break;
        case 'bottom':
          strokeBottom = 'red';
          break;
      }
    }

    if (this.props.isDragging) {
      if (this.props.dragKey === 'start') {
        startX += this.props.dragDeltaX;
        startY += this.props.dragDeltaY;
      } else {
        endX += this.props.dragDeltaX;
        endY += this.props.dragDeltaY;
      }
    }

    return (
      <g>
        {connectDropTarget(<circle key="top" cx="280" cy="50" r="15"
                                   stroke={strokeTop} strokeWidth="2" fill="white" />)}
        {connectDropTarget(<circle key="middle" cx="280" cy="150" r="15"
                                   stroke={strokeMiddle} strokeWidth="2" fill="white" />)}
        {connectDropTarget(<circle key="bottom" cx="280" cy="250" r="15"
                                   stroke={strokeBottom} strokeWidth="2" fill="white" />)}

        <line x1={startX} y1={startY}
              x2={endX} y2={endY}
              stroke="black"
              strokeWidth="2" />

        {connectDragSource(<circle key="start" cx={startX} cy={startY} r="10" />)}
        {connectDragSource(<circle key="end" cx={endX} cy={endY} r="10" />)}
      </g>
    );
  }
}

function canDrop(source, dragKey) {
  return dragKey === 'end';
}

function drop(source, dragKey, dropKey) {
  this.setState({
    endTag: dropKey
  });
}

Line = DropTarget(Line, {
  canDrop,
  drop
});
Line = DragSource(Line);

export default Line;
