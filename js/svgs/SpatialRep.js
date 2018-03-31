/**
 * Spatial representation of the classroom during a session
 * @module sketches/SpatialRep
 * @author Basile Pesin
 */

class SpatialRep extends Rep {
    constructor(holder, currentTeacher, parameters = null) {
        super(currentTeacher, parameters)

        // Setting default parameters
        if(!parameters) {
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

        // Teacher and it's proximity zone
        this.teacher = this.draw.group()
        this.bgProx2 = this.draw.rect(width, height).attr({ fill: '#d3d3d3' }).move(-width/2, -height/2).opacity(0)
        this.bgProx1 = this.draw.rect(width/2, height/2).attr({ fill: '#a0a0a0' }).move(-width/4, -height/4).opacity(0)
        let teacherCircle = this.draw.circle(40).attr({ fill: '#fff', stroke:'#000', 'stroke-width': '10' }).move(-20, 0)
        this.teacher.add(this.bgProx2)
        this.teacher.add(this.bgProx1)
        this.teacher.add(teacherCircle)
        this.teacher.move(width/2, height-50)

        // Students
        this.students = students.filter(s => (s.teacherId == currentTeacher))
        let maxPosX = this.students.reduce((x, y) => Math.max(x, y.posX), 0)
        let maxPosY = this.students.reduce((x, y) => Math.max(x, y.posY), 0)
        this.students.forEach(s => {
            s.createSpatialRep(this.draw, maxPosX, maxPosY)
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
    applyParameters(parameters) {
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

        this.updateRegards()
        this.updateVerbalisation()
        this.updateTDOP()
        this.updateTeacherPos()
    }

    /**
     * Sets content of the "Verbalisation" box
     */
    updateVerbalisation() {
        let verb = ''
        this.currentEvents.forEach(e => {
            if(e.verbalisation && verb.indexOf(e.verbalisation) < 0) verb += ' ' + e.verbalisation
        }) 
        $('#verb-container').text(verb)
    }

    /**
     * Sets content of the "TDOP Interaction" box
     */
    updateTDOP() {
        let TDOPList = []
        let descTDOPList = []
        this.currentEvents.forEach(e => {
            if(e.descTDOP && descTDOPList.indexOf(e.descTDOP) < 0) {
                TDOPList.push(e.TDOP)
                descTDOPList.push(e.descTDOP)
            }
        })
        let html = ''
        for(let i=0; i<TDOPList.length; i++) {
            html += TDOPList[i] + ' : ' + descTDOPList[i] + '<br/>'
        }
        $('#TDOP-interaction-container').html(html)
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
        frequency = frequency.map(f => 30+Math.ceil(f*40/maxFrequency))

        for(let i=0; i<this.students.length; i++) {
            if(!duration[i]) continue
            this.regards.push(this.draw.circle(frequency[i])
                .attr({ fill: 'rgb(' + duration[i] + ',0,' + (255-duration[i]).toString() + ')' })
                .move(this.students[i].rep.x()+this.students[i].repCircle.width()/2-frequency[i]/2, this.students[i].rep.y()+this.students[i].repCircle.height()/2-frequency[i]/2))
        }

        // Move teacher and students at the front again
        this.students.forEach(s => { s.rep.front() })
    }

    /**
     * Moves the teacher position
     */
    updateTeacherPos() {
        if(this.parameters['display-position'] && !isNaN(this.filteredEvents[0]['posX'])) {
            let moyX = this.currentEvents.reduce((a, e) => a + e['posX'], 0)/this.currentEvents.length
            let moyY = this.currentEvents.reduce((a, e) => a + e['posY'], 0)/this.currentEvents.length

            let width = this.draw.width()
            let height = this.draw.height()
            let spatialPosX = moyX * (width-20) / 40 - 10
            let spatialPosY = height - (moyY - 3) * (height-100) / 40 - 100
            this.teacher.move(spatialPosX, spatialPosY)
        }
    }

}
