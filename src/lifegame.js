export default class LifeGame {

    /**
     * 
     * @param {Object} options 
     */
    constructor(options) {
        this._validateOptions(options)
        this.canvas = document.getElementById(options.canvas)
        if (this.canvas.getContext) {
            this.totalGen = 0
            this.canvas.height = options.height
            this.canvas.width = options.width
            this.ctx = this.canvas.getContext('2d')
            this.cellSize = options.cellSize
            this.cellColor = options.cellColor === undefined ? 'black' : options.cellColor
            this.backgroundColor = options.backgroundColor === undefined ? 'white' : options.backgroundColor
            // customize canvas before creating matrix in case of width and height modification
            if (options.customize !== undefined) {
                options.customize(this.canvas)
            }
            this.matrix = null
            this._createMatrix()
            if (options.init !== undefined) {
                this._init(() => 0)
                options.init(this.matrix)
            } else {
                this._init(() => Math.round(Math.random()))
            }
            if (options.draw) {
                this._draw()
            }

        } else {
            throw new Error('Canevas unsupported on this browser')
        }
    }

    /**
     * 
     * @param {Object} options 
     */
    _validateOptions(options) {
        if (typeof options !== 'object')
            throw new Error('constructor expect an object as argument')

        if (options.canvas === undefined)
            throw new Error('canvas id name element is expected')

        if (typeof options.canvas !== 'string')
            throw new Error('canavas option must be a string')

        if (options.width === undefined)
            throw new Error('width option is expected')

        if (typeof options.width !== 'number')
            throw new Error('width option must be a number')

        if (options.height === undefined)
            throw new Error('height option is expected')

        if (typeof options.height !== 'number')
            throw new Error('height option must be a number')

        if (options.cellSize === 'undefined')
            throw new Error('cellSize option is expected')
        
        if (typeof options.cellSize !== 'number')
            throw new Error('cellSize option must be a number')

        if (options.cellColor !== undefined && typeof options.cellColor !== 'string')
            throw new Error('cellColor option must be a string')

        if (options.backgroundColor !== undefined && typeof options.backgroundColor !== 'string')
            throw new Error('backgroundColor option must be a string')
        
        if (options.customize !== undefined && typeof options.customize !== 'function')
            throw new Error('customize option must be a function')

        if (options.init !== undefined && typeof options.init !== 'function')
            throw new Error('init option must be a function')
        
        if (options.draw !== undefined && typeof options.draw !== 'boolean')
            throw new Error('draw option must be a boolean')
    }

    /**
     * Create a matrix from a ratio between cellSize and canvas dimension
     */
    _createMatrix() {
        this.matrix = new Array(Math.round(this.canvas.height / this.cellSize))
        for (let y = 0; y < this.matrix.length; y++) {
            this.matrix[y] = new Array(Math.round(this.canvas.width / this.cellSize))
        }
    }

    /**
     * Init state for each indice with the an activation function
     * @param {Function} fn 
     */
    _init(fn) {
        for (let y = 0; y < this.matrix.length; y++) {
            this.matrix[y] = new Array(Math.round(this.canvas.width / this.cellSize))
            for(let x = 0; x < this.matrix[y].length; x++) {
                this.matrix[y][x] = fn()
            }
        }
    }

    /**
     * Color canvas according matrix state
     */
    _draw() {
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                if (this.matrix[y][x] === 1) {
                    this.ctx.fillStyle = this.cellColor
                } else {
                    this.ctx.fillStyle = this.backgroundColor
                }
                this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
            }
        }
    }

    /**
     * Animate the new generated matrix on canevas every @oaram generationSpeed ms
     * @param {Number} generationSpeed 
     * @param {Function} callback 
     */
    run(generationSpeed, callback) {
        if (typeof generationSpeed !== 'number') {
            callback(new Error('Number type expected for generationSpeed argument'))
            return
        }
        const interval = setInterval(() => {
            this._draw()
            callback(null, interval, this.totalGen++)
        }, generationSpeed)
    }

    /**
     * Simulated a new generation of cell and update matrix
     */
    nextSimulation() {
        const cellToDesactive = []
        const cellToActive = []
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                const countCellNeighbour = () => {
                    let cpt = 0
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            if (i !== 0 || j !== 0) {
                                if (this.matrix[y + i] !== undefined && this.matrix[y + i][x + j] !== undefined) {
                                    cpt += this.matrix[y + i][x + j]
                                    if (cpt > 3) {
                                        return cpt
                                    }
                                }
                            }
                        }
                    }
                    return cpt
                }
                let countActive = countCellNeighbour()
                if (this.matrix[y][x] === 1 && (countActive < 2 || countActive > 3)) {
                    cellToDesactive.push([y,x])
                }
                if (this.matrix[y][x] === 0 && countActive  === 3) {
                    cellToActive.push([y,x])
                }
            }
        }
        cellToDesactive.forEach(coord => {
            this.matrix[coord[0]][coord[1]] = 0
        })
        cellToActive.forEach(coord => {
            this.matrix[coord[0]][coord[1]] = 1
        })
    }

    /**
     * Resize matrix
     * @param {Number} width 
     * @param {Number} height 
     */
    resize(width, height) {
        return new Promise((resolve, reject) => {
            if (typeof width !== 'number') 
                return reject(new Error('Number type expected for width argument'))

            if (typeof height !== 'number')
                return reject(new Error('Number type expected for heigth argument '))

            const widthUpdate = Math.round(width / this.cellSize) - this.matrix[0].length
            if (widthUpdate > 0) {
                for (let y = 0; y < this.matrix.length; y++) {
                    if (widthUpdate === 1) {
                        if (Math.random() >= 0.5) {
                            this.matrix[y].push(0)
                        } else {
                            this.matrix[y].unshift(0)
                        }
                    } else {
                        for (let i = 0; i < widthUpdate; i++) {
                            if (i % 2 === 0) {
                                this.matrix[y].push(0)
                            } else {
                                this.matrix[y].unshift(0)
                            }
                        }
                    }
                }
            } 
            
            if (widthUpdate < 0) {
                for (let y = 0; y < this.matrix.length; y++) {
                    if (widthUpdate === -1) {
                        if (Math.random() >= 0.5) {
                            this.matrix[y].pop()
                        } else {
                            this.matrix[y].shift()
                        }
                    } else {
                        for (let i = widthUpdate; i < 0; i++) {
                            if (i % 2 === 0) {
                                this.matrix[y].pop()
                            } else {
                                this.matrix[y].shift()
                            }
                        }
                    }
                }
            }
            
            const heightUpdate = Math.round(height / this.cellSize) - this.matrix.length
            if (heightUpdate > 0) {
                for (let i = 0; i < heightUpdate; i++) {
                    this.matrix.push(new Array(this.matrix[0].length))
                    for (let j = 0; j < this.matrix[0].length; j++) {
                        this.matrix[this.matrix.length - 1][j] = 0
                    }
                }
            } 
            
            if (heightUpdate < 0) {
                for (let i = heightUpdate; i < 0; i++) {
                    this.matrix.pop()
                }
            }

            this.canvas.width = width
            this.canvas.height = height

            resolve(this.canvas)
        })
    }

    clear() {
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                this.matrix[y][x] = 0
                this.ctx.fillStyle = '#d1d9ff'
                this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
            }
        }
    }
}