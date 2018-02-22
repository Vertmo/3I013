/**
 * Circular representation of the classroom during a session
 * @module sketches/circular-rep
 * @author Basile Pesin
 */

function circularSketch(sketch) {
    // Parameters
    var parameters
    /**
     * Setup function
     */
    sketch.setup = function() {
        width = $('#circular-sketch-holder').innerWidth()
        sketch.createCanvas(width, width*3/4)
        sketch.background(0, 0, 0)

        // Setting default parameters
        parameters = {
            'agencement':'num',
            'duree':'30',
            'niveau':'none',
            'display-niveau':false,
            'display-TDOP_Enseignant':false,
            'display-TDOP_Eleve':false
        }
    }

    $('#circular-rep-form :input').change(function() {
        if($(this).attr('type')==='checkbox') parameters[$(this).attr('name')] = $(this).prop('checked')
        else parameters[$(this).attr('name')] = $(this).attr('tabindex')
    })
}

