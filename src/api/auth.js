import request from '@/request'

const baseUrl = '/auth'

// 登陆
export const login = formData => {
  const {username, password} = formData
  formData = new FormData()
  formData.append('username', username)
  formData.append('password', password)
  formData.append('grant_type', 'password')
  formData.append('type', '2')
  return request.post(`${baseUrl}/oauth/token`, formData, {
    headers: {
      Authorization: 'Basic c3dhZ2dlcjoxMjM0NTY='
    }
  })
}
// 获取用户信息
export const getUserInfo = () => {
  return request.get(`${baseUrl}/getUserInfo`)
}
