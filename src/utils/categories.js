import { map, filter, reduce } from 'lodash';

export const findCategoryById = (id, categories = []) => {
  id = Number(id);
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    if (category.id === id) {
      return category;
    }

    const foundCategory = findCategoryById(id, category.children_data);
    if (foundCategory) {
      return foundCategory;
    }
  }
};

export const getActiveCategoryList = (categories = []) => {
  const result = [];
  const allowUrlkey = ['sale', 'brand', 'gifts'];
  const normalCondition = cate =>
    cate.include_in_menu === '1' &&
    cate.is_active === '1' &&
    cate.product_count > 0;

  const specificCateCondition = cate =>
    allowUrlkey.includes(cate.url_key) &&
    cate.is_active === '1' &&
    cate.include_in_menu === '1';

  const virtualCateCondition = cate =>
    cate.is_active === '1' &&
    cate.include_in_menu === '1' &&
    cate.virtual_category_root !== null &&
    cate.virtual_category_root !== '260';

  map(categories, cate => {
    if (
      normalCondition(cate) ||
      specificCateCondition(cate) ||
      virtualCateCondition(cate)
    ) {
      result.push(cate);
    }
  });

  return result;
};
const setChildrenData = (items, currentId) => {
  const data = filter(items, { parent_id: currentId });

  if (data) {
    return map(data, item => ({
      ...item,
      id: parseInt(item.entity_id),
      children_data: setChildrenData(items, item.entity_id),
    }));
  }

  return [];
};

export const transFormCategory = (categories = []) => {
  return reduce(
    filter(categories, { level: '2' }),
    (result, item) => {
      result.push({
        ...item,
        id: parseInt(item.entity_id),
        children_data: setChildrenData(categories, item.entity_id),
      });
      return result;
    },
    [],
  );
};

export const getCatgoriesMainMenu = (categories = []) => {
  const categoryMainMenuLv1 = {};
  const categoryMainMenuLv2 = {};
  categories.map(category => {
    if (parseInt(category.level) === 2) {
      categoryMainMenuLv1[category.url_key] = category;
    } else if (
      parseInt(category.level) === 3 &&
      (category.url_key === 'running' || category.url_key === 'football')
    ) {
      categoryMainMenuLv2[category.url_key] = category;
    }
  });
  return {
    categoryMainMenuLv1,
    categoryMainMenuLv2,
  };
};

const setSegmentInformation = (groupSegment, segmentInformation, childData) => {
  const mainSegment = ['men', 'women', 'unisex'];
  const set = (groupSegment, segmentText, childData) => {
    if (!groupSegment[segmentText]) {
      groupSegment[segmentText] = new Array();
      groupSegment[segmentText]?.push(childData.id);
    } else {
      groupSegment[segmentText]?.push(childData.id);
    }
  };

  if (segmentInformation?.length > 0) {
    let segmentInformationText = segmentInformation.trim();
    if (segmentInformationText.includes(',')) {
      const multiSegment = segmentInformationText.split(',');
      multiSegment.map(segment => {
        let segmentText = segment?.trim();
        if (mainSegment.indexOf(segmentText) < 0) {
          segmentText = 'unisex';
        }
        set(groupSegment, segmentText, childData);
      });
    } else {
      if (mainSegment.indexOf(segmentInformationText) < 0) {
        segmentInformationText = 'unisex';
      }
      set(groupSegment, segmentInformationText, childData);
    }
  } else {
    set(groupSegment, 'unisex', childData);
  }
};

export const getChildrenData = (categories, mainCategory, groupSegment) => {
  const children = categories.filter(
    category =>
      parseInt(category.parent_id) === parseInt(mainCategory.entity_id),
  );

  if (children && children.length) {
    return children.map(child => {
      const segmentInformation = child?.segment_information?.toLowerCase();

      const childData = {
        id: parseInt(child.entity_id),
        name: child.name || '',
        children_data: getChildrenData(categories, child, groupSegment),
        url_key: child.url_key,
        url_path: child.url_path,
        parent_id: child.parent_id,
      };

      setSegmentInformation(groupSegment, segmentInformation, childData);
      return childData;
    });
  }

  return [];
};

export const handleTransFormCategory = (
  categories = [],
  mainCategories = [],
) => {
  const activeCategories = categories
    .filter(
      category =>
        category.is_active === '1' &&
        category.include_in_menu === '1' &&
        category.virtual_category_root !== null &&
        mainCategories.indexOf(category.url_path.toLowerCase().trim()) !== -1,
    )
    .map(mainCategory => {
      const groupSegment = {};
      return {
        id: parseInt(mainCategory.entity_id),
        name: mainCategory.name || '',
        children_data: getChildrenData(categories, mainCategory, groupSegment),
        url_key: mainCategory.url_key,
        url_path: mainCategory.url_path,
        parent_id: mainCategory.parent_id,
        groupSegment,
      };
    });

  return mainCategories.length && activeCategories.length
    ? mainCategories
        .map(
          main =>
            activeCategories.filter(
              category => category.url_path === main,
            )[0] || {},
        )
        .filter(category => category.id)
    : [];
};

export const getMenuListBySegment = (groupSegment, cateogries) => {
  const segments = {};

  if (groupSegment?.men || groupSegment?.women || groupSegment?.unisex) {
    cateogries.map(category => {
      for (const key of Object.keys(groupSegment)) {
        if (groupSegment[key].indexOf(category.id) > -1) {
          if (!segments[key]) {
            segments[key] = new Array();
          }
          segments[key].push(category);
        }
      }
    });
  }

  return segments;
};

export const getIconCategory = urlKey => {
  if (urlKey === 'running') {
    return {
      src: '/static/icons/Running.svg',
      width: 20,
    };
  } else if (urlKey === 'football') {
    return {
      src: '/static/icons/Football.svg',
      width: 15,
    };
  } else if (urlKey === 'badminton') {
    return {
      src: '/static/icons/Badminton.svg',
      width: 20,
    };
  } else if (urlKey === 'tennis') {
    return {
      src: '/static/icons/Tennis.svg',
      width: 16,
    };
  } else if (urlKey === 'watersports') {
    return {
      src: '/static/icons/WaterSports.svg',
      width: 20,
    };
  } else if (urlKey === 'golf') {
    return {
      src: '/static/icons/Golf.svg',
      width: 10,
      customStyle: `
        top: -5px;
      `,
    };
  } else if (urlKey === 'table-tennis') {
    return {
      src: '/static/icons/TableTennis.svg',
      width: 16,
    };
  } else if (urlKey === 'cycling') {
    return {
      src: '/static/icons/Cycling.svg',
      width: 20,
    };
  } else if (urlKey === 'volleyball') {
    return {
      src: '/static/icons/Volleyball.svg',
      width: 20,
    };
  } else if (urlKey === 'yoga-pilates') {
    return {
      src: '/static/icons/YogaPilates.svg',
      width: 16,
    };
  }

  return '';
};
