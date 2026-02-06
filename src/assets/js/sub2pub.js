/**
 * 订阅-发布模式
 */

function _obj_() {
  this.ary = [] // 普通事件
  this.onceAry = [] // 只执行一次的事件（由$once注入）
}

const main = {
  _state: {
    // key:{
    //     ary:[],
    //     onceAry:[]
    // }
  },
  /**
   * 事件订阅
   * @param {string} k 事件名
   * @param {function} func 函数
   * @returns undefined
   */
  $on(k, func) {
    if (!k || !func) return
    if (Object.prototype.toString.call(func) !== '[object Function]') return

    if (!this._state[k]) {
      this._state[k] = new _obj_()
    }

    const _ind = this._state[k].ary.findIndex(g => g == func)
    if (_ind < 0) {
      this._state[k].ary.push(func)
    }
  },
  /**
   * 取消事件订阅
   * @param {string} k 事件名
   * @param {function} func 函数
   * @returns undefined
   */
  $off(k, func) {
    if (!k || !func || !this._state[k]) return

    if (!func || Object.prototype.toString.call(func) !== '[object Function]') {
      delete this._state[k]
    } else {
      let _ind = this._state[k].ary.findIndex(g => g == func)
      if (_ind > -1) {
        this._state[k].ary.splice(_ind, 1)
      }

      _ind = this._state[k].onceAry.findIndex(g => g == func)
      if (_ind > -1) {
        this._state[k].onceAry.splice(_ind, 1)
      }
    }
  },
  /**
   * 事件触发
   * @param {string} k 事件名
   * @param  {...any} args 函数参数列表
   * @returns undefined
   */
  $emit(k, ...args) {
    if (!k || !this._state[k]) return

    this._state[k].ary.forEach(f => {
      f(...args)
    })

    this._state[k].onceAry.forEach(f => {
      f(...args)
    })

    this._state[k].onceAry = [] // 只执行一次的函数列表，执行了就清空
  },
  /**
   * 事件订阅（事件只执行一次）
   * @param {string} k 事件名
   * @param {function} func 函数(只执行一次)
   * @returns undefined
   */
  $once(k, func) {
    if (!k || !func) return
    if (Object.prototype.toString.call(func) !== '[object Function]') return

    if (!this._state[k]) {
      this._state[k] = new _obj_()
    }

    const _ind = this._state[k].onceAry.findIndex(g => g == func)
    if (_ind < 0) {
      this._state[k].onceAry.push(func)
    }
  }
}

export default main
