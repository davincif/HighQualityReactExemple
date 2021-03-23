/**
 * The visual feedbacks (animations) available.
 */
export enum VisualFeedBack {
  NONE = 0,
  DENY,
  ACTION_ACC,
  SELECT,
}

/**
 * Represents which item will receive an animation update.
 */
export type SelectionData = {
  [name: string]: { selected: boolean; feedback: VisualFeedBack };
};
