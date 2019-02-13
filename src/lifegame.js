import Matrix from './matrix'

export default class GameOfLife {
    /**
     * @param {Object} options
     */
    constructor(options) {
        this._validateOptions(options)
        this.canvas = document.getElementById(options.canvas)
        if (this.canvas.getContext) {
            this.cptGen = 1
            this.renderGen = 1
            this.resizeSide = true
            this.paused = false
            this.canvas.height = options.height
            this.canvas.width = options.width
            this.ctx = this.canvas.getContext('2d')
            this.size = options.size
            this.color = options.color === undefined ? 'black' : options.color
            this.background = options.background === undefined ? 'white' : options.background
            // customize canvas before creating matrix in case of width and height modification
            if (options.customize !== undefined) {
                options.customize(this.canvas)
            }
            this.matrix = new Matrix(
                Math.round(options.height / options.size),
                Math.round(options.width / options.size)
            ).matrix
            if (options.pattern !== undefined) {
                this._populate(this.matrix, () => 0)
                options.pattern(this.matrix)
            } else {
                this._populate(this.matrix, () => Math.round(Math.random()))
            }
            this._draw()
        } else {
            throw new Error('Canevas unsupported on this browser')
        }
    }

    /**
     *
     * @param {Object} options
     */
    _validateOptions(options) {
        if (typeof options !== 'object') throw new Error('constructor expect an object as argument')

        if (options.canvas === undefined) throw new Error('canvas id name element is expected')

        if (typeof options.canvas !== 'string') throw new Error('canavas option must be a string')

        if (options.width === undefined) throw new Error('width option is expected')

        if (typeof options.width !== 'number') throw new Error('width option must be a number')

        if (options.height === undefined) throw new Error('height option is expected')

        if (typeof options.height !== 'number') throw new Error('height option must be a number')

        if (options.size === 'undefined') throw new Error('size option is expected')

        if (typeof options.size !== 'number') throw new Error('size option must be a number')

        if (options.color !== undefined && typeof options.color !== 'string')
            throw new Error('color option must be a string')

        if (options.background !== undefined && typeof options.background !== 'string')
            throw new Error('background option must be a string')

        if (options.customize !== undefined && typeof options.customize !== 'function')
            throw new Error('customize option must be a function')

        if (options.pattern !== undefined && typeof options.pattern !== 'function')
            throw new Error('pattern option must be a function')
    }

    /**
     * Populate state for each indice with the an activation function
     * @param {Array} matrix
     * @param {Function} fn
     */
    _populate(matrix, fn) {
        for (let nI = 0; nI < matrix.length; nI++) {
            for (let mI = 0; mI < matrix[nI].length; mI++) {
                matrix[nI][mI] = fn(nI, mI)
            }
        }
    }

