import Constants from '../constants/constants';

const initState = {
  dragSource: null,
  dragKey: null,
  dropTarget: null,
  dropKey: null,
  dropTargets: [],
  currentTargets: [],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 }
};

function removeTarget(array, target) {
  var result = [],
      i, len, item;

  for (i = 0, len = array.length; i < len; i++) {
    item = array[i];
    if (item.target !== target) {
      result.push(item);
    }
  }

  return result;
}

export default (state = initState, action = {}) => {
  switch (action.type) {
    case Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL:
    case Constants.ACTIONS.DRAG_DROP.DRAG_END:
      return initState;
    case Constants.ACTIONS.DRAG_DROP.DRAG_MOVE:
      return {
        ...state,
        dropTarget: action.target,
        dropKey: action.key,
        end: { x: action.x, y: action.y }
      };
    case Constants.ACTIONS.DRAG_DROP.DRAG_START:
      return {
        ...state,
        dragSource: action.source,
        dragKey: action.key,
        start: { x: action.x, y: action.y },
        end: { x: action.x, y: action. y }
      };
    case Constants.ACTIONS.DRAG_DROP.DROP_TARGETS:
      return {
        ...state,
        currentTargets: action.targets
      };
    case Constants.ACTIONS.REGISTER.DROP_TARGET:
      return {
        ...state,
        dropTargets: [
          ...state.dropTargets,
          {
            target: action.target,
            config: action.config
          }
        ]
      };
    case Constants.ACTIONS.UNREGISTER.DROP_TARGET:
      return {
        ...state,
        dropTargets: removeTarget(state.dropTargets, action.target)
      };
    default:
      return state;
  }
};
