//----------------------------------------------------------------------------------------------------------------------
// console
//----------------------------------------------------------------------------------------------------------------------

declare interface Console {
    assert: (condition?: boolean | undefined, ...data: any[]) => void;
    clear: () => void;
    count: (label?: string) => void;
    countReset: (label?: string) => void;
    group: (...label: any[]) => void;
    groupCollapsed: (...label: any[]) => void;
    groupEnd: () => void;
    debug: (...data: any[]) => void;
    error: (...data: any[]) => void;
    info: (...data: any[]) => void;
    trace: (...data: any[]) => void;
    warn: (...data: any[]) => void;
    log: (...data: any[]) => void;
    table: (tabularData?: any, properties?: string[] | undefined) => void;
    time: (label?: string) => void;
    timeEnd: (label?: string) => void;
    timeLog: (label?: string, ...data: any[]) => void;
    timeStamp: (label?: string) => void;
}

declare var console: Console;

//----------------------------------------------------------------------------------------------------------------------
// process
//----------------------------------------------------------------------------------------------------------------------

declare var process: {
    argv: string[];
    env: { [index: string]: string | undefined };
    exit: (code?: number) => never;
};

//----------------------------------------------------------------------------------------------------------------------
// timeout
//----------------------------------------------------------------------------------------------------------------------

declare namespace NodeJS {
    namespace launchpad {
        interface Timeout {
            ref(): this;
            unref(): this;
            hasRef(): boolean;
            refresh(): this;
            [Symbol.toPrimitive](): number;
            [Symbol.dispose](): void;
        }
    }
}

declare function setTimeout(callback: (args: void) => void, ms?: number): NodeJS.launchpad.Timeout;
declare function clearTimeout(timeoutId: NodeJS.launchpad.Timeout | string | number | undefined): void;

declare function setInterval(callback: (args: void) => void, ms?: number): NodeJS.launchpad.Timeout;
declare function clearInterval(intervalId: NodeJS.launchpad.Timeout | string | number | undefined): void;

