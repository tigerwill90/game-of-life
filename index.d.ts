export type GameOptions = {
    canvas: HTMLElement
    height: number
    width: number
    size: number
    color: string
}

declare class GameOfLife {
    constructor(options: GameOptions): any
    play(options: { speed: number, render: number} , callback: (err: Error, cpt: number) => void): void
    resize(width: number, height: number): Promise<string | Error>
    clear(): void
}

export default GameOfLife