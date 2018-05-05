/**
 * CircularRep module
 * @module sketches/CircularRep
 * @author Basile Pesin
 */

/**
 * Circular representation of the classroom during a session
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
                'display-proximite':true,
                'display-position':true,
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
        this.bgTDOP = this.draw.circle(width).attr({ fill: '#99ffb3' })
        this.bgProx2 = this.draw.circle(3*width/4).attr({ fill: '#d3d3d3' }).opacity(0).move(width/8, width/8)
        this.bgProx1 = this.draw.circle(width/2).attr({ fill: '#a0a0a0' }).opacity(0).move(width/4, width/4)
        bg.add(this.bgTDOP)
        bg.add(this.bgProx2)
        bg.add(this.bgProx1)

        // Teacher
        this.teacherVerb= this.draw.circle(80).attr({ fill: '#f00' })
        this.teacherVerb.move(this.draw.width()/2-40, this.draw.height()/2-40)
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
     * @param form the settings form
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
        })

        // Verbalisation (ou pas)
        this.teacherVerb.opacity(0)
        this.currentEvents.forEach(e => {
            if(e.verbalisation) this.teacherVerb.opacity(1)
        })

        this.updateTeacherPos()
        this.updateRegards()
        this.updateTDOP()
    }

    /**
     * Updates the background color according to TDOP
     */
    updateTDOP() {
        let TDOPTypes = [null, 'TRANS', 'EXE_INT', 'C_AV', 'Trav-IND', 'C-EV', 'Prés-E', 'D-GR']
        let countTDOPs = TDOPTypes.map(t => this.currentEvents.filter(x => x.TDOP.startsWith(t)).length)
        let max = 0
        for(let i=1; i<TDOPTypes.length; i++) {
            if(countTDOPs[i] > countTDOPs[max]) max = i;
        }
        this.bgTDOP.opacity(1)

        // Changes the color of the background circle according to TDOP
        switch(TDOPTypes[max]) {
            case 'TRANS':
                this.bgTDOP.attr({fill: '#cdf2fe'})
                break
            case 'EXE_INT':
                this.bgTDOP.attr({fill: '#9cfcf8'})
                break
            case 'C_AV':
                this.bgTDOP.attr({fill: '#81fec1'})
                break
            case 'Trav-IND':
                this.bgTDOP.attr({fill: '#1aff53'})
                break
            case 'C-EV':
                this.bgTDOP.attr({fill: '#b5fd68'})
                break
            case 'Prés-E':
                this.bgTDOP.attr({fill: '#fafe80'})
                break
            case 'D-GR':
                this.bgTDOP.attr({fill: '#ccccff'})
                break
            case null:
                this.bgTDOP.opacity(0)
                break
        }

        // Display information on the TDOP
        this.bgTDOP.on('mouseover', () => { 
            $('#annotations-display').html('TDOP majoritaire : ' + TDOPTypes[max])
        })
        this.bgTDOP.on('mouseout', () => {
            $('#annotations-display').empty()
        })
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
        this.students.forEach(s => { s.rep.front() })
        this.teacher.front()
    }

    /**
     * Moves the students pos around the teacher
     */
    updateTeacherPos() {
        if(this.parameters['display-position'] && !isNaN(this.filteredEvents[0]['posX'])) {
            let moyX = this.currentEvents.reduce((a, e) => a + e['posX'], 0)/this.currentEvents.length
            let moyY = this.currentEvents.reduce((a, e) => a + e['posY'], 0)/this.currentEvents.length

            this.students.forEach(s => {
                let radius = this.draw.width()/2
                let nbStudents = this.students.length
                let distance = Math.sqrt((s.posY-moyY)**2 + (s.posX-moyX)**2) * (2/3*radius)/60 + radius/3
                s.rep.x(radius-20/2 + Math.cos(s.id/nbStudents*2*Math.PI)*distance)
                s.rep.y(radius-20/2 + Math.sin(s.id/nbStudents*2*Math.PI)*distance)
            })
        }
    }
}
