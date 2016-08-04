import React from 'react';

import Constants from '../constants/constants';

export default function DragSource(Component) {
  class dragSource extends React.Component {
    constructor() {
      super();

      this.connect = this.connect.bind(this);
      this.dragStart = this.dragStart.bind(this);

      this.state = {
        isDragging: false,
        dragKey: null,
        dragDeltaX: null,
        dragDeltaY: null
      };
    }

    componentDidMount() {
      var store = this.context.__dragDropStore;

      this.unsubscribe = store.subscribe(() => {
        var state = store.getState(),
            isDragging = (this === state.dragSource);

        if (isDragging) {
          this.setState({
            isDragging,
            dragKey: state.dragKey,
            dragDeltaX: state.end.x - state.start.x,
            dragDeltaY: state.end.y - state.start.y
          });
        } else if (this.state.isDragging) {
          this.setState({
            isDragging,
            dragKey: null,
            dragDeltaX: null,
            dragDeltaY: null
          });
        }
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
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

      this.context.__dragDropStore.dispatch({
        type: Constants.ACTIONS.DRAG_DROP.DRAG_START,
        source: this,
        key: node.key,
        x,
        y
      });
    }

    render() {
      var { isDragging } = this.state,
          props;

      props = {
        connectDragSource: this.connect,
        isDragging: isDragging
      };

      if (isDragging) {
        props.dragDeltaX = this.state.dragDeltaX;
        props.dragDeltaY = this.state.dragDeltaY;
        props.dragKey = this.state.dragKey;
      }

      return <Component {...props} {...this.props} />;
    }
  }

  Object.assign(dragSource, {
    contextTypes: {
      __dragDropStore: React.PropTypes.object.isRequired
    },
    displayName: `DragSource(${Component.displayName || 'Component'})`
  });

  return dragSource;
}
