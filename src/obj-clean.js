//"use strict";

var isPlainObject = function(x) {
  var prototype;
  return (
    toString.call(x) === "[object Object]" &&
    ((prototype = Object.getPrototypeOf(x)),
    prototype === null || prototype === Object.getPrototypeOf({}))
  );
};

export const clean = function(obj, options) {
  options = Object.assign(
    {
      preserveArrays: true
    },
    options
  );

  return Object.keys(obj).reduce(function(result, key) {
    if (obj[key] === null || obj[key] === undefined) {
      return result;
    }

    if (
      options.preserveArrays === false &&
      Array.isArray(obj[key]) &&
      obj[key].length === 0
    ) {
      return result;
    }

    if (isPlainObject(obj[key])) {
      var res = clean(obj[key], options);

      if (Object.keys(res).length > 0) {
        result[key] = res;
      }
    } else if (obj[key] !== "") {
      result[key] = obj[key];
    }

    return result;
  }, {});
};
