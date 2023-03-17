export default class Vec3 {
    #u1
    #u2
    #u3

    get u1() {
        return this.#u1;
    }

    get u2() {
        return this.#u2;
    }

    get u3() {
        return this.#u3;
    }

    /**
     * Create vector from three vector components
     * @param {number} u1 
     * @param {number} u2 
     * @param {number} u3 
     */
    constructor(u1, u2, u3) {
        this.#u1 = u1;
        this.#u2 = u2;
        this.#u3 = u3;
    }

    /**
     * Create vector from two points
     * @param {Point3} p1 Start point
     * @param {Point3} p2 End point
     * @returns {Vec3} New vector
     */
    static fromPoints(p1, p2) {
        return new Vec3(
            p2.x - p1.x,
            p2.y - p1.y,
            p2.z - p1.z
        );
    }

    /**
     * Normalize a vector to length of 1
     */
    normalize() {
        const d = Math.sqrt(this.#u1 * this.#u1 + this.#u2 * this.#u2 + this.#u3 * this.#u3);
        this.#u1 /= d;  this.#u1 = +this.#u1.toFixed(8);
        this.#u2 /= d;  this.#u2 = +this.#u2.toFixed(8);
        this.#u3 /= d;  this.#u3 = +this.#u3.toFixed(8);
        return this;
    }

    /**
     * Calculates dot product of v1 and v2
     * @param {Vec3} v1 
     * @param {Vec3} v2 
     * @returns {number} dot product
     */
    static dot(v1, v2) {
        return v1.u1 * v2.u1 + v1.u2 * v2.u2 + v1.u3 * v2.u3;
    }

    /**
     * Calculates the cross product of v1 and v2
     * @param {*} v1 
     * @param {*} v2 
     * @returns {Vec3} normal vector of v1 and v2
     */
    static cross(v1, v2) {
        return new Vec3(
            v1.u2 * v2.u3 - v1.u3 * v2.u2,
            v1.u3 * v2.u1 - v1.u1 * v2.u3,
            v1.u1 * v2.u2 - v1.u2 * v2.u1
        );
    }
}