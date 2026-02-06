import {BASE_WIDTH, BASE_HEIGHT} from '@/constant'


// 根据浏览器大小推断缩放比例
export const getScale = (width = BASE_WIDTH, height = BASE_HEIGHT) => {
  const ww = window.innerWidth / width
  const wh = window.innerHeight / height
  return ww < wh ? ww : wh
}
