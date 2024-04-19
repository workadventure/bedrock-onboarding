export function isURL(value: string) {
    if (typeof value !== 'string') {
        return false;
    }
    return value.startsWith("http");
}