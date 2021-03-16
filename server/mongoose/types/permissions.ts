export type AccessLevel = "OWNER" | "MANAGER" | "EDITOR" | "GUEST";

// maintain this vector organized in order of power, decrescent.
export const validaccessLevels = ["OWNER", "MANAGER", "EDITOR", "GUEST"];
