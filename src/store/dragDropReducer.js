import Constants from '../constants/constants';

const initState = {
  dragSource: null,
  dragKey: null,
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 }
};

export default (state = initState, action = {}) => {
  switch (action.type) {
    case Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL:
    case Constants.ACTIONS.DRAG_DROP.DRAG_END:
      return initState;
    case Constants.ACTIONS.DRAG_DROP.DRAG_MOVE:
      return {
        dragSource: state.dragSource,
        dragKey: state.dragKey,
        start: state.start,
        end: { x: action.x, y: action.y }
      };
    case Constants.ACTIONS.DRAG_DROP.DRAG_START:
      return {
        dragSource: action.source,
        dragKey: action.key,
        start: { x: action.x, y: action.y },
        end: { x: action.x, y: action. y }
      };
    default:
      return state;
  }
};
