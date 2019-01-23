/**
 * Règle du jeu de la vie
 * 1) Survie : si une case pleine est entourée par 2 ou 3 voisines, elle survie au coup suivant
 * 2) Naissance : si une case vide est entouée par exactement 3 voisines, elle devient vivante au tour suivant
 */
let canvas = null

class Game {
    constructor(canvas, ctx, cell) {
        this.canvas = canvas
        this.ctx = ctx
        this.cell = cell
        this.matrix = new Array(Math.round(this.canvas.height / this.cell))
        for (let y = 0; y < this.matrix.length; y++) {
            this.matrix[y] = new Array(Math.round(this.canvas.width / this.cell))
        }
    }

    init(callback) {
        if (callback === undefined) {
            for (let y = 0; y < this.matrix.length; y++) {
                this.matrix[y] = new Array(Math.round(this.canvas.width / this.cell))
                for(let x = 0; x < this.matrix[y].length; x++) {
                    this.matrix[y][x] = Math.round(Math.random())
                }
            }
            return
        }

        for (let y = 0; y < this.matrix.length; y++) {
            this.matrix[y] = new Array(Math.round(this.canvas.width / this.cell))
            for(let x = 0; x < this.matrix[y].length; x++) {
                this.matrix[y][x] = 0
            }
        }
        callback(this.matrix)
    }

    draw(speed, callback) {
        const interval = setInterval(() => {
            for (let y = 0; y < this.matrix.length; y++) {
                for (let x = 0; x < this.matrix[y].length; x++) {
                    if (this.matrix[y][x] === 1) {
                        this.ctx.fillStyle = '#3f51b5'
                    } else {
                        this.ctx.fillStyle = '#d1d9ff'
                    }
                    this.ctx.fillRect(x * this.cell, y * this.cell, this.cell, this.cell)
                }
            }
            callback(interval)
        }, speed)
    }

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

    reset() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
}

window.addEventListener('load', () => {
    canvas = document.getElementById('life-game')
    canvas.height = window.innerHeight / 1.2
    canvas.width = window.innerWidth / 1.2
    //canvas.height = 100
    //canvas.width = 100
    canvas.style.top = `calc(50% - ${canvas.height/2}px)`
    canvas.style.left = `calc(50% - ${canvas.width/2}px)`
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d')
        const game = new Game(canvas, ctx, 5)
        game.init(matrix => {
            matrix[Math.round((canvas.height / 5) / 2) - 1][Math.round((canvas.width / 5) / 2) + 1] = 1
            matrix[Math.round((canvas.height / 5) / 2) - 1][Math.round((canvas.width / 5) / 2)] = 1
            matrix[Math.round((canvas.height / 5) / 2)][Math.round((canvas.width / 5) / 2) - 1] = 1
            matrix[Math.round((canvas.height / 5) / 2)][Math.round((canvas.width / 5) / 2)] = 1
            matrix[Math.round((canvas.height / 5) / 2) + 1][Math.round((canvas.width / 5) / 2)] = 1
        })
        let cpt = 0
        game.draw(100, interval => {
            document.getElementById('generation').innerHTML = 'Generation : ' + cpt++
            game.simulate()
        })
    } else {
        throw new Error('Canevas unsupported on this browser')
    }
})

