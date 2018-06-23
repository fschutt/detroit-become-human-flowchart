"use strict";

/// Renders a background triangle pattern into a div node and takes care of
/// efficiently updating the triangles to emulat the D:BH menu background pattern
///
/// TODO: This can be solved more efficiently with an OpenGL texture.
class TriangleRenderer {

    /// Where to render the triangles to in the DOM
    // container: DomNode,
    //
    /// Stores the array for the
    // triangle_array: Vec[usize][usize],
    //
    /// The width of one triangle, used for bounding-box calculation
    // triangle_width: usize

    /// ## Inputs
    ///
    /// - `container_node`: DomNode: The wrapper div around the rendered triangles
    /// - `triangle_width`: usize: The width of one triangle in pixels
    /// - `triangle_height`: usize: The height of one triangle in pixels
    constructor(container_node, triangle_width, triangle_height) {

        assert_eq_type(container_node, document.createElement("div"));
        assert_eq_type(triangle_width, 0);
        assert_eq_type(triangle_height, 0);

        const [rows, cols] = calculate_necessary_triangles(triangle_width, triangle_height);

        this.container = container_node;
        this.triangle_array = create_array_properly(rows, cols, 0);
        this.triangle_width = triangle_width;
        this.triangle_height = triangle_height;
    }

    /// Fills `this.triangle_array` with random numbers
    animate_triangles() {
        this.triangle_array.forEach(function(row, row_idx, array) {
            row.forEach(function(cell, cell_idx) {
                if (Math.random() < 0.5) {
                    array[row_idx][cell_idx] = Math.random() / 4.0;
                }
            })
        });

        // row 0, col 1
        // row 3, col 3
        // row 6, col 1
        // this.rasterize_triangle(0, 1, false);
/*
        this.rasterize_triangle(3, 3, false);
        this.rasterize_triangle(6, 1, false);
        this.rasterize_triangle(9, 3, false);
*/
        this.rasterize_triangle(0, 5, true);
        this.rasterize_triangle(3, 1, true);
        this.rasterize_triangle(6, 5, true);
        this.rasterize_triangle(9, 1, true);
        this.rasterize_triangle(6, -1, true);

        console.table(this.triangle_array);
    }

    rasterize_triangle(row, col, point_up) {
        let arr;

        if (point_up) {
            if (row % 2 == 0) {
                arr = [[0, 0, 1, 0, 0, 0, 0],
                       [1, 1, 1, 0, 0, 0, 0],
                       [1, 1, 1, 1, 1, 0, 0]];
            } else {
                arr = [[0, 0, 1, 0, 0, 0, 0],
                       [0, 0, 1, 1, 1, 0, 0],
                       [1, 1, 1, 1, 1, 0, 0]];
            }
        } else {
            if (row % 2 == 0) {
                arr = [[0, 1, 1, 1, 1, 1, 0],
                       [0, 1, 1, 1, 0, 0, 0],
                       [0, 0, 0, 1, 0, 0, 0]];
            } else {
                // middle is shifted to right by 2 elements
                arr = [[0, 1, 1, 1, 1, 1, 0],
                       [0, 0, 0, 1, 1, 1, 0],
                       [0, 0, 0, 1, 0, 0, 0]];
            }
        }

        for(let i = 0; i < arr.length; i++) {
            if (this.triangle_array[row + i]) {
                for(let j = 0; j < arr[i].length; j++) {
                    if ((this.triangle_array[row + i][col + j] !== undefined) && (arr[i][j] == 1)) {
                        this.triangle_array[row + i][col + j] = 1;
                    }
                }
            }
        }
    }

    /// Updates all the triangle nodes opacities in `this.container`.
    /// Only modifies the opacity, does not remove or create DOM elements
    update_dom() {
        let i = 0;
        let container = this.container;
        this.triangle_array.forEach(function(row) {
            row.forEach(function(cell) {
                if (container.childNodes[i] !== undefined) {
                    container.childNodes[i].style.opacity = cell;
                }
                i += 1;
            });
        });
    }

