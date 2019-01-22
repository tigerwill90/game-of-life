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

    init(method) {

        const random = () => {
            for (let y = 0; y < this.matrix.length; y++) {
                this.matrix[y] = new Array(Math.round(this.canvas.width / this.cell))
                for(let x = 0; x < this.matrix[y].length; x++) {
                    this.matrix[y][x] = Math.random() >= 0.5
                }
            }
        }
        switch (method) {
            case 'random':
                random()
                break
            case 'blinking':
                this.matrix[Math.round(this.canvas.height / this.cell) / 2][(Math.round(this.canvas.width / this.cell) / 2) - 1] = true
                this.matrix[Math.round(this.canvas.height / this.cell) / 2][Math.round(this.canvas.width / this.cell) / 2] = true
                this.matrix[Math.round(this.canvas.height / this.cell) / 2][(Math.round(this.canvas.width / this.cell) / 2) + 1] = true
                break
            case 'blinking_plus':
                this.matrix[Math.round(this.canvas.height / this.cell) / 2][(Math.round(this.canvas.width / this.cell) / 2) - 2] = true
                this.matrix[Math.round(this.canvas.height / this.cell) / 2][(Math.round(this.canvas.width / this.cell) / 2) - 1] = true
                this.matrix[Math.round(this.canvas.height / this.cell) / 2][Math.round(this.canvas.width / this.cell) / 2] = true
                this.matrix[Math.round(this.canvas.height / this.cell) / 2][(Math.round(this.canvas.width / this.cell) / 2) + 1] = true
                this.matrix[Math.round(this.canvas.height / this.cell) / 2][(Math.round(this.canvas.width / this.cell) / 2) + 2] = true
                break
            case 'degenerative':
                this.matrix[(Math.round(this.canvas.height / this.cell) / 2) - 1][(Math.round(this.canvas.width / this.cell) / 2) + 1] = true
                this.matrix[(Math.round(this.canvas.height / this.cell) / 2) - 1][Math.round(this.canvas.width / this.cell) / 2] = true
                this.matrix[Math.round(this.canvas.height / this.cell) / 2][(Math.round(this.canvas.width / this.cell) / 2) - 1] = true
                this.matrix[Math.round(this.canvas.height / this.cell) / 2][Math.round(this.canvas.width / this.cell) / 2] = true
                this.matrix[(Math.round(this.canvas.height / this.cell) / 2) + 1][Math.round(this.canvas.width / this.cell) / 2] = true
                break
            default:
                random()
                break
        }
    
    }

    draw(callback) {
        setTimeout(() => {
            for (let y = 0; y < this.matrix.length; y++) {
                for (let x = 0; x < this.matrix[y].length; x++) {
                    if (this.matrix[y][x]) {
                        this.ctx.fillStyle = '#f44256'
                    } else {
                        this.ctx.fillStyle = '#ffffff'
                    }
                    this.ctx.fillRect(x * this.cell, y * this.cell, this.cell, this.cell)
                }
            }
            callback()
        }, 0)
    }

    simulate() {
        const coordToDesactivate = []
        const coordToActive = []
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                const countCellNeighbour = () => {
                    let cpt = 0
                    if (this.matrix[y][x - 1]) {
                        cpt++
                    }
                    if (this.matrix[y][x + 1]) {
                        cpt++
                    }
                    if (this.matrix[y - 1] !== undefined && this.matrix[y - 1][x - 1]) {
                        cpt++
                    }
                    if (this.matrix[y - 1] !== undefined && this.matrix[y - 1][x]) {
                        cpt++
                    }
                    if (this.matrix[y - 1] !== undefined && this.matrix[y - 1][x + 1]) {
                        cpt++
                    }
                    if (this.matrix[y + 1] !== undefined && this.matrix[y + 1][x - 1]) {
                        cpt++
                    }
                    if (this.matrix[y + 1] !== undefined && this.matrix[y + 1][x]) {
                        cpt++
                    }
                    if (this.matrix[y + 1] !== undefined && this.matrix[y + 1][x + 1]) {
                        cpt++
                    }
                    return cpt
                }
                let countActive = countCellNeighbour()
                if (this.matrix[y][x] && (countActive < 2 || countActive > 3)) {
                    coordToDesactivate.push([y,x])
                }
                if (!this.matrix[y][x] && countActive  === 3) {
                    coordToActive.push([y,x])
                }
            }
        }
        coordToDesactivate.forEach(coord => {
            this.matrix[coord[0]][coord[1]] = false
        })
        coordToActive.forEach(coord => {
            this.matrix[coord[0]][coord[1]] = true
        })
    }

    reset() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
}

window.addEventListener('load', () => {
    canvas = document.getElementById('life-game')
    canvas.height = 600
    canvas.width = 1000
    if (canvas.getContext) {
        console.log('it\'s work')
        const ctx = canvas.getContext('2d')
        const game = new Game(canvas, ctx, 5)
        game.init('random')
        setInterval(() => {
            game.draw(() => {
                game.simulate()
            })
        }, 100)
    } else {
        throw new Error('Canevas unsupported on this browser version')
    }
})

