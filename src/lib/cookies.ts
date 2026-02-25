import type { AxiosResponse } from "axios";

interface Cookie {
    key: string;
    value: string;
}

export class Cookies {
    private cookies: Map<string, string> = new Map();

    constructor(initialCookies: Cookie[] | undefined = undefined) {
        if (initialCookies !== undefined) {
            for (const cookie of initialCookies) {
                this.cookies.set(cookie.key, cookie.value);
            }
        }
    }

    add(key: string, value: string) {
        this.cookies.set(key, value);
    }

    value(): string {
        return this.cookies.entries().map(e => `${e[0]}=${e[1]}`).toArray().join("; ");
    }

    apply<T>(response: AxiosResponse<T>): AxiosResponse<T> {
        if (response.headers["set-cookie"] !== undefined) {
            for (const cookie of response.headers["set-cookie"]) {
                const data = cookie.split("; ", 2)[0].split("=", 2);
                this.cookies.set(data[0], data[1]);
            }
        }
        return response;
    }
}
