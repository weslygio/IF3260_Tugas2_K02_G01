// create new class matrix
class Matrix {
    constructor() {
        this.elements = new Float32Array(16);
        this.identity();
    }
    
    identity() {
        this.elements = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }
    
    fill(matrix) {   
        this.elements = matrix;
    }   

    // multiply matrix
    multiply(b) {
        var a = this.elements;
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        var result = [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];

        return result;
    }   

    // translate matrix
    translate(tx, ty, tz) {
        var trans_matrix = new Matrix();
        trans_matrix.elements = [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            tx, ty, tz, 1
        ]

        this.elements = this.multiply(trans_matrix.elements);
    }

    // projection matrix
    projection(width, height, depth) {
        var proj_matrix = new Matrix();
        proj_matrix.elements = [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ]

        return this.multiply(proj_matrix.elements);
    }

    // x rotate matrix
    xRotate(angle) {
        var xrot_matrix = new Matrix();
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        xrot_matrix.elements = [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ]

        this.elements = this.multiply(xrot_matrix.elements);
    }

    // y rotate matrix
    yRotate(angle) {
        var yrot_matrix = new Matrix();
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        yrot_matrix.elements = [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ]

        this.elements = this.multiply(yrot_matrix.elements);
    }

    // z rotate matrix
    zRotate(angle) {
        var zrot_matrix = new Matrix();
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        zrot_matrix.elements = [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]

        this.elements = this.multiply(zrot_matrix.elements);
    }

    // scale matrix
    scale(sx, sy, sz) {
        var scale_matrix = new Matrix();
        scale_matrix.elements = [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1,
        ]

        this.elements = this.multiply(scale_matrix.elements);
    }

    // projection matrix
    projection(projection, fov, aspect, near, far, angle) {
        if (projection == "Perspective") {
            return this.perspective(fov, aspect, near, far);
        } else if (projection == "Orthographic") {
            return this.orthographic(fov, aspect, near, far);
        } else if (projection == "Oblique") {
            this.elements = this.orthographic(fov, aspect, near, far);
            return this.oblique(angle);
        }
    }

    //oblique matrix
    oblique(angle) {
        var ortho_matrix = new Matrix();
        var theta = Math.PI / 4; // angle of obliqueness in radians
        var d = 1; // distance of projection plane from viewer

        ortho_matrix.elements = [
            1/Math.cos(theta), 0, -1/d, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]

        console.log(ortho_matrix.elements);

        return this.multiply(ortho_matrix.elements);
        
    }

    // orthographic matrix
    orthographic(fov, aspect, near, far) {
        var ortho_matrix = new Matrix();
        var left = -6 * Math.tan(fov / 2);
        var right = 6 * Math.tan(fov / 2);
        var top = left / aspect;
        var bottom = right / aspect;

        var lr = 1 / (left - right);
        var bt = 1 / (bottom - top);
        var nf = 1 / (near - far);

        ortho_matrix.elements = [
            -2 * lr, 0, 0, 0,
            0, -2 * bt, 0, 0,
            0, 0, 2 * nf, 0,
            (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1,
        ]

        return this.multiply(ortho_matrix.elements);
    }


    // perspective matrix
    perspective(fov, aspect, near, far) {
        var persp_matrix = new Matrix();
        var f = 1.0 / Math.tan(fov / 2);
        var nf = 1 / (near - far);
        persp_matrix.elements = [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, 2 * far * near * nf, 0,
        ]
        return this.multiply(persp_matrix.elements);
    }

    // invert
    invert() {
        var a00 = this.elements[0 * 4 + 0];
        var a01 = this.elements[0 * 4 + 1];
        var a02 = this.elements[0 * 4 + 2];
        var a03 = this.elements[0 * 4 + 3];
        var a10 = this.elements[1 * 4 + 0];
        var a11 = this.elements[1 * 4 + 1];
        var a12 = this.elements[1 * 4 + 2];
        var a13 = this.elements[1 * 4 + 3];
        var a20 = this.elements[2 * 4 + 0];
        var a21 = this.elements[2 * 4 + 1];
        var a22 = this.elements[2 * 4 + 2];
        var a23 = this.elements[2 * 4 + 3];
        var a30 = this.elements[3 * 4 + 0];
        var a31 = this.elements[3 * 4 + 1];
        var a32 = this.elements[3 * 4 + 2];
        var a33 = this.elements[3 * 4 + 3];

        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;
        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;
        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32;

        var invDet = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

        var inv_matrix = new Matrix();
        inv_matrix.elements = [
            (a11 * b11 - a12 * b10 + a13 * b09) * invDet,
            (a02 * b10 - a01 * b11 - a03 * b09) * invDet,
            (a31 * b05 - a32 * b04 + a33 * b03) * invDet,
            (a22 * b04 - a21 * b05 - a23 * b03) * invDet,
            (a12 * b08 - a10 * b11 - a13 * b07) * invDet,
            (a00 * b11 - a02 * b08 + a03 * b07) * invDet,
            (a32 * b02 - a30 * b05 - a33 * b01) * invDet,
            (a20 * b05 - a22 * b02 + a23 * b01) * invDet,
            (a10 * b10 - a11 * b08 + a13 * b06) * invDet,
            (a01 * b08 - a00 * b10 - a03 * b06) * invDet,
            (a30 * b04 - a31 * b02 + a33 * b00) * invDet,
            (a21 * b02 - a20 * b04 - a23 * b00) * invDet,
            (a11 * b07 - a10 * b09 - a12 * b06) * invDet,
            (a00 * b09 - a01 * b07 + a02 * b06) * invDet,
            (a31 * b01 - a30 * b03 - a32 * b00) * invDet,
            (a20 * b03 - a21 * b01 + a22 * b00) * invDet,
        ]

        return inv_matrix;
    }

    // transpose
    transpose() {
        var transpose_matrix = new Matrix();
        transpose_matrix.elements = [
            this.elements[0], this.elements[4], this.elements[8], this.elements[12],
            this.elements[1], this.elements[5], this.elements[9], this.elements[13],
            this.elements[2], this.elements[6], this.elements[10], this.elements[14],
            this.elements[3], this.elements[7], this.elements[11], this.elements[15],
        ]

        return transpose_matrix;
    }

}