import React from 'react';

import DragDropStore from '../store/dragDropStore';
import Constants from '../constants/constants';

export default function DragDropContext(Component) {
  class dragDropContext extends React.Component {
    constructor() {
      super();

      this.connect = this.connect.bind(this);
      this.dragCancel = this.dragCancel.bind(this);
      this.dragEnd = this.dragEnd.bind(this);
      this.dragMove = this.dragMove.bind(this);

      this.state = DragDropStore.getState();
      DragDropStore.subscribe(() => {
        this.setState(DragDropStore.getState());
      });
    }

    getChildContext() {
      var start = this.state.start,
          end = this.state.end;

      return {
        __dragDropContext: {
          dragSource: this.state.dragSource,
          dragDelta: {
            x: end.x - start.x,
            y: end.y - start.y
          }
        }
      };
    }

    connect(node) {
      var props = Object.assign({}, node.props, {
        onMouseLeave: this.dragCancel,
        onMouseMove: this.dragMove,
        onMouseUp: this.dragEnd,
        onTouchCancel: this.dragCancel,
        onTouchEnd: this.dragEnd,
        onTouchMove: this.dragMove
      });
      
      return React.cloneElement(node, props, node.props.children);
    }

    dragCancel(e) {
      if (this.state.dragSource) {
        DragDropStore.dispatch({
          type: Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL
        });
      }
    }

    dragEnd(e) {
      if (this.state.dragSource) {
        DragDropStore.dispatch({
          type: Constants.ACTIONS.DRAG_DROP.DRAG_END
        });
      }
    }

    dragMove(e) {
      var x, y,
          touch;

      if (this.state.dragSource) {
        if (e.touches) {
          touch = e.touches.item(0);
          x = touch.clientX;
          y = touch.clientY;
        } else {
          x = e.clientX;
          y = e.clientY;
        }

        DragDropStore.dispatch({
          type: Constants.ACTIONS.DRAG_DROP.DRAG_MOVE,
          x,
          y
        });
      }
    }
    
    render() {
      return <Component {...this.props} connectDragDropContext={this.connect} />;
    }
  }
  
  Object.assign(dragDropContext, {
    childContextTypes: {
      __dragDropContext: React.PropTypes.object.isRequired
    },
    displayName: `DragDropContext(${Component.displayName || 'Component'})`
  });

  return dragDropContext;
};
