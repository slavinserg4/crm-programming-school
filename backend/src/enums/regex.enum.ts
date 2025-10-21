export const RegexEnum = {
    PASSWORD: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\s:])(\S){8,16}$/,
    NAME: /^[A-Z][a-z]{1,9}$/,
    SERVICE_NAME: /^[A-Z][a-z]+$/,
    CLINIC_NAME: /^(?:[A-Z][a-z]*\s*)+$/,
    PHONE: /^380\d{9}$/,
    PHONE_CLEANER: /[\s()+-]/g,
};
