export const RegexConstants = {
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    NAME: /^[a-zA-Zа-яА-ЯіІїЇєЄ]{2,20}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};