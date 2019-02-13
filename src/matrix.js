export default class Matrix {
    constructor(height, width) {
        this._matrix = this._createEmptyMatrix(height, width)
    }

    _createEmptyMatrix(height, width) {
        const matrix = Array(height)
        for (let nI = 0; nI < matrix.length; nI++) {
            matrix[nI] = Array(width)
        }
        return matrix
    }

    get matrix() {
        return this._matrix
    }
}