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

        this.updateVerbalisation()
        this.updateTDOP()
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

}
