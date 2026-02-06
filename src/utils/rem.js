import _ from 'lodash'
const BASESIZE = 16
const setRem = () => {
  const scale = document.documentElement.clientWidth / 1920
  const fontSize = BASESIZE * Math.min(scale, 2) > 12 ? BASESIZE * Math.min(scale, 2) : 12
  document.documentElement.style.fontSize = fontSize + 'px'
}
setRem()
window.onresize = _.throttle(() => {
  setRem()
}, 300)
