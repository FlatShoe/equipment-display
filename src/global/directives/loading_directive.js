/*
 * @Description v-loading
 */
export default {
  name: 'loading',
  directive: {
    bind: (el, binding, vnode) => {
      const {value: isLoading} = binding
      const that = vnode.context
      const mask = document.createElement('div')
      mask.className = 'loading-mask'
      mask.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: hsla(0, 0%, 100%, 0.8);
        z-index: 999;
      `
      const loginIcon = document.createElement('span')
      loginIcon.className = 'el-icon-loading'
      loginIcon.style.cssText = `
        font-size: 40px;
      `
      mask.appendChild(loginIcon)
      el.loadingMask = mask
      if (isLoading) {
        el.appendChild(el.loadingMask)
      }
      that.$nextTick(() => {
        const curStyle = window.getComputedStyle(el)
        const position = curStyle.position
        if (position == 'static') {
          el.style.position = 'relative'
        } else {
          el.style.position = position
        }
      })
    },
    update: (el, binding) => {
      const {value: isLoading} = binding
      if (isLoading) {
        if (!el.loadingMask.parentNode) {
          el.appendChild(el.loadingMask)
        }
      } else {
        if (el.loadingMask.parentNode === el) {
          el.removeChild(el.loadingMask)
        }
      }
    }
  }
}