    /// Clears the `this.container` node and resets `this.triangle_array` back
    /// to an empty array. Useful when the window is resized.
    ///
    /// Warning: modifies the DOM - removes the old DOM and creates a new one.
    create_dom() {

        // forEach messes with the this object, therefore we make a copy
        // of the triangle width and height values
        const [triangle_width, triangle_height] = [this.triangle_width, this.triangle_height];
        const [rows, cols] = calculate_necessary_triangles(triangle_width, triangle_height);
        let container = this.container;

        this.triangle_array = create_array_properly(rows, cols, 0);

        // clear the old triangles...
        // equal to `this.container.innerHtml = ""`, but faster
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // add the new triangles..
        this.triangle_array.forEach(function (row, row_idx) {
            row.forEach(function (cell, col_idx) {
                const y = row_idx * triangle_height;
                let x = (col_idx * (triangle_width / 2.0)) - (triangle_width / 2.0);
                if (row_idx % 2 == 0) {
                    x -= (triangle_width / 2.0);
                }
                let dom_element = document.createElement('div');
                dom_element.className = col_idx % 2 == 0 ? "triangle" : "triangle odd";
                dom_element.style.marginLeft = x + "px";
                dom_element.style.marginTop = y + "px";
                container.appendChild(dom_element);
            });
        });
    }

    // Sets a timer on the window object and starts animating
    // the triangles in the DOM (updates them every 1 second)
    set_triangle_timers() {

        let object = this; // fucking hell, JavaScript...

        window.onresize = function() {
            object.create_dom();
            object.animate_triangles();
            object.update_dom();
        }
/*
        window.setInterval(function() {
            object.animate_triangles();
            object.update_dom();
        }, 2000);
*/
    }

}

// JS is so fucked - if you create a multidimensional array via:
// `new Array(rows).fill(new Array(cols).fill(value))`, every row in the
// array is a ** reference ** to the first row. Why the fuck this is
// a thing... I don't even want to know.
function create_array_properly(rows, cols, value) {
    let new_arr = new Array(rows);
    for (let i = 0; i < rows; i++) {
        let a = new Array(cols);
        a.fill(value);
        new_arr[i] = a;
    }
    return new_arr;
}

/// Returns a 2-element array [rows, columns]. Uses `window.innerWidth` and
/// `window.innerHeight` to calculate how many triangles are necessary to fill the DOM.
///
/// This function does not modify the DOM in any way, it just calculates the number of
/// rows and columns necessary.
function calculate_necessary_triangles(triangle_width, triangle_height) {

    const TRIANGLE_WIDTH_HALF = triangle_width / 2;
    const [WINDOW_WIDTH, WINDOW_HEIGHT] = [window.innerWidth, window.innerHeight];

    let triangle_column = 0, triangle_row = 0;
    let max_triangle_column = 0;

    while(true) {

        let x = ((triangle_column - 2) * TRIANGLE_WIDTH_HALF);
        let y = triangle_row * triangle_height;

        if (triangle_row % 2 === 0) {
            x += TRIANGLE_WIDTH_HALF;
        }

        if (x > WINDOW_WIDTH) {
            triangle_row += 1;
            if (triangle_row % 2 === 0) {
                triangle_column = -1;
            } else {
                triangle_column = 0;
            }
        }

        if (y > WINDOW_HEIGHT) {
            break;
        }

        triangle_column += 1;
        if (triangle_column > max_triangle_column) {
            max_triangle_column = triangle_column;
        }
    }

    return [triangle_row, max_triangle_column];
}

/// Throws a string with an optional message if the types of a and b are not equal
function assert_eq_type(a, b, msg) {
    let msg_total = "";

    if (typeof a !== typeof b) {
        console.error("error: incorrect types in assert_eq_type: a: " + typeof a + "b: " + typeof b);
    }

    if (a.constructor.name !== b.constructor.name) {
        console.error("error: two classes do not have the same class name: a: " + a.constructor.name + "b: " + b.constructor.name);
    }

    if (msg !== null && msg !== undefined && typeof msg === "string") {
        msg_total += msg;
    }

    if (0 !== msg_total.length) {
        throw msg_total;
    }
}