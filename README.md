# flexible-dnd
### A lightweight React drag-and-drop library

flexible-dnd is a lightweight drag-and-drop library for React components. Some inspiration is drawn from Dan Abramov's [react-dnd](https://github.com/gaearon/react-dnd). The most major departures from the react-dnd approach include:

* No configurable backend or HTML5 drag-and-drop; touch-enabled custom drag-handling only
* Drag hint rendering left entirely to the consumer

These departures are made largely in order to create a lightweight and flexible implementation that is capable of rendering a wider variety of drag-and-drop behaviors. Specifically, the library was created to give the author the ability to enable drag-and-drop of SVG elements, including specialized SVG rendering situations, such as dragging only one endpoint of a line.

## DragDropContext

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

## DragSource

Apply the `DragSource` composable to any components that will render draggable elements. The function `connectDragSource` will be available on `props`, and should be applied to any elements that should be draggable.

You must handle rendering dragged elements yourself. If a `DragSource` currently has a dragged element, `props.isDragging` will be `true`. Mouse movement that has occurred is available via `props.dragDeltaX` and `props.dragDeltaY`.

```
import React from 'react';
import { DragSource } from 'flexible-dnd';

class DraggableComponent extends React.Component {
  render() {
    var x = 20,
        y = 20,
        style;

    const { connectDragSource } = this.props;

    if (this.props.isDragging) {
      x += this.props.dragDeltaX;
      y += this.props.dragDeltaY;
    }

    style = {
      position: 'absolute',
      left: x,
      top: y,
      width: 20,
      height: 20,
      backgroundColor: 'blue'
    };

    return connectDragSource(<div key="source" style={style} />);
  }
}

DraggableComponent = DragSource(DraggableComponent);
```

If the DragSource component contains multiple draggable elements, you can apply the `key` property to those elements, and the value corresponding to the dragged element will be passed down as `props.dragKey`.

## DropTarget

Apply the `DropTarget` composable to any components that will render elements that can receive draggable elements. The function `connectDropTarget` will be available on `props`, and should be applied to any elements that should be capable of receiving draggables.

When the mouse is above a drop target during a drag operation, `props.isHovering` will be `true`.

The `DropTarget` composable takes as a second parameter a configuration object. This object must define two functions, `canDrop` and `drop`. Each function is called with the original component instance as `this` and is passed the dragged component instance and `dragKey`. The `drop` function additionally receives a `dropKey` parameter.

```
import React from 'react';
import { DropTarget } from 'flexible-dnd';

class DroppableComponent extends React.Component {
  render() {
    var style = {
      position: 'absolute',
      left: 50,
      top: 50,
      width: 20,
      height: 20,
      backgroundColor: 'green'
    };;

    const { connectDropTarget } = this.props;
    const { dropped } = this.state;

    if (this.props.isHovering) {
      style.borderColor = 'red';
      style.borderStyle = 'solid';
      style.borderWidth = 2;
    }

    if (dropped) {
      style.backgroundColor = 'orange';
    }

    return connectDropTarget(<div key="target" style={style} />);
  }
}

function canDrop(source, dragKey) {
  return source.displayName === 'Draggable';
}

function drop(source, dragKey, dropKey) {
  this.setState({
    dropped: true
  });
}

DroppableComponent = DropTarget(DroppableComponent, {
  canDrop,
  drop
});
```

If the DropTarget component contains multiple elements capable of receiving a draggable, you can apply the `key` property to those elements, and the value corresponding to the element being hovered over will be passed down as `props.dropKey`.

## Examples

Example usage can be found in the example folder. Run `gulp example` to build the example files.
