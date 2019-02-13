export default class Node {
    constructor(bounds, level) {
        this.bounds = bounds
        this.level = level || Math.log2(bounds.width * bounds.height)
        this.nodes = []
        this.tuples = []

        this.sum = 0
    }

    _split() {
        const subWidth = this.bounds.width / 2,
            subHeight = this.bounds.height / 2,
            x = this.bounds.x,
            y = this.bounds.y,
            nextLevel = Math.log2(subWidth * subHeight)

        // NW node
        this.nodes[0] = new Node(
            {
                x: x,
                y: y,
                width: subWidth,
                height: subHeight
            },
            nextLevel
        )

        // NE node
        this.nodes[1] = new Node(
            {
                x: x + subWidth,
                y: y,
                width: subWidth,
                height: subHeight
            },
            nextLevel
        )

        // SW node
        this.nodes[2] = new Node(
            {
                x: x,
                y: y + subHeight,
                width: subWidth,
                height: subHeight
            },
            nextLevel
        )

        // SE node
        this.nodes[3] = new Node(
            {
                x: x + subWidth,
                y: y + subHeight,
                width: subWidth,
                height: subHeight
            },
            nextLevel
        )
    }

    _getChildNodePosition(tuple) {
        let index = -1
        const vm = this.bounds.x + this.bounds.width / 2,
            hm = this.bounds.y + this.bounds.width / 2,
            w = tuple.x < vm,
            n = tuple.y < hm

        if (n & w) return 0
        else if (n & !w) return 1
        else if (!n & w) return 2
        else return 3
    }

    /**
     *
     * @param {*} pRect :  {x, y, v}
     */
    insert(tuple) {
        this.tuples.push(tuple)
        this.sum += tuple.v
        // all node already defined
        if (this.nodes[0] !== undefined) {
            const index = this._getChildNodePosition(tuple)
            this.nodes[index].insert(tuple)
            return
        }

        if (this.level > 2) {
            this._split()
            const index = this._getChildNodePosition(tuple)
            this.nodes[index].insert(tuple)
        }
    }
}
