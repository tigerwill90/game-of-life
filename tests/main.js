/**
 * Règle du jeu de la vie
 * 1) Survie : si une case pleine est entourée par 2 ou 3 voisines, elle survie au coup suivant
 * 2) Naissance : si une case vide est entouée par exactement 3 voisines, elle devient vivante au tour suivant
 */

let game = null
let canvas = null
window.addEventListener('load', () => {
    game = new LifeGame({
        canvas: 'life-game',
        size: 5,
        color: '#7f0000',
        background: '#ffebee',
        width: window.innerWidth / 1.2,
        height: window.innerHeight / 1.2,
        customize: canvas => {
            canvas.style.top = `calc(50% - ${canvas.height/2}px)`
            canvas.style.left = `calc(50% - ${canvas.width/2}px)`
        },
        init: matrix => {
            matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2)][Math.round(((window.innerWidth / 1.2) / 5) / 2) - 1] = 1
            matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2)][Math.round(((window.innerWidth / 1.2) / 5) / 2)] = 1
            matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2)][Math.round(((window.innerWidth / 1.2) / 5) / 2) + 1] = 1

            matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2)][30] = 1
            matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2)][31] = 1
            matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2)][32] = 1
        } 
    })
    
    game.play({speed: 0, render: 1}, (err, cpt) => {
        if (err !== null) {
            throw err
            return
        }
        document.getElementById('generation').innerHTML = 'Generations : <b>' + cpt + '</b>'
    })
})

window.addEventListener('resize', () => {

    game.resize(window.innerWidth / 1.2, window.innerHeight / 1.2).then(canvas => {
        canvas.style.top = `calc(50% - ${canvas.height/2}px)`
        canvas.style.left = `calc(50% - ${canvas.width/2}px)`
    }).catch(err => {
        throw err
    })

})

/*
            matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2) - 1][Math.round(((window.innerWidth / 1.2) / 5) / 2) + 1] = 1
            matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2) - 1][Math.round(((window.innerWidth / 1.2) / 5) / 2)] = 1
            matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2)][Math.round(((window.innerWidth / 1.2) / 5) / 2) - 1] = 1
            matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2)][Math.round(((window.innerWidth / 1.2) / 5) / 2)] = 1
            matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2) + 1][Math.round(((window.innerWidth / 1.2) / 5) / 2)] = 1


            matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2)][Math.round(((window.innerWidth / 1.2) / 5) / 2) - 1] = 1
            matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2)][Math.round(((window.innerWidth / 1.2) / 5) / 2)] = 1
            matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2)][Math.round(((window.innerWidth / 1.2) / 5) / 2) + 1] = 1

            for (let mI = 0; mI < matrix[0].length; mI++) {
                matrix[Math.round(((window.innerHeight / 1.2) / 5) / 2)][mI] = 1
            }
*/

