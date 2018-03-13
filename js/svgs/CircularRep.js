/**
 * Circular representation of the classroom during a session
 * @module sketches/CircularRep
 * @author Basile Pesin
 */

class CircularRep extends Rep {
    constructor(holder, currentTeacher, parameters = null) {
        super(currentTeacher, parameters)

        // Setting default parameters
        if(!parameters) {
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
        super.applyParameters()

        // Proximity
        if(this.parameters["display-proximite"]) {
            this.bgProx1.animate(200).opacity(1)
            this.bgProx2.animate(200).opacity(1)
        } else {
            this.bgProx1.animate(200).opacity(0)
            this.bgProx2.animate(200).opacity(0)
        }

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
