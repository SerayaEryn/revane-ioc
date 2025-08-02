export interface CacheData {
  cacheables?: CachableData[];
  cacheEvict?: CachableData[];
  cachePut?: CachableData[];
  cacheEvictAll?: string[];
}

export interface CachableData {
  cacheName: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  keyGen: Function;
}
