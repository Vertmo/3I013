/**
 * Spatial representation of the classroom during a session
 * @module sketches/spatial-rep
 * @author Basile Pesin
 */

function spatialRep(holder) {
    // Basic setup
    let width = $('#'+holder).innerWidth()
    var draw = SVG(holder).size(width, width*3/4)    

    //A rectangle. Why not ?
    var rect = draw.rect(100, 100).attr({ fill: '#f06' })

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
