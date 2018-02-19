/**
 * Spatial representation of the classroom during a session
 * @module sketches/spatial-rep
 * @author Basile Pesin
 */

function spatialSketch(sketch) {
    /**
     * Setup function
     */
    sketch.setup = function() {
        width = $('#spatial-sketch-holder').innerWidth()
        sketch.createCanvas(width, width*3/4)
        sketch.background(0, 0, 0)
    }
}
