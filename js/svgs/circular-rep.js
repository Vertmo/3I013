/**
 * Circular representation of the classroom during a session
 * @module sketches/circular-rep
 * @author Basile Pesin
 */

function circularRep(holder) {
    // Basic setup
    let width = $('#'+holder).innerWidth()
    var draw = SVG(holder).size(width, width*3/4)

    //A rectangle. Why not ?
    var rect = draw.rect(100, 100).attr({ fill: '#f06' })

    // Setting default parameters
    parameters = {
        'agencement':'num',
        'duree':'30',
        'niveau':'none',
        'display-niveau':false,
        'display-TDOP_Enseignant':false,
        'display-TDOP_Eleve':false
    }

    $('#circular-rep-form :input').change(function() {
        if($(this).attr('type')==='checkbox') parameters[$(this).attr('name')] = $(this).prop('checked')
        else parameters[$(this).attr('name')] = $(this).attr('tabindex')
        console.log(parameters)
    })
}

