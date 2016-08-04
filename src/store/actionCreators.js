import Constants from '../constants/constants';

export let dragCancelAction = () => ({
  type: Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL
});

export let dragEndAction = () => ({
  type: Constants.ACTIONS.DRAG_DROP.DRAG_END
});

export let dragMoveAction = (x, y) => ({
  type: Constants.ACTIONS.DRAG_DROP.DRAG_MOVE,
  x,
  y
});

export let dragStartAction = (source, key, x, y) => ({
  type: Constants.ACTIONS.DRAG_DROP.DRAG_START,
  source,
  key,
  x,
  y
});
