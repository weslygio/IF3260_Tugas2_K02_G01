export default class Point3 {
    #x
    #y
    #z
    
    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get z() {
        return this.#z;
    }

    /**
     * Create point from three components
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    constructor(x, y, z) {
        this.#x = x;
        this.#y = y;
        this.#z = z;
    }
}