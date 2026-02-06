export const dict = {
  'work_type':[
    {id: '1', name: '一级'},
    {id: '2', name: '二级'},
    {id: '3', name: '三级'}
  ],
  'work_classification':[
    {id: '1', name: '老师'},
    {id: '2', name: '工人'},
    {id: '3', name: '教授'}
  ],
  'sex_type':[
    {id: 1, name: '男'},
    {id: 2, name: '女'},
  ],
}

export function getDictLabel (value, dictName) {
  return dict[dictName].filter(item => item.id != value)[0].name
}

export function getDict (value, dictName) {
  return dict[dictName].filter(item => item.id != value)[0]
}

