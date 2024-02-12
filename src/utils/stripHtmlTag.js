export const stripHtmlTag = data => {
  if (!data) return null;
  const StrippedData = data.replace(/(<([^>]+)>)/gi, '');
  return StrippedData;
};
