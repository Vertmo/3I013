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

        // Setting default parameters
        parameters = {
            'duree':'30',
            'niveau':'none',
            'display-position':false,
            'display-proximite':false
        }

        $('#spatial-rep-form :input').change(function() {
            if($(this).attr('type')==='checkbox') parameters[$(this).attr('name')] = $(this).prop('checked')
            else parameters[$(this).attr('name')] = $(this).attr('tabindex')
        })
    }
}
