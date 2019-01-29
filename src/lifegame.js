export default class LifeGame {

    /**
     * 
     * @param {Object} canvas 
     * @param {Number} cellSize 
     */
    constructor(canvas, cellSize) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.cellSize = cellSize
        this.matrix = new Array(Math.round(this.canvas.height / this.cellSize))
        this.totalGen = 0
        for (let y = 0; y < this.matrix.length; y++) {
            this.matrix[y] = new Array(Math.round(this.canvas.width / this.cellSize))
        }
    }

    /**
     * Initialize matrix with cell pattern
     * @param {Function} callback 
     */
    init(callback) {
        if (callback === undefined) {
            for (let y = 0; y < this.matrix.length; y++) {
                this.matrix[y] = new Array(Math.round(this.canvas.width / this.cellSize))
                for(let x = 0; x < this.matrix[y].length; x++) {
                    this.matrix[y][x] = Math.round(Math.random())
                }
            }
            return
        }
        for (let y = 0; y < this.matrix.length; y++) {
            this.matrix[y] = new Array(Math.round(this.canvas.width / this.cellSize))
            for(let x = 0; x < this.matrix[y].length; x++) {
                this.matrix[y][x] = 0
            }
        }
        callback(this.matrix)
    }

    /**
     * Animate the new generated matrix on canevas every @oaram generationSpeed ms
     * @param {Number} generationSpeed 
     * @param {Function} callback 
     */
    animate(generationSpeed, callback) {
        if (typeof generationSpeed !== 'number') {
            callback(new Error('Number type expected for generationSpeed argument'))
            return
        }
        const interval = setInterval(() => {
            for (let y = 0; y < this.matrix.length; y++) {
                for (let x = 0; x < this.matrix[y].length; x++) {
                    if (this.matrix[y][x] === 1) {
                        this.ctx.fillStyle = '#3f51b5'
                    } else {
                        this.ctx.fillStyle = '#d1d9ff'
                    }
                    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
                }
            }
            callback(null, interval, this.totalGen++)
        }, generationSpeed)
    }

    /**
     * Simulated a new generation of cell and update matrix
     */
    simulate() {
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

            resolve({width: widthUpdate, height: heightUpdate})
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