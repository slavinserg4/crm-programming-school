export const COURSE = {
    FS: "FS",
    QACX: "QACX",
    JCX: "JCX",
    JSCX: "JSCX",
    FE: "FE",
    PCX: "PCX",
} as const;
export type Course = typeof COURSE[keyof typeof COURSE];