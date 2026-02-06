export default {
  namespaced: true,
  state: {
    selectedViewMode: 'front',
    showParameters: true,
    isParameterPanelExpanded: true,
    parameters: {
      temperature: 25,
      humidity: 45,
      power: 95,
      voltage: 220,
      network: '正常',
      camera: '摄像头在线'
    },
    // 组件数据
    components: [
      {id: 1, name: '主控单元', status: 'online', color: '#FF6B6B'},
      {id: 2, name: '高清屏幕', status: 'online', color: '#4ECDC4'},
      {id: 4, name: 'UPS电源系统', status: 'warning', color: '#06D6A0'},
      {id: 5, name: '温控系统', status: 'online', color: '#118AB2'},
      {id: 6, name: '网络模块', status: 'error', color: '#EF476F'},
      {id: 7, name: '道闸控制器', status: 'online', color: '#073B4C'},
      {id: 8, name: 'IP广播', status: 'online', color: '#7209B7'},
      {id: 9, name: '电源模块', status: 'online', color: '#F72585'},
      {id: 10, name: '散热风扇', status: 'offline', color: '#4361EE'},
      {id: 12, name: '摄像头', status: 'online', color: '#4CC9F0'}
    ],
    selectedComponentId: 0,
    selectedComponentDetail: null,
    componentPosition: {
      x: (Math.random() * 10 - 5).toFixed(2),
      y: (Math.random() * 5).toFixed(2),
      z: (Math.random() * 10 - 5).toFixed(2)
    },
    modelNames: {
      '散热风扇': ['LS004', 'LS002'],
      'UPS电源系统': ['200AH-0003_ASM', 'DN35-3_ASM'],
      '道闸控制器': ['0030004', '0030005'],
      '网络模块': ['IO00003'],
      'IP广播': ['IP00_ASM001'],
      '摄像头': ['C8C-5MP00_ASM001'],
      '主控单元': ['_-0002_ASM']
    }
  },
  mutations: {
    setSelectedViewMode(state, mode) {
      state.selectedViewMode = mode
    },
    setShowParameters(state) {
      state.showParameters = !state.showParameters
    },
    setIsParameterPanelExpanded(state) {
      state.isParameterPanelExpanded = !state.isParameterPanelExpanded
    },
    setSelectedComponentId(state, id) {
      state.selectedComponentId = id
    },
    setSelectedComponentDetail(state, payload) {
      state.selectedComponentDetail = payload
    },
    setComponentPosition(state, payload) {
      state.componentPosition = payload
    }
  }
}
