import React from 'react';

import DragDropStore from '../store/dragDropStore';
import Constants from '../constants/constants';

export default function DragSource(Component) {
  class dragSource extends React.Component {
    constructor() {
      super();

      this.state = {
        dragKey: null
      };

      this.connect = this.connect.bind(this);
      this.dragStart = this.dragStart.bind(this);
      this.isDragging = this.isDragging.bind(this);
    }

    connect(node) {
      var handler, props;

      handler = (e) => {
        this.dragStart(node, e);
      };

      props = Object.assign({}, node.props, {
        onMouseDown: handler,
        onTouchStart: handler
      });
      
      return React.cloneElement(node, props, node.props.children);
    }

    dragStart(node, e) {
      var x, y,
          touch;

      if (e.touches) {
        touch = e.touches.item(0);
        x = touch.clientX;
        y = touch.clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }

      this.setState({
        dragKey: node.key
      });

      DragDropStore.dispatch({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_START,
        source: this,
        x,
        y
      });
    }

    isDragging() {
      return this === this.context.__dragDropContext.dragSource;
    }
    
    render() {
      var isDragging = this.isDragging(),
          props, dragDelta;

      props = {
        connectDragSource: this.connect,
        isDragging: isDragging
      };

      if (isDragging) {
        dragDelta = this.context.__dragDropContext.dragDelta;

        props.dragDeltaX = dragDelta ? dragDelta.x : 0;
        props.dragDeltaY = dragDelta ? dragDelta.y : 0;
        props.dragKey = this.state.dragKey;
      }

      return <Component {...props} {...this.props} />;
    }
  }
  
  Object.assign(dragSource, {
    contextTypes: {
      __dragDropContext: React.PropTypes.object.isRequired
    },
    displayName: `DragSource(${Component.displayName || 'Component'})`
  });

  return dragSource;
};
