export const collectIdsandDocs = doc => {
  console.log("new doc iteration", doc.id);
  return { id: doc.id, ...doc.data() };
};

export const arrayToObject = array => {
  if (array !== undefined && array.length) {
    return array.reduce((obj, item) => {
      obj[item.rank] = item.userResponse;
      return obj;
    }, {});
  } else {
    return {};
  }
};
