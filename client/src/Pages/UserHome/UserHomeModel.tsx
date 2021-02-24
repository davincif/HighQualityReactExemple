export enum VisualFeedBack {
  NONE = 0,
  DENY,
  ACTION_ACC,
  SELECT,
}

export type SelectionData = {
  [name: string]: { selected: boolean; feedback: VisualFeedBack };
};
