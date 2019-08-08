export default {
  setString(key, value) {
    process.client && window.sessionStorage.setItem(key, value);
  },
  getString(key) {
    if (process.client) return window.sessionStorage.getItem(key);
  },
  setObject(key, value) {
    process.client && window.sessionStorage.setItem(key, JSON.stringify(value));
  },
  getObject(key) {
    const str = process.client && window.sessionStorage.getItem(key);
    if (str) {
      return JSON.parse(str);
    }
    return null;
  },
  clear() {
    process.client && window.sessionStorage.clear();
  }
};
