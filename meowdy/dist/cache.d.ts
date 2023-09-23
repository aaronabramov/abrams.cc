export default class Cache<K, T> {
    __cache: Map<K, T>;
    constructor();
    getOrInsert(key: K, insertWith: (key: K) => T): T;
}
