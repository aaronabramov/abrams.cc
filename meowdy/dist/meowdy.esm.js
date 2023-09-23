function median(values) {
  if (values.length === 0) {
    return null;
  }
  var sorted = values.slice().sort(function (a, b) {
    return a - b;
  });
  var middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    // If even number of items, return average of the two middle numbers
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    // If odd number of items, return the middle number
    return sorted[middle];
  }
}

var Cache = /*#__PURE__*/function () {
  function Cache() {
    this.__cache = new Map();
    this.__cache = new Map();
  }
  var _proto = Cache.prototype;
  _proto.getOrInsert = function getOrInsert(key, insertWith) {
    var value = this.__cache.get(key);
    if (value !== undefined) {
      return value;
    }
    var newValue = insertWith(key);
    this.__cache.set(key, newValue);
    return newValue;
  };
  return Cache;
}();

var median$1 = median;

export { Cache, median$1 as median };
//# sourceMappingURL=meowdy.esm.js.map
