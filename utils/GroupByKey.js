/**
 * Funcion que agrupa un array de objetos por una propiedad
 */
export function GroupByKey(array, key) {
    return array.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }