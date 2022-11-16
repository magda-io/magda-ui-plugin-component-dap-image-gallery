const cacheHash: {
    [key: string]: any;
} = {};

async function requestJson<T = any>(
    url: string,
    init?: RequestInit,
    cache: boolean = false
): Promise<T> {
    if (cache) {
        if (cacheHash[url]) {
            return cacheHash[url];
        }
    }
    const res = await fetch(url, {
        headers: {
            "Content-type": `application/json`
        }
    });
    if (!res.ok) {
        throw new Error(
            `Request to ${url} failed. Status code: ${res.status} ${res.statusText}`
        );
    }
    const data = (await res.json()) as T;
    if (cache) {
        cacheHash[url] = data;
    }
    return data;
}

export default requestJson;
