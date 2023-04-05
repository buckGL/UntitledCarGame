export default class Sizes {
    constructor(camera, renderer) {

        // Setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // Resize event
        window.addEventListener('resize', () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)
            
            camera.aspect = this.width / this.height
            camera.updateProjectionMatrix()
        
            // Update renderer
            renderer.setSize(this.width, this.height)
            renderer.setPixelRatio(Math.min(this.pixelRatio, 2))
        
        })
    }
}