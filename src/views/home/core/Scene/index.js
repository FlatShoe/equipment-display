import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'stats.js'
import sceneConfig from './config'

export default class Scene {
  constructor(container) {
    this.container = container

    // 创建纹理加载器
    this.textureLoader = new THREE.TextureLoader()

    // 创建场景
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(sceneConfig.background.color)

    // 创建相机
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.5, 500)
    this.camera.position.copy(sceneConfig.camera.defaultPos)

    // 创建 WebGL 渲染器
    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // 添加到容器
    this.container.appendChild(this.renderer.domElement)

    // 创建控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.copy(sceneConfig.controls.defaultTarget)
    this.controls.enablePan = false
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.maxPolarAngle = Math.PI / 2
    

    // 创建性能监控
    this.stats = new Stats()
    this.stats.dom.style.position = 'absolute'
    this.stats.dom.style.top = null
    this.stats.dom.style.left = null
    this.stats.dom.style.bottom = '0px'
    this.stats.dom.style.right = '0px'
    this.container.appendChild(this.stats.dom)

    // 设置光照
    this.setupLighting()

    // 设置阴影
    this.setupShadow()

    // 设置网格
    this.setupGrid()

    // 绑定事件
    this.bindEvents()
  }
  setupLighting() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    this.scene.add(ambientLight)

    // 环境纹理
    let envTextureEquirec = this.textureLoader.load(
      // (process.env.BASE_URL || '/') + 'texture/envmap/room.png'
      (process.env.BASE_URL || '/') + 'texture/envmap/spruit_sunrise_4k.webp'
    )
    envTextureEquirec.mapping = THREE.EquirectangularReflectionMapping
    envTextureEquirec.colorSpace = THREE.SRGBColorSpace
    this.scene.environment = envTextureEquirec

    // 方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.near = 1
    directionalLight.shadow.camera.far = 50
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    this.scene.add(directionalLight)

    // 点光源
    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.set(-10, 10, -10)
    this.scene.add(pointLight)
  }

  setupShadow() {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.ShadowMaterial({
        opacity: 0.2
      })
    )
    plane.rotation.x = -Math.PI / 2
    plane.position.y = 0.001
    plane.receiveShadow = true
    this.scene.add(plane)
  }

  setupGrid() {
    const grid = new THREE.Group()
    this.scene.add(grid)
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0x888888)
    grid.add(gridHelper)

    // 添加坐标轴
    const axesHelper = new THREE.AxesHelper(5)
    axesHelper.position.set(0, 0.001, 0)
    grid.add(axesHelper)
    grid.visible = false
  }

  bindEvents() {
    window.addEventListener('resize', this.onWindowResize.bind(this))
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    
    // 更新 WebGL 渲染器
    this.renderer.setSize(window.innerWidth, window.innerHeight)

  }

  update(_deltaTime) {
    this.stats.begin()
    this.controls.update()
    
    // 渲染 WebGL
    this.renderer.render(this.scene, this.camera)    
    this.stats.end()
  }

  getScene() {
    return this.scene
  }

  getCamera() {
    return this.camera
  }

  getControls() {
    return this.controls
  }

  getRenderer() {
    return this.renderer
  }

  getStats() {
    return this.stats
  }
  getCSS3DIframeManager() {
    return this.css3dManager
  }
}
