import NProgress from 'nprogress'
import router from '@/router'
import store from '@/store'
import {LOGIN_PATH} from '@/constant/index'
import whiteList from './whiteList'
import 'nprogress/nprogress.css'
NProgress.configure({showSpinner: false})
router.beforeEach(async (to, from, next) => {
  next()
})
router.afterEach(() => {
  NProgress.done()
})
