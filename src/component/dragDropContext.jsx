import React from 'react';
import { createStore } from 'redux';

import dragDropReducer from '../store/dragDropReducer';
import Constants from '../constants/constants';

export default function DragDropContext(Component) {
  class dragDropContext extends React.Component {
    constructor() {
      super();

      this.connect = this.connect.bind(this);
      this.dragCancel = this.dragCancel.bind(this);
      this.dragEnd = this.dragEnd.bind(this);
      this.dragMove = this.dragMove.bind(this);

      this.store = createStore(dragDropReducer);
    }

    getChildContext() {
      return {
        __dragDropStore: this.store
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
      var store = this.store,
          state = store.getState();

      if (state.dragSource) {
        store.dispatch({
          type: Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL
        });
      }
    }

    dragEnd(e) {
      var store = this.store,
          state = store.getState();

      if (state.dragSource) {
        store.dispatch({
          type: Constants.ACTIONS.DRAG_DROP.DRAG_END
        });
      }
    }

    dragMove(e) {
      var store = this.store,
          state = store.getState(),
          x, y,
          touch;

      if (state.dragSource) {
        if (e.touches) {
          touch = e.touches.item(0);
          x = touch.clientX;
          y = touch.clientY;
        } else {
          x = e.clientX;
          y = e.clientY;
        }

        store.dispatch({
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
      __dragDropStore: React.PropTypes.object.isRequired
    },
    displayName: `DragDropContext(${Component.displayName || 'Component'})`
  });

  return dragDropContext;
};
