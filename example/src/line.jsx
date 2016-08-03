import React from 'react';

import { DragSource } from '../../lib/index';

class Line extends React.Component {
  render() {
    var startX = 20,
        startY = 150,
        endX = 280,
        endY = 150;

    const { connectDragSource } = this.props;

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
        <line x1={startX} y1={startY}
              x2={endX} y2={endY}
              stroke="black"
              strokeWidth="2" />
        {connectDragSource(<circle key="start" cx={startX} cy={startY} r="10"/>)}
        {connectDragSource(<circle key="end" cx={endX} cy={endY} r="10"/>)}
      </g>
    );
  }
}

Line = DragSource(Line);
export default Line;
