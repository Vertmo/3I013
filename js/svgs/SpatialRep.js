/**
 * Spatial representation of the classroom during a session
 * @module sketches/SpatialRep
 * @author Basile Pesin
 */

class SpatialRep {
    constructor(holder, currentTeacher, parameters = null) {
        // Setting default parameters
        if(parameters == null) {
            this.parameters = {
                'duree':'30',
                'niveau':'none',
                'display-position':false,
                'display-proximite':false
            }
        } else {
            this.parameters = parameters
        }

        // Basic setup
        $('#'+holder).empty()
        let width = $('#'+holder).innerWidth()
        let height = width*3/4
        this.draw = SVG(holder).size(width, height)    

        // Time
        this.startTime = new Date(0)
        this.endTime = nextTime(this.startTime, 30)

        // Teacher and it's proximity zone
        var teacher = this.draw.group()
        this.bgProx2 = this.draw.rect(width, height).attr({ fill: '#d3d3d3' }).move(-width/2, -height/2).opacity(0)
        this.bgProx1 = this.draw.rect(width/2, height/2).attr({ fill: '#a0a0a0' }).move(-width/4, -height/4).opacity(0)
        let teacherCircle = this.draw.circle(40).attr({ fill: '#fff', stroke:'#000', 'stroke-width': '10' }).move(-20, 0)
        teacher.add(this.bgProx2)
        teacher.add(this.bgProx1)
        teacher.add(teacherCircle)
        teacher.move(width/2, height-50)

        // Students
        this.students = students.filter(s => (s.teacherId == currentTeacher))
        let maxPosX = this.students.reduce((x, y) => Math.max(x, y.posX), 0)
        let maxPosY = this.students.reduce((x, y) => Math.max(x, y.posY), 0)
        this.students.forEach(s => {
            s.createSpatialRep(this.draw, maxPosX, maxPosY)
        })

        // Previous and next buttons
        $('#previous-button').addClass('disabled')
        $('#previous-button').click(() => {
            this.endTime = this.startTime
            this.startTime = previousTime(this.startTime, parseInt(this.parameters['duree']))
            if(this.startTime <= new Date(0)) {
                this.startTime = new Date(0)
                this.endTime = nextTime(this.startTime, this.parameters['duree'])
                $('#previous-button').addClass('disabled')
            }
            displayTime(this.startTime, this.endTime)
        })

        $('#next-button').click(() => {
            this.startTime = this.endTime
            this.endTime = nextTime(this.endTime, parseInt(this.parameters['duree']))
            displayTime(this.startTime, this.endTime)
            $('#previous-button').removeClass('disabled')
        })
        displayTime(this.startTime, this.endTime)
    }

    /**
     * On form change
     */
    changeParameters(form) {
        if(form.attr('type')==='checkbox') this.parameters[form.attr('name')] = form.prop('checked')
        else this.parameters[form.attr('name')] = form.attr('tabindex')
    }

    /**
     * Apply the parameters
     */
    applyParameters(parameters) {
        // Proximity
        if(this.parameters["display-proximite"]) {
            this.bgProx1.animate(200).opacity(1)
            this.bgProx2.animate(200).opacity(1)
        } else {
            this.bgProx1.animate(200).opacity(0)
            this.bgProx2.animate(200).opacity(0)
        }

        // Time interval
        this.endTime = nextTime(this.startTime, this.parameters['duree'])
        displayTime(this.startTime, this.endTime)

        // Students changes
        this.students.forEach(s => {
            // Level of skill
            s.setCircularColorAccordingToNiveau(this.parameters['niveau'])
        })
    }

}
