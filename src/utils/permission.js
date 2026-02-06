// permission.js
import Vue from 'vue'
(function(){
  Vue.directive('permission', {
    inserted(el, binding){
      // 获取用户权限 [每个人存放用户权限的位置不一致，需要根据自己的业务进行相应的修改]
      const userPermissions = ['user']
      // 获取指令中配置的权限
      let permissions = []
      const type = Object.prototype.toString.call(binding.value)
      switch (type){
        case '[object Array]':
          permissions = binding.value
          break
        case '[object Number]':
          permissions.push(binding.value)
          break
        default:
          permissions = binding.value.split('|')
          break
      }
      // 默认不隐藏
      let flag = false
      if (userPermissions.length == 0) flag = true
      else {
        if (userPermissions.length == 0) flag = true
        else {
          flag = [...new Set(permissions)].filter(item => userPermissions.indexOf(item) >= 0).length > 0
        }
      }
      // 用户权限不足则隐藏
      if (!flag) el.parentNode && el.parentNode.removeChild(el)
    }
  })
}())
