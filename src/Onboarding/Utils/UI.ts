export function isURL(value: string): boolean {
    if (typeof value !== 'string') {
        return false;
    }
    return value.startsWith("http");
}

export function mustOpenInNewTab(url: string): boolean {
    return url.includes("atlassian");
}