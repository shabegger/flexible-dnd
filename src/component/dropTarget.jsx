import React from 'react';

import { registerDropTarget, unregisterDropTarget } from '../store/actionCreators';

export default function DropTarget(Component, config) {
  if (typeof config !== 'object') throw new Error('"config" must be an object');
  if (typeof config.canDrop !== 'function') throw new Error('"config.canDrop" must be a function');
  if (typeof config.drop !== 'function') throw new Error('"config.drop" must be a function');

  class dropTarget extends React.Component {
    constructor() {
      super();

      this.connect = this.connect.bind(this);

      this.state = {
        isHovering: false,
        dropKey: null
      };
    }

    componentDidMount() {
      var store = this.context.__dragDropStore;

      store.dispatch(registerDropTarget(this, config));
      this.unsubscribe = store.subscribe(() => {
        var state = store.getState(),
            isHovering = (this === state.dropTarget);

        if (isHovering) {
          this.setState({
            isHovering,
            dropKey: state.dropKey
          });
        } else if (this.state.isHovering) {
          this.setState({
            isHovering,
            dropKey: null
          });
        }
      });
    }

    componentWillUnmount() {
      var store = this.context.__dragDropStore;

      this.unsubscribe();
      this.targets = null;
      store.dispatch(unregisterDropTarget(this));
    }

    connect(node) {
      var props;

      if (typeof node.type !== 'string') {
        throw new Error('DropTarget node must be a ReactDOMComponent');
      }

      props = Object.assign({}, node.props, {
        ref: (t) => {
          if (!t || !this.targets) {
            return;
          }

          this.targets.push({
            element: t,
            key: node.key
          });
        }
      });

      return React.cloneElement(node, props, node.props.children);
    }

    render() {
      var { isHovering } = this.state,
          props;

      props = {
        connectDropTarget: this.connect,
        isHovering: isHovering
      };

      if (isHovering) {
        props.dropKey = this.state.dropKey;
      }

      this.targets = [];

      return <Component {...this.props} {...props} />;
    }
  }

  Object.assign(dropTarget, {
    contextTypes: {
      __dragDropStore: React.PropTypes.object.isRequired
    },
    displayName: `DragSource(${Component.displayName || 'Component'})`
  });

  return dropTarget;
}
