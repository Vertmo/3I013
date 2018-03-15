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
        this.teacherVerbCircle = this.draw.circle(80).attr({ fill: '#f00' })
        this.teacherVerbCircle.move(this.draw.width()/2-40, this.draw.height()/2-40)
        this.teacher = this.draw.circle(40).attr({ fill: '#fff', stroke:'#000', 'stroke-width': '10' }).move(20, 20)
        this.teacher.move(this.draw.width()/2-20, this.draw.height()/2-20)

        // Students
        this.svgStudents = []
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
            s.setColorAccordingToNiveau(this.parameters['niveau'])

            // TDOP TODO Finir ca
            if(this.parameters['display-TDOP_Eleve']) s.setCircularTDOPEleve(null)
            else s.setCircularTDOPElevel(null)
        })

        this.updateRegards()
    }

    /**
     * Update regards from teacher to students (lines)
     */
    updateRegards() {
        let res = super.updateRegards()
        let frequency = res[0]
        let duration = res[1]

        let maxDuration = duration.reduce((x, y) => Math.max(x, y), 0)
        duration = duration.map(d => Math.floor(d*255/maxDuration))
        let maxFrequency = frequency.reduce((x, y) => Math.max(x, y), 0)
        frequency = frequency.map(f => Math.ceil(f*10/maxFrequency))
        for(let i=0; i<this.students.length; i++) {
            if(!duration[i]) continue
            this.regards.push(this.draw.line(this.draw.width()/2, 
                this.draw.height()/2, 
                this.students[i].rep.x() + this.students[i].repCircle.width()/2, 
                this.students[i].rep.y() + this.students[i].repCircle.height()/2,
            ).stroke({ width: frequency[i], color: 'rgb(' + (255-duration[i]).toString() + ',' + (255-duration[i]).toString() + ',' + (255-duration[i]).toString() + ')' }))
        }

        // Move teacher and students at the front again
        console.log(this.teacherCircle)
        this.students.forEach(s => { s.rep.front() })
        this.teacher.front()
    }
}
