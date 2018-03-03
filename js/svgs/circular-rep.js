/**
 * Circular representation of the classroom during a session
 * @module sketches/circular-rep
 * @author Basile Pesin
 */

var currentTeacher = 0

function circularRep(holder) {
    // Basic setup
    var width = $('#'+holder).innerWidth()
    var draw = SVG(holder).size(width, width)

    // Background
    var bg = draw.group()
    var bg_TDOP_t_s = draw.circle(width).attr({ fill: '#99ffb3' })
    var bg_prox_2 = draw.circle(3*width/4).attr({ fill: '#d3d3d3' }).opacity(0).move(width/8, width/8)
    var bg_prox_1 = draw.circle(width/2).attr({ fill: '#a0a0a0' }).opacity(0).move(width/4, width/4)
    bg.add(bg_TDOP_t_s)
    bg.add(bg_prox_2)
    bg.add(bg_prox_1)

    // Teacher
    var teacher = draw.group()
    var teacher_verb_circle = draw.circle(80).attr({ fill: '#f00' })
    var teacher_circle = draw.circle(40).attr({ fill: '#fff', stroke:'#000', 'stroke-width': '10' }).move(20, 20)
    teacher.add(teacher_verb_circle)
    teacher.add(teacher_circle)
    teacher.move(draw.width()/2-40, draw.height()/2-40)
    
    // Students
    let nbStudents = students.filter(s => (s.teacherId == currentTeacher)).length
    students.filter(s => (s.teacherId == currentTeacher)).forEach(s => {
        s.createCircularRep(draw, width/2, nbStudents)
    })

    // Setting default parameters
    parameters = {
        'agencement':'num',
        'duree':'30',
        'niveau':'none',
        'display-proximite':false,
        'display-TDOP_Enseignant':false,
        'display-TDOP_Eleve':false
    }

    apply_parameters(parameters)

    $('#circular-rep-form :input').change(function() {
        if($(this).attr('type')==='checkbox') parameters[$(this).attr('name')] = $(this).prop('checked')
        else parameters[$(this).attr('name')] = $(this).attr('tabindex')

        // Impacting the changes
        apply_parameters(parameters)
    })

    /**
     * Apply the parameters
     */
    function apply_parameters(parameters) {
        // Proximite
        if(parameters["display-proximite"]) {
            bg_prox_1.animate(200).opacity(1)
            bg_prox_2.animate(200).opacity(1)
        } else {
            bg_prox_1.animate(200).opacity(0)
            bg_prox_2.animate(200).opacity(0)
        }

        // Changement des eleves
        students.filter(s => (s.teacherId == currentTeacher)).forEach(s => {
            // Niveau
            s.setCircularColorAccordingToNiveau(parameters['niveau'])

            // TDOP TODO Finir ca
            if(parameters['display-TDOP_Eleve']) s.setCircularTDOPEleve(null)
            else s.setCircularTDOPEleve(null)
        })
    }
}

function displayTime(startTime, endTime) {
    $('#circular-time-display').text(startTime + ' : ' + endTime)
}
