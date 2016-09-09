declare var process: NodeJS.Process;

declare namespace NodeJS {
  export interface EventEmitter {
    addListener(event: string, listener: Function): this;
    on(event: string, listener: Function): this;
    once(event: string, listener: Function): this;
    removeListener(event: string, listener: Function): this;
    removeAllListeners(event?: string): this;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    listeners(event: string): Function[];
    emit(event: string, ...args: any[]): boolean;
    listenerCount(type: string): number;
  }

  export interface Events extends EventEmitter { }

  export interface ProcessVersions {
    http_parser: string;
    node: string;
    v8: string;
    ares: string;
    uv: string;
    zlib: string;
    modules: string;
    openssl: string;
  }

  export interface MemoryUsage {
    rss: number;
    heapTotal: number;
    heapUsed: number;
  }

  export interface Domain extends Events {
    run(fn: Function): void;
    add(emitter: Events): void;
    remove(emitter: Events): void;
    bind(cb: (err: Error, data: any) => any): any;
    intercept(cb: (data: any) => any): any;
    dispose(): void;

    addListener(event: string, listener: Function): this;
    on(event: string, listener: Function): this;
    once(event: string, listener: Function): this;
    removeListener(event: string, listener: Function): this;
    removeAllListeners(event?: string): this;
  }

  export interface Process extends EventEmitter {
    argv: string[];
    execArgv: string[];
    execPath: string;
    abort(): void;
    chdir(directory: string): void;
    cwd(): string;
    env: any;
    exit(code?: number): void;
    exitCode: number;
    getgid(): number;
    setgid(id: number): void;
    setgid(id: string): void;
    getuid(): number;
    setuid(id: number): void;
    setuid(id: string): void;
    version: string;
    versions: ProcessVersions;
    config: {
      target_defaults: {
        cflags: any[];
        default_configuration: string;
        defines: string[];
        include_dirs: string[];
        libraries: string[];
      };
      variables: {
        clang: number;
        host_arch: string;
        node_install_npm: boolean;
        node_install_waf: boolean;
        node_prefix: string;
        node_shared_openssl: boolean;
        node_shared_v8: boolean;
        node_shared_zlib: boolean;
        node_use_dtrace: boolean;
        node_use_etw: boolean;
        node_use_openssl: boolean;
        target_arch: string;
        v8_no_strict_aliasing: number;
        v8_use_snapshot: boolean;
        visibility: string;
      };
    };
    kill(pid: number, signal?: string | number): void;
    pid: number;
    title: string;
    arch: string;
    platform: string;
    memoryUsage(): MemoryUsage;
    nextTick(callback: Function): void;
    umask(mask?: number): number;
    uptime(): number;
    hrtime(time?: number[]): number[];
    domain: Domain;

    // Worker
    send?(message: any, sendHandle?: any): void;
    disconnect(): void;
    connected: boolean;
  }
}
