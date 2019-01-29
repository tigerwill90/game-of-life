/**
 * Règle du jeu de la vie
 * 1) Survie : si une case pleine est entourée par 2 ou 3 voisines, elle survie au coup suivant
 * 2) Naissance : si une case vide est entouée par exactement 3 voisines, elle devient vivante au tour suivant
 */

let game = null
let canvas = null
window.addEventListener('load', () => {
    canvas = document.getElementById('life-game')
    canvas.height = window.innerHeight / 1.2
    canvas.width = window.innerWidth / 1.2
    //canvas.height = 100
    //canvas.width = 100
    canvas.style.top = `calc(50% - ${canvas.height/2}px)`
    canvas.style.left = `calc(50% - ${canvas.width/2}px)`
    if (canvas.getContext) {
        game = new LifeGame(canvas, 5)
        game.init()
        game.animate(100, (err, interval, cpt) => {
            if (err !== null) {
                throw err
                return
            }
            document.getElementById('generation').innerHTML = 'Generations : <b>' + cpt + '</b>'
            game.simulate()
        })
    } else {
        throw new Error('Canevas unsupported on this browser')
    }
})

window.addEventListener('resize', () => {

    game.resize(window.innerWidth / 1.2, window.innerHeight / 1.2).then(update => {
        console.log('%d => width update, %d => height update', update.width, update.height)
        canvas.height = window.innerHeight / 1.2
        canvas.width = window.innerWidth / 1.2
        canvas.style.top = `calc(50% - ${canvas.height/2}px)`
        canvas.style.left = `calc(50% - ${canvas.width/2}px)`
    }).catch(err => {
        throw err
    })

})

/*
            matrix[Math.round((canvas.height / 5) / 2) - 1][Math.round((canvas.width / 5) / 2) + 1] = 1
            matrix[Math.round((canvas.height / 5) / 2) - 1][Math.round((canvas.width / 5) / 2)] = 1
            matrix[Math.round((canvas.height / 5) / 2)][Math.round((canvas.width / 5) / 2) - 1] = 1
            matrix[Math.round((canvas.height / 5) / 2)][Math.round((canvas.width / 5) / 2)] = 1
            matrix[Math.round((canvas.height / 5) / 2) + 1][Math.round((canvas.width / 5) / 2)] = 1
*/

