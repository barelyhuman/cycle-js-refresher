export const clsx = (...classLists) => {
  const resultObject = {};
  classLists.forEach((classList) => {
    if (typeof classList !== "string") {
      Object.assign(resultObject, classList);
      return;
    }
    const result = Object.fromEntries(
      classList.split(/\s+/).map((k) => {
        return [k, true];
      })
    );
    Object.assign(resultObject, result);
  });
  return resultObject;
};
