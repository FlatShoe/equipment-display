import _ from 'lodash'
class RouteMenus {
  generateMenus(routes) {
    const result = []
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      if (_.isEmpty(route.meta) && _.isEmpty(route.children)) continue
      if (_.isEmpty(route.meta) && !_.isEmpty(route.children)) {
        result.push(...this.generateMenus(route.children))
        continue
      }
      const tempRoute = {
        ...route,
        children: []
      }
      if ((route.meta.icon && route.meta.title) || route.meta.primary) {
        result.push(tempRoute)
      }
      if (!_.isEmpty(route.children)) {
        tempRoute.children.push(...this.generateMenus(route.children))
      }
    }
    return result
  }
  generateRoutes(routes, relevanceTitle = []) {
    let result = []
    routes.forEach(route => {
      const data = {
        path: route.path,
        title: [...relevanceTitle]
      }
      const reg = /.*\/:.*/
      if (route.meta && route.meta.title && !reg.exec(route.path)) {
        data.title = [...data.title, route.meta.title]
        result.push(data)
      }
      if (!_.isEmpty(route.children)) {
        const tempRoutes = this.generateRoutes(route.children, data.title)
        if (tempRoutes.length > 0) {
          result = [...result, ...tempRoutes]
        }
      }
    })
    return result
  }
}

export default new RouteMenus()
