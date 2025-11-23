export const retriveSessionStorage = <T>(key: string) => {
    const object = sessionStorage.getItem(key) || '';
    if (!object) {
        return {} as T
    }
    const parse = JSON.parse(object);
    return parse as T;
}