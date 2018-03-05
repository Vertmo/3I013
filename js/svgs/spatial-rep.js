/**
 * Spatial representation of the classroom during a session
 * @module sketches/spatial-rep
 * @author Basile Pesin
 */

function spatialRep(holder) {
    var currentTeacher = 4

    // Basic setup
    let width = $('#'+holder).innerWidth()
    let height = width*3/4
    var draw = SVG(holder).size(width, height)    

    // Time
    var startTime = new Date(0)
    var endTime = nextTime(startTime, 30)

    //A rectangle. Why not ?
    var startTime = new Date(0)
    var endTime = nextTime(startTime, 30)

    // Teacher and it's proximity zone
    var teacher = draw.group()
    var bgProx2 = draw.rect(width*2/3, height*2/3).attr({ fill: '#d3d3d3' }).move(-width*2/6, -height*2/6).opacity(0)
    var bgProx1 = draw.rect(width/3, height/3).attr({ fill: '#a0a0a0' }).move(-width/6, -height/6).opacity(0)
    let teacherCircle = draw.circle(40).attr({ fill: '#fff', stroke:'#000', 'stroke-width': '10' }).move(-20, 0)
    teacher.add(bgProx2)
    teacher.add(bgProx1)
    teacher.add(teacherCircle)
    teacher.move(width/2, height-50)

    // Students
    let filteredStudents = students.filter(s => (s.teacherId == currentTeacher))
    let maxPosX = filteredStudents.reduce((x, y) => Math.max(x, y.posX), 0)
    let maxPosY = filteredStudents.reduce((x, y) => Math.max(x, y.posY), 0)
    students.filter(s => (s.teacherId == currentTeacher)).forEach(s => {
        s.createSpatialRep(draw, maxPosX, maxPosY)
    })

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
            bgProx1.animate(200).opacity(1)
            bgProx2.animate(200).opacity(1)
        } else {
            bgProx1.animate(200).opacity(0)
            bgProx2.animate(200).opacity(0)
        }

        // Changement de l'interval
        endTime = nextTime(startTime, parameters['duree'])
        displayTime(startTime, endTime)
    }

    displayTime(startTime, endTime)
    applyParameters(parameters)
}
