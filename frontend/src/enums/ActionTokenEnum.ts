export const ACTION_TOKEN_TYPE = {
    ACTIVATE: "activate",
    RECOVERY: "recovery",
} as const;
export type ActionTokenType = typeof ACTION_TOKEN_TYPE[keyof typeof ACTION_TOKEN_TYPE]; 