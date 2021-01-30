type Callback<T> = (err: Error, result: T) => void;

type MyRedis = {
  get(s: string, cb: Callback<string | number>): boolean;
  set(t: boolean, s: string, v: boolean, cb: Callback<'Ok'>): boolean;
  foo: string;
};

type AnyFunction = (...args: any) => any;

type Head<T extends any[]> = T extends [...infer U, any] ? U : any[];

type UnpackedCallback<T> = T extends (err: Error, result: infer R) => any
  ? R
  : never;
type Last<T extends any[]> = T extends [any, infer R]
  ? UnpackedCallback<R>
  : never;
type LastParameter<T extends (...args: any) => any> = Last<Parameters<T>>;

// type RedisAsync<T> = {
//   [Property in keyof T as T[Property & string] extends AnyFunction ?
//     `${Property & string}Async` : never]:
//        (args: Omit<T[Property], 'cb?'>) => Promise<ReturnType<T[Property]>>

// }

// type RedisAsync2<T> = {
//   [Property in keyof T as T[Property & string] extends Function ?
//     `${Property & string}Async` : never]:
//        (...args: Parameters<T[Property]>) => Promise<ReturnType<T[Property]>>
// }

// type RedisAsync3<T> = {
//   [K in keyof T]: T[K]
// }

type Asyncify<T> = {
  [K in keyof T as `${K & string}Async`]: T[K] extends (...args: any) => any
    ? (...args: Head<Parameters<T[K]>>) => Promise<LastParameter<T[K]>>
    : never;
};

// Step through
// type AsyncifyType = {
//   [K in keyof MyRedis & string as MyRedis[K] extends AnyFunction ?
//     `${K}Async` : never]: (args: Parameters<MyRedis[K]> ) => boolean //T[K]
// }

// type AsyncifyType = {
//   [K in ['get'|'set'|'foo'] as MyRedis[K] extends AnyFunction ?
//     `${K}Async` : never]: (args: Parameters<MyRedis[K]> ) => boolean //T[K]
// }

//////

type MyRedisAsync = Asyncify<MyRedis>;

const foo = {} as MyRedisAsync;
foo.getAsync('foo');

// type Generated = RedisAsync3<redis.RedisClient>;

// let redisClient = redis.createClient()

// let asyncRedisClient = <unknown>bluebird.promisifyAll(redisClient) as Generated;
// asyncRedisClient.get("foo");
