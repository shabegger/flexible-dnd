import React from 'react';
import ReactDOM from 'react-dom';

import { DragDropContext } from '../../lib/index';

import Line from './line';

class App extends React.Component {
  render() {
    const { connectDragDropContext } = this.props;

    return connectDragDropContext(
      <svg width="300" height="300">
        <Line />
      </svg>
    );
  }
}

App = DragDropContext(App);
ReactDOM.render(<App />, document.getElementById('app-container'));
