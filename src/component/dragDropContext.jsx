import React from 'react';
import { createStore } from 'redux';

import dragDropReducer from '../store/dragDropReducer';
import {
  dragCancelAction,
  dragEndAction,
  dragMoveAction,
  setDropTargets
} from '../store/actionCreators';

export default function DragDropContext(Component) {
  class dragDropContext extends React.Component {
    constructor() {
      var store, dragSource;

      super();

      this.connect = this.connect.bind(this);
      this.dragCancel = this.dragCancel.bind(this);
      this.dragEnd = this.dragEnd.bind(this);
      this.dragMove = this.dragMove.bind(this);

      this.store = store = createStore(dragDropReducer);
      this.unsubscribe = store.subscribe(() => {
        var state = store.getState();

        if (dragSource !== state.dragSource) {
          dragSource = state.dragSource;

          if (dragSource) {
            store.dispatch(setDropTargets(state.dropTargets
              .filter((t) => {
                return t.config.canDrop.call(t.target.component, dragSource, state.dragKey);
              })));
          }
        }
      });

      dragSource = store.getState().dragSource;
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    getChildContext() {
      return {
        __dragDropStore: this.store
      };
    }

    connect(node) {
      var props;

      if (typeof node.type !== 'string') {
        throw new Error('DragDropContext node must be a ReactDOMComponent');
      }

      props = Object.assign({}, node.props, {
        onMouseLeave: this.dragCancel,
        onMouseMove: this.dragMove,
        onMouseUp: this.dragEnd,
        onTouchCancel: this.dragCancel,
        onTouchEnd: this.dragEnd,
        onTouchMove: this.dragMove
      });

      return React.cloneElement(node, props, node.props.children);
    }

    dragCancel() {
      var store = this.store,
          state = store.getState();

      if (state.dragSource) {
        store.dispatch(dragCancelAction());
      }
    }

    dragEnd() {
      var store = this.store,
          state = store.getState(),
          source = state.dragSource,
          dropTarget;

      if (source) {
        dropTarget = state.dropTarget;
        if (dropTarget) {
          dropTarget.config.drop.call(dropTarget.target.component,
                                      source, state.dragKey, state.dropKey);
        }

        store.dispatch(dragEndAction());
      }
    }

    dragMove(e) {
      var store = this.store,
          state = store.getState(),
          target = null, key = null,
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

        state.currentTargets.forEach((t) => {
          t.target.targets.forEach((tt) => {
            let rect = tt.element.getBoundingClientRect();

            if (rect.left < x && rect.right > x &&
                rect.top < y && rect.bottom > y) {
              target = t;
              key = tt.key;
            }
          });
        });

        store.dispatch(dragMoveAction(target, key, x, y));
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
}
