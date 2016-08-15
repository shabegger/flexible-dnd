import Constants from '../constants/constants';

export let dragCancelAction = () => ({
  type: Constants.ACTIONS.DRAG_DROP.DRAG_CANCEL
});

export let dragEndAction = () => ({
  type: Constants.ACTIONS.DRAG_DROP.DRAG_END
});

export let dragMoveAction = (target, key, x, y) => ({
  type: Constants.ACTIONS.DRAG_DROP.DRAG_MOVE,
  target,
  key,
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

export let setDropTargets = (targets) => ({
  type: Constants.ACTIONS.DRAG_DROP.DROP_TARGETS,
  targets
});

export let registerDropTarget = (target, config) => ({
  type: Constants.ACTIONS.REGISTER.DROP_TARGET,
  target,
  config
});

export let unregisterDropTarget = (target) => ({
  type: Constants.ACTIONS.UNREGISTER.DROP_TARGET,
  target
});
