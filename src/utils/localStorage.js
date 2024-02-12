import { get, set } from 'lodash';

const MAIN_STORAGE_NAME = 'web-storage';

export const getStorage = name => {
  try {
    const storage = localStorage.getItem(MAIN_STORAGE_NAME);
    const jsonData = JSON.parse(storage);
    return get(jsonData, name, null);
  } catch (error) {
    return null;
  }
};

export const clearStorage = () => {
  localStorage.setItem(MAIN_STORAGE_NAME, null);
  // localStorage.clear();
};

export const setStorage = (name, value) => {
  const storage = localStorage.getItem(MAIN_STORAGE_NAME);
  let jsonData;

  try {
    jsonData = JSON.parse(storage);
    if (jsonData === null) jsonData = {};
  } catch (error) {
    jsonData = {};
  }

  set(jsonData, name, value);
  localStorage.setItem(MAIN_STORAGE_NAME, JSON.stringify(jsonData));
};
