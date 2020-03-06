export const collectIdsandDocs = doc => {
  console.log("new doc iteration", doc.id);
  return { id: doc.id, ...doc.data() };
};
