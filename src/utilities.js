export const collectIdsandDocs = doc => {
  return { id: doc.id, ...doc.data() };
};

// export const mapOverObj = (a) => {
//   Object.entries(a).map(([key, value]) => {
//     // Pretty straightforward - use key for the key and value for the value.
//     // Just to clarify: unlike object destructuring, the parameter names don't matter here.
// })
// }
