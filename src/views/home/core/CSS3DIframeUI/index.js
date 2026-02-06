import * as THREE from 'three'
import {CSS3DRenderer, CSS3DObject} from 'three/examples/jsm/renderers/CSS3DRenderer.js'

// CSS3D Iframe 管理器类
export default class CSS3DIframeManager {
  constructor(scene, camera, container) {
    this.scene = scene
    this.camera = camera
    this.container = container

    // CSS3D 元素映射
    this.elements = new Map()
    this.elementCount = 0

    // 创建 CSS3D 渲染器
    this.renderer = null
    this.createRenderer()

    // 创建 WebGL 渲染器（可选）
    this.rendererWebGL = null
    this.createWebGLRenderer()

    // 添加到容器
    this.container.appendChild(this.renderer.domElement)
    this.container.appendChild(this.rendererWebGL.domElement)

    const frame = this.buildFrame(10, 20, 1)
    scene.add(frame)

    this.test()
  }

  createRenderer() {
    this.renderer = new CSS3DRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.domElement.style.position = 'absolute'
    this.renderer.domElement.style.top = '0'
    this.renderer.domElement.style.left = '0'
    this.renderer.domElement.style.pointerEvents = 'none'
    this.renderer.domElement.style.zIndex = '1'
  }

  createWebGLRenderer() {
    this.rendererWebGL = new THREE.WebGLRenderer({antialias: true, alpha: true})
    this.rendererWebGL.setSize(window.innerWidth, window.innerHeight)
    this.rendererWebGL.domElement.style.position = 'absolute'
    this.rendererWebGL.domElement.style.top = '0'
    this.rendererWebGL.domElement.style.left = '0'
    this.rendererWebGL.domElement.style.pointerEvents = 'none'
    this.rendererWebGL.domElement.style.zIndex = '0'
    this.container.appendChild(this.rendererWebGL.domElement)
  }

  buildFrame(width, height, thickness) {
    const group = new THREE.Group()
    const material = new THREE.MeshStandardMaterial({color: 0x2200ff})

    // Create the frame border 这是一个有洞的矩形
    const outerShape = new THREE.Shape()
    outerShape.moveTo(-(width / 2 + thickness), -(height / 2 + thickness))
    outerShape.lineTo(width / 2 + thickness, -(height / 2 + thickness))
    outerShape.lineTo(width / 2 + thickness, height / 2 + thickness)
    outerShape.lineTo(-(width / 2 + thickness), height / 2 + thickness)
    outerShape.lineTo(-(width / 2 + thickness), -(height / 2 + thickness))

    // Create inner rectangle (hole) 这个是洞
    const innerHole = new THREE.Path()
    innerHole.moveTo(-width / 2, -height / 2)
    innerHole.lineTo(width / 2, -height / 2)
    innerHole.lineTo(width / 2, height / 2)
    innerHole.lineTo(-width / 2, height / 2)
    innerHole.lineTo(-width / 2, -height / 2)

    outerShape.holes.push(innerHole)

    const frameGeometry = new THREE.ExtrudeGeometry(outerShape, {
      depth: thickness,
      bevelEnabled: true, // Enable bevel
      bevelThickness: 5,
      bevelSize: 5,
      bevelSegments: 2
    })

    const frameMesh = new THREE.Mesh(frameGeometry, material)
    frameMesh.position.z = -thickness / 2
    group.add(frameMesh)

    // Add back plane // 这是背面板
    const backGeometry = new THREE.PlaneGeometry(width + thickness * 2, height + thickness * 2)
    const backMesh = new THREE.Mesh(backGeometry, material)
    backMesh.position.set(0, 0, -thickness / 2)
    backMesh.rotation.y = Math.PI
    group.add(backMesh)

    group.position.set(0, height / 2, 0)
    

    return group
  }

  test() {
    // Add room
    // BoxGeometry 第一个参数是宽度，第二个是高度，第三个是深度 第四个是宽度分段数，第五个是高度分段数，第六个是深度分段数
    const roomGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(5, 5, 5, 10, 10, 10))
    const roomMaterial = new THREE.LineBasicMaterial({
      // 黑色
      color: 0x000000,
      opacity: 0.2,
      transparent: true
    })
    const room = new THREE.LineSegments(roomGeometry, roomMaterial)
    this.scene.add(room)
    // // 如何设置room的位置 第一个参数是x轴，第二个是y轴，第三个是z轴 y 为什么设置为2.5 因为box的高度是5 所以y轴设置为2.5 就是底部在0点位置
    room.position.set(0, 2.6, 0)
  }
}
