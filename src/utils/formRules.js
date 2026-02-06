// 手机号校验
export const phone = {
  pattern: /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/,
  message: '请输入正确的手机号',
  trigger: 'blur'
}

// 纯整数校验
export const required = {
  required: true,
  message: '不能为空',
  trigger: ['blur']
}

export const requiredChange = {
  required: true,
  message: '不能为空',
  trigger: ['change']
}
// 纯整数校验
export const integer = {
  pattern: /^(\-|\+)?\d+?$/,
  message: '请输入正确的数字',
  trigger: 'blur'
}

// 纯整数或小数校验
export const float = {
  pattern: /^(\-|\+)?\d+(\.\d+)?$/,
  message: '请输入正确的数字（整数或小数）',
  trigger: 'blur'
}

//  邮箱校验
export const email = {
  type: 'email',
  message: '请输入正确的邮箱地址',
  trigger: 'blur'
}

// 微信号
export const wecheat = {
  pattern: /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/,
  message: '请输入正确的微信号',
  trigger: 'blur'
}

// 营业执照校验
export const businessLicense = {
  pattern: /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/,
  message: '请输入正确的营业执照',
  trigger: 'blur'
}


// 银行卡号校验
export function bankAccount() {
  const validator = (rule, value, cb) => {
    const strBin = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
    if (!value) {
      cb(new Error('收款账户不能为空'))
    } else if (!Number.isInteger(+value)) {
      cb(new Error('银行卡号必须全为数字'))
    } else if (value.trim().length < 12 || value.trim().length > 19) {
      cb(new Error('银行卡号长度必须在12到19之间'))
    } else if (strBin.indexOf(value.substring(0, 2)) === -1) {
      cb(new Error('银行卡号开头6位不符合规范'))
    } else {
      cb()
    }
  }
  return {
    validator,
    trigger: 'blur'
  }
}