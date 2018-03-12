/**
 * Circular representation of the classroom during a session
 * @module sketches/CircularRep
 * @author Basile Pesin
 */

class CircularRep {
    constructor(holder, currentTeacher, parameters = null) {
        // Setting default parameters
        if(parameters==null) {
            this.parameters = {
                'agencement':'num',
                'duree':'30',
                'niveau':'none',
                'display-proximite':false,
                'display-TDOP_Enseignant':false,
                'display-TDOP_Eleve':false
            }
        } else {
            this.parameters = parameters
        }

        // Basic setup
        $('#'+holder).empty()
        let width = $('#'+holder).innerWidth()
        this.draw = SVG(holder).size(width, width)

        // Time
        this.startTime = new Date(0)
        this.endTime = nextTime(this.startTime, 30)

        // Background
        var bg = this.draw.group()
        var bg_TDOP_t_s = this.draw.circle(width).attr({ fill: '#99ffb3' })
        this.bgProx2 = this.draw.circle(3*width/4).attr({ fill: '#d3d3d3' }).opacity(0).move(width/8, width/8)
        this.bgProx1 = this.draw.circle(width/2).attr({ fill: '#a0a0a0' }).opacity(0).move(width/4, width/4)
        bg.add(bg_TDOP_t_s)
        bg.add(this.bgProx2)
        bg.add(this.bgProx1)

        // Teacher
        var teacher = this.draw.group()
        var teacher_verb_circle = this.draw.circle(80).attr({ fill: '#f00' })
        var teacherCircle = this.draw.circle(40).attr({ fill: '#fff', stroke:'#000', 'stroke-width': '10' }).move(20, 20)
        teacher.add(teacher_verb_circle)
        teacher.add(teacherCircle)
        teacher.move(this.draw.width()/2-40, this.draw.height()/2-40)

        // Students
        this.students = students.filter(s => (s.teacherId == currentTeacher))
        let nbStudents = this.students.length
        this.students.forEach(s => {
            s.createCircularRep(this.draw, width/2, nbStudents)
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
    applyParameters() {
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

            // TDOP TODO Finir ca
            if(this.parameters['display-TDOP_Eleve']) s.setCircularTDOPEleve(null)
            else s.setCircularTDOPEleve(null)
        })
    }
}
