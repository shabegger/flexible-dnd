# flexible-dnd
### A lightweight React drag-and-drop library

**This library is currently in early beta. Some functionality may not yet be implemented.**

flexible-dnd is a lightweight drag-and-drop library for React components. Some inspiration is drawn from Dan Abramov's [react-dnd](https://github.com/gaearon/react-dnd). The most major departures from the react-dnd approach include:

* No configurable backend or HTML5 drag-and-drop; touch-enabled custom drag-handling only
* Drag hint rendering left entirely to the consumer

These departures are made largely in order to create a lightweight and flexible implementation that is capable of rendering a wider variety of drag-and-drop behaviors. Specifically, the library was created to give the author the ability to enable drag-and-drop of SVG elements, including specialized SVG rendering situations, such as dragging only one endpoint of a line.

### Use

flexible-dnd tracks movement and drops in the context of a container component. Begin by applying the `DragDropContext` composable to your container element. The function `connectDragDropContext` will become available to your container via `props`. Apply this function to the element which you want to use to track dragging.

```
import React from 'react';
import { DragDropContext } from 'flexible-dnd';

class App extends React.Component {
  render() {
    const { connectDragDropContext } = this.props;

    return connectDragDropContext(
      <div>
        <DraggableComponent />
      </div>
    );
  }
}

App = DragDropContext(App);
```

Apply the `DragSource` composable to any components that will render draggable elements. The function `connectDragSource` will be available on `props`, and should be applied to any elements that should be draggable.

You must handle rendering dragged elements yourself. If a `DragSource` currently has a dragged element, `props.isDragging` will be `true`. If the component contains multiple draggable elements, you can apply the `key` property to those elements, and the value corresponding to the dragged element will be passed down as `props.dragKey`. The drag deltas are available via `props.dragDeltaX` and `props.dragDeltaY`.

One way to handle the end of a drag is to check the current and future value of `props.isDragging` within the `componentWillReceiveProps` method. This is a good spot to update the state of your `DragSource`.

```
import React from 'react';
import { DragSource } from 'flexible-dnd';

class DraggableComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      x1: 20,
      y1: 20,
      x2: 20,
      y2: 60
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isDragging && !nextProps.isDragging) {
      if (this.props.dragKey === 'drag1') {
        this.setState({
          x1: this.state.x1 + this.props.dragDeltaX,
          y1: this.state.y1 + this.props.dragDeltaY
        });
      } else {
        this.setState({
          x2: this.state.x2 + this.props.dragDeltaX,
          y2: this.state.y2 + this.props.dragDeltaY
        });
      }
    }
  }

  render() {
    var { x1, y1, x2, y2 } = this.state,
        style1, style2;

    const { connectDragSource } = this.props;

    if (this.props.isDragging) {
      if (this.props.dragKey === 'drag1') {
        x1 += this.props.dragDeltaX;
        y1 += this.props.dragDeltaY;
      } else {
        x2 += this.props.dragDeltaX;
        y2 += this.props.dragDeltaY;
      }
    }

    style1 = {
      position: 'absolute',
      left: x1,
      top: y1,
      width: 20,
      height: 20,
      backgroundColor: 'blue'
    };

    style2 = {
      position: 'absolute',
      left: x2,
      top: y2,
      width: 20,
      height: 20,
      backgroundColor: 'green'
    };

    return (
      <div style="width: 100px; height: 100px; position: relative;">
        {connectDragSource(<div key="drag1" style={style1} />)}
        {connectDragSource(<div key="drag2" style={style2} />)}
      </div>
    );
  }
}

DraggableComponent = DragSource(DraggableComponent);
```

### Examples

Example usage can be found in the example folder. Run `gulp example` to build the example files.
