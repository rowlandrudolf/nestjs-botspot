export const whitelistParams = (params: object, allowed: string[]) => {
  const whitelist = Object.keys(params)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {});
  return Object.keys(whitelist).length ? whitelist : null;
};
