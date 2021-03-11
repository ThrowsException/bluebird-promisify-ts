import redis, { RedisClient } from 'redis';
import bluebird from 'bluebird';

type Callback<T> = (err: Error, result: T) => void;

type MyRedis = {
  get(s: string, cb?: Callback<string>): boolean;
  set(t: boolean, s: string, v: boolean, cb: Callback<'Ok'>): boolean;
  foo: string;
};

type AnyFunction = (...args: any) => any;

type Head<T extends any[]> = T extends [...infer U, any] ? U : any[];

type UnpackedCallback<T> = T extends (err: Error, result: infer R) => any
  ? R
  : never;
type Last<T extends any[]> = T extends [...infer _, infer R]
  ? UnpackedCallback<R>
  : never;
type LastParameter<T extends (...args: any) => any> = Last<Parameters<T>>;

type Asyncify<T> = {
  [K in keyof T as T[K] extends Function
    ? `${K & string}Async`
    : never]: T[K] extends (...args: any) => any
    ? (...args: Head<Parameters<T[K]>>) => Promise<LastParameter<T[K]>>
    : never;
};

type AsyncClient = Asyncify<RedisClient>;

const client = redis.createClient();
client.get('foo');

let asyncClient = (<unknown>bluebird.promisifyAll(client)) as AsyncClient;
asyncClient.getAsync('');

type MyRedisAsync = Asyncify<MyRedis>;

const foo = {} as MyRedisAsync;
foo.getAsync('foo');
