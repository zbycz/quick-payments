// @flow

/**
 * Get a value from an object based on the given path
 *
 * Usage example:
 *
 *   var obj = {
 *     a : {
 *       b : 123
 *     }
 *   };
 *
 *   var result = getByPath(obj, ['a', 'b']); // 123
 *
 * If the path doesn't exist undefined will be returned:
 *
 *   var result = getByPath(obj, ['x', 'y', 'z']); // undefined
 *
 * It also supports numeric indexes to access nested arrays. It's also possible
 * to get all values from the nested array using "*" instead of specific number.
 */
export default function getByPath(
  root: Object | $ReadOnlyArray<any>,
  path: $ReadOnlyArray<string | number>,
  fallbackValue?: any,
): any {
  const wildcardArray = [];
  let current = root;

  for (let i = 0; i < path.length; i++) {
    const segment = path[i];

    if (segment === '*') {
      current.forEach((c, index) => {
        wildcardArray[index] = getByPath(c, path.slice(i + 1));
      });
      break;
    }

    // $FlowExpectedError: segment could be a string which is not allowed as a key of array
    if (current && current[segment] !== undefined) {
      current = current[segment];
    } else {
      return fallbackValue;
    }
  }
  return wildcardArray.length > 0 ? wildcardArray : current;
}

/**
 * a.b
 * a.b[2].c
 * a[*].b.c
 * a[*].b.c[*].d.e
 *
 * See tests...
 */
export function getByStringPath(
  root: Object | $ReadOnlyArray<any>,
  path: string,
  fallbackValue?: any,
) {
  const pathChunks = path
    .replace(/\[(.+?)]/g, '.$1')
    .split('.')
    .filter(value => value !== '');

  return getByPath(root, pathChunks, fallbackValue);
}

// TODO: helper "isGraphQLError"
//
// {
//   "errors": [
//     {
//       "message": "My lovely error message for developers to fix it...",
//       "locations": [{ "line": 4, "column": 5 }],
//       "path": [
//         "currency",
//         "format"
//       ]
//     }
//   ],
//   "data": {
//     "currency": {
//       "code": "usd",
//       "format": null    // error? value?
//     }
//   }
// }
