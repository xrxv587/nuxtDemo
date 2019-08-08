export default {
  setString(key, value) {
    process.client && window.localStorage.setItem(key, value);
  },
  getString(key) {
    if (process.client) return window.localStorage.getItem(key);
  },
  setObject(key, value) {
    process.client && window.localStorage.setItem(key, JSON.stringify(value));
  },
  getObject(key) {
    const str = process.client && window.localStorage.getItem(key);
    if (str) {
      return JSON.parse(str);
    }
    return null;
  },
  clear() {
    process.client && window.localStorage.clear();
  },
  deleteItem(key) {
    process.client && window.localStorage.removeItem(key);
  }
};
