/**
 * 本地持久存储
 */
export const localStorage = {
  set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  },
  get(key) {
    const value = window.localStorage.getItem(key)
    try {
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  },
  remove(key) {
    window.localStorage.removeItem(key)
  },
  removeAllItem() {
    window.localStorage.clear()
  }
}
/**
 * 本地临时存储
 */
export const sessionStorage = {
  set(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  },
  get(key) {
    const value = window.sessionStorage.getItem(key)
    try {
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  },
  remove(key) {
    window.sessionStorage.removeItem(key)
  },
  removeAllItem() {
    window.sessionStorage.clear()
  }
}
