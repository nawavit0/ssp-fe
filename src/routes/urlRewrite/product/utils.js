import { chunk, uniq } from 'lodash';

export const mapSizeListProductOption = (productOptions, listOfSize) => {
  const listOfSizeTypeFromCSV = listOfSize.map(({ type }) => type);
  const listOfSizeType = uniq(
    listOfSizeTypeFromCSV.concat(
      productOptions.map(({ attr_type: type }) => type),
    ),
  );
  const numberOfChunk = listOfSizeType.length;
  const listOfSizeMap = chunk(listOfSize, numberOfChunk).map(list =>
    list.reduce((all, item) => ({ ...all, [item.type]: item.size }), {}),
  );
  const listOfSizeWithSizeMap = listOfSize.map(size => ({
    ...size,
    sizeMap: listOfSizeMap.find(map => map[size.type] === size.size),
  }));
  const products = productOptions.map(option => ({
    ...option,
    sizeMap: (
      listOfSizeWithSizeMap.find(
        size =>
          option.attr_type === size.type && option.attr_size === size.size,
      ) || {}
    ).sizeMap,
  }));
  const initialSizeList = listOfSizeType.reduce(
    (all, type) => ({
      ...all,
      [type]: products.filter(product => {
        const inCSV = !!product.sizeMap;
        return (
          (inCSV && listOfSizeTypeFromCSV.includes(type)) ||
          product.attr_type === type
        );
      }),
    }),
    {},
  );
  const mappedSizeList = {};
  Object.keys(initialSizeList).map(sizeType => {
    const selectedSizeList = [];
    initialSizeList[sizeType].map(sizeList => {
      const productId = sizeList?.product_id?.toString() || '';
      const size =
        sizeList?.sizeMap?.[sizeType]?.toString() || sizeList?.attr_size || '';
      selectedSizeList.push({
        ...sizeList,
        size,
        productId,
      });
    });
    mappedSizeList[sizeType] = selectedSizeList;
  });
  const sortedSizeListBySizeMaps = {};
  listOfSizeType.map(sizeType => {
    const selectedSizeOrder = [];
    listOfSizeMap.map(sizeMap => {
      selectedSizeOrder.push(sizeMap[sizeType]);
    });
    const selectedSizeList = mappedSizeList[sizeType];
    const sortedSizeList = [];
    selectedSizeOrder.map(size => {
      selectedSizeList.map((object, index) => {
        const attrSize = object.size;
        if (size === attrSize) {
          sortedSizeList.push(object);
          selectedSizeList[index]['inSizeListFlag'] = true;
        }
      });
    });
    selectedSizeList.map(object => {
      if (!object.inSizeListFlag) {
        sortedSizeList.push(object);
      }
    });
    if (sortedSizeList.length) {
      sortedSizeListBySizeMaps[sizeType] = sortedSizeList;
    }
  });
  return sortedSizeListBySizeMaps;
};
