/**
 * Circular representation of the classroom during a session
 * @module sketches/circular-rep
 * @author Basile Pesin
 */

var currentTeacher = 1

function circularRep(holder) {
    // Basic setup
    var width = $('#'+holder).innerWidth()
    var draw = SVG(holder).size(width, width)

    // Time
    var startTime = new Date(0)
    var endTime = nextTime(startTime, 30)

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


    $('#circular-rep-form :input').change(function() {
        if($(this).attr('type')==='checkbox') parameters[$(this).attr('name')] = $(this).prop('checked')
        else parameters[$(this).attr('name')] = $(this).attr('tabindex')

        // Impacting the changes
        applyParameters(parameters)
    })

    // Boutons precedant et suivant
    $('#previous-button').addClass('disabled')
    $('#previous-button').click(() => {
        endTime = startTime
        startTime = previousTime(startTime, parseInt(parameters['duree']))
        if(startTime <= new Date(0)) {
            startTime = new Date(0)
            endTime = nextTime(startTime, parameters['duree'])
            $('#previous-button').addClass('disabled')
        }
        displayTime(startTime, endTime)
    })

    $('#next-button').click(() => {
        startTime = endTime
        endTime = nextTime(endTime, parseInt(parameters['duree']))
        displayTime(startTime, endTime)
        $('#previous-button').removeClass('disabled')
    })

    /**
     * Apply the parameters
     */
    function applyParameters(parameters) {
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

        // Changement de l'interval
        endTime = nextTime(startTime, parameters['duree'])
        displayTime(startTime, endTime)
    }

    displayTime(startTime, endTime)
    applyParameters(parameters)
}
