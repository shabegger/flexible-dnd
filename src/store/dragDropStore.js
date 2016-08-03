import { createStore } from 'redux';

import Constants from '../constants/constants';

const initState = {
  dragSource: null,
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 }
};

export function dragDropReducer(state = initState, action = {}) {
  switch (action.type) {
    case Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL:
    case Constants.ACTIONS.DRAG_DROP.DRAG_END:
      return initState;
    case Constants.ACTIONS.DRAG_DROP.DRAG_MOVE:
      return {
        dragSource: state.dragSource,
        start: state.start,
        end: { x: action.x, y: action.y }
      };
    case Constants.ACTIONS.DRAG_DROP.DRAG_START:
      return {
        dragSource: action.source,
        start: { x: action.x, y: action.y },
        end: { x: action.x, y: action. y }
      };
    default:
      return state;
  }
};

export default createStore(dragDropReducer);
