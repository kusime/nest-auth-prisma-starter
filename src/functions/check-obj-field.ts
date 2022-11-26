export default (obj: object, required: string[]): boolean => {
  const compareArrays = (a: string[], b: string[]) =>
    a.length === b.length && a.every((element, index) => element === b[index]);

  const objKeys = Object.keys(obj);
  return compareArrays(objKeys, required);
};
