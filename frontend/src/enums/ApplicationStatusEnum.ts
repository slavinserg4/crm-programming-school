export const APPLICATION_STATUS = {
    IN_WORK: "In work",
    NEW: "New",
    AGREE: "Aggre",
    DISAGREE: "Disaggre",
    DUBBING: "Dubbing",
} as const;
export type ApplicationStatus = typeof APPLICATION_STATUS[keyof typeof APPLICATION_STATUS];