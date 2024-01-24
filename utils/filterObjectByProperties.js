export function filterObjectByProperties(object, properties) {
    const filteredObject = {};
    for (const property of properties) {
      if (object.hasOwnProperty(property)) {
        filteredObject[property] = object[property];
      }
    }
    return filteredObject;
  }