    /**
     * Color canvas according matrix state
     */
    _draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let nI = 0; nI < this.matrix.length; nI++) {
            for (let mI = 0; mI < this.matrix[nI].length; mI++) {
                if (this.matrix[nI][mI] === 1) {
                    this.ctx.fillStyle = this.color
                    this.ctx.fillRect(mI * this.size, nI * this.size, this.size, this.size)
                }
            }
        }
    }

    _hashLifeSimulation() {}

    /**
     * Simulated a new generation of cell and update matrix
     */
    _basicSimulation() {
        const cellToDesactive = []
        const cellToActive = []
        for (let nI = 0; nI < this.matrix.length; nI++) {
            for (let mI = 0; mI < this.matrix[nI].length; mI++) {
                const countCellNeighbour = () => {
                    let cpt = 0
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            if (i !== 0 || j !== 0) {
                                if (this.matrix[nI + i] !== undefined && this.matrix[nI + i][mI + j] !== undefined) {
                                    cpt += this.matrix[nI + i][mI + j]
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
                if (this.matrix[nI][mI] === 1 && (countActive < 2 || countActive > 3)) {
                    cellToDesactive.push([nI, mI])
                }
                if (this.matrix[nI][mI] === 0 && countActive === 3) {
                    cellToActive.push([nI, mI])
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
     * Play game
     * @param {Object} options
     * @param {Function} callback
     */
    play(options, callback) {
        if (options.speed === undefined) return callback(new Error('speed option is expected'))

        if (typeof options.speed !== 'number') return callback(new Error('speed option must be a number'))

        if (options.render !== undefined && typeof options.render !== 'number')
            return callback(new Error('render option must be a number'))

        if (options.max !== undefined && typeof options.max !== 'number')
            return callback(new Error('max option must be a number'))

        if (options.render !== undefined) this.renderGen = options.render

        const interval = setInterval(() => {
            if (options.max !== undefined && options.max === this.cptGen) {
                clearInterval(interval)
            }
            if (!this.paused) {
                this._basicSimulation()
            }
            if (this.cptGen % this.renderGen === 0) {
                this._draw()
            }
            callback(null, this.cptGen++, interval)
        }, options.speed)
    }

    /**
     * Resize matrix
     * @param {Number} width
     * @param {Number} height
     */
    resize(width, height) {
        return new Promise((resolve, reject) => {
            if (typeof width !== 'number') return reject(new Error('Number type expected for width argument'))

            if (typeof height !== 'number') return reject(new Error('Number type expected for heigth argument '))

            this.canvas.width = width
            this.canvas.height = height

            const widthUpdate = Math.round(width / this.size) - this.matrix[0].length
            // Create a new matrix according to the new width and height
            if (widthUpdate > 0) {
                const newMatrix = new Matrix(Math.round(height / this.size), Math.round(width / this.size)).matrix

                for (let nI = 0; nI < newMatrix.length; nI++) {
                    for (let mI = 0; mI < newMatrix[nI].length; mI++) {
                        if (this.matrix[nI][mI] === 1) {
                            const mIu = mI + Math.floor(widthUpdate / 2)
                            newMatrix[nI][mIu] = this.matrix[nI][mI]
                        }

                        if (newMatrix[nI][mI] !== 1) {
                            newMatrix[nI][mI] = 0
                        }
                    }
                }

                this.matrix = newMatrix
            }

            // TODO, fix this shit
            if (widthUpdate < 0) {
                const newMatrix = new Matrix(Math.round(height / this.size), Math.round(width / this.size)).matrix

                for (let nI = 0; nI < this.matrix.length; nI++) {
                    for (
                        let mI = Math.abs(Math.floor(widthUpdate / 2));
                        mI < this.matrix[nI].length - Math.abs(Math.round(widthUpdate / 2));
                        mI++
                    ) {
                        if (this.matrix[nI][mI] === 1) {
                            newMatrix[nI][mI - Math.abs(Math.floor(widthUpdate / 2))] = this.matrix[nI][mI]
                        }

                        if (newMatrix[nI][mI] !== 1) {
                            newMatrix[nI][mI] = 0
                        }
                    }
                }
                this.matrix = newMatrix
            }

            /*
            const widthUpdate = Math.round(width / this.size) - this.matrix[0].length
            if (widthUpdate > 0) {
                for (let x = 0; x < this.matrix.length; x++) {
                    if (widthUpdate === 1) {
                        if (this.resizeSide) {
                            this.matrix[x].push(0)
                            this.resizeSide = !this.resizeSide
                        } else {
                            this.matrix[x].unshift(0)
                            this.resizeSide = !this.resizeSide
                        }
                    } else {
                        for (let i = 0; i < widthUpdate; i++) {
                            if (i % 2 === 0) {
                                this.matrix[x].push(0)
                            } else {
                                this.matrix[x].unshift(0)
                            }
                        }
                    }
                }
            } 
            
            if (widthUpdate < 0) {
                for (let x = 0; x < this.matrix.length; x++) {
                    if (widthUpdate === -1) {
                        if (this.resizeSide) {
                            this.matrix[x].pop()
                            this.resizeSide = !this.resizeSide
                        } else {
                            this.matrix[x].shift()
                            this.resizeSide = !this.resizeSide
                        }
                    } else {
                        for (let i = widthUpdate; i < 0; i++) {
                            if (i % 2 === 0) {
                                this.matrix[x].pop()
                            } else {
                                this.matrix[x].shift()
                            }
                        }
                    }
                }
            }
            
            const heightUpdate = Math.round(height / this.size) - this.matrix.length
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
            */
            resolve(this.canvas)
        })
    }

    clear() {
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                this.matrix[y][x] = 0
                this.ctx.fillStyle = '#d1d9ff'
                this.ctx.fillRect(x * this.size, y * this.size, this.size, this.size)
            }
        }
    }
}
