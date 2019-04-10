// SAT specific actions
// separate into activate and deactivate?
// no need if the two are always called together
export const INIT_SESSION = 'INIT_SESSION';
export const NEW_ITEM = 'NEW_ITEM'; // no delete item
export const GO_TO_ITEM = 'GO_TO_ITEM';
export const LOAD_ITEM = 'LOAD_ITEM';
export const UPDATE_ALL = 'UPDATE_ALL';

export const IMAGE_ZOOM = 'IMAGE_ZOOM';

// Item Level
export const NEW_LABEL = 'NEW_LABEL';
export const DELETE_LABEL = 'DELETE_LABEL';
// Image specific actions
export const TAG_IMAGE = 'TAG_IMAGE';

// Label Level
export const CHANGE_ATTRIBUTE = 'CHANGE_ATTRIBUTE';
export const CHANGE_CATEGORY = 'CHANGE_CATEGORY';

// View Level
export const TOGGLE_ASSISTANT_VIEW = 'TOGGLE_ASSISTANT_VIEW';

// Box2D specific
export const NEW_IMAGE_BOX2D_LABEL = 'NEW_IMAGE_BOX2D_LABEL';
export const CHANGE_RECT = 'CHANGE_RECT';

// Point Cloud Specific
export const MOVE_CAMERA = 'MOVE_CAMERA';
export const MOVE_CAMERA_AND_TARGET = 'MOVE_CAMERA_AND_TARGET';
export const NEW_BOX3D_LABEL = 'NEW_BOX3D_LABEL';
export const HIGHLIGHT_BOX = 'HIGHLIGHT_BOX';
export const SELECT_BOX = 'SELECT_BOX';
export const DESELECT_BOX = 'DESELECT_BOX';
export const MOVE_BOX = 'MOVE_BOX';
export const SCALE_BOX = 'SCALE_BOX';
export const ROTATE_BOX = 'ROTATE_BOX';
