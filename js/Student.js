/**
 * Student class
 * @module Student
 * @author Basile Pesin
 */

class Student {
    //TODO actual constructor
    constructor(data) {
        this.teacherId = 0
        this.id = data.id
        this.posX = 0
        this.posY = 0
        this.nivFrancais = 0
        this.nivMath = 0
        this.besoinPart = null
        this.score = 0

        this.rep = null
    }

    /**
     * Create the SVG for the circular rep
     * @param draw the SVG container
     * @param radius radius of the circular rep
     * @param nbStudents number of students in this class
     */
    createCircularRep(draw, radius, nbStudents) {
        this.rep = draw.group()
        this.rep = draw.circle(20).attr({ fill: '#ffffff', stroke: '#000000', 'stroke-width':'3' })
        let repGroup = draw.group().add(this.rep)
        if(this.besoinPart) repGroup.add(draw.polygon('10,0 12,8 20,10 12,12 10,20 8,12 0,10 8,8'))
        repGroup.move(radius-20/2 + Math.cos(this.id/nbStudents*2*Math.PI)*radius/3, radius-20/2 + Math.sin(this.id/nbStudents*2*Math.PI)*radius/3)

        // Events TODO
        repGroup.on('mouseover', () => {
            $('#circular-annotations-display').text('Elève numéro ' + this.id + '\n')
        })
        repGroup.on('mouseout', () => {
            $('#circular-annotations-display').text('')
        })
    }

    /**
     * Change color of the circle representing the student
     * @param niveau the type of level used
     */
    setCircularColorAccordingToNiveau(niveau) {
        let niv
        switch(niveau) {
            case 'none':
                this.rep.attr({stroke: '#000000'})
                return
            case 'francais':
                niv = this.nivFrancais
                break
            case 'maths':
                niv = this.nivMath
                break
        }
        switch(niv) {
            case 0:
                this.rep.attr({stroke: '#ffd700'})
                break
            case 1:
                this.rep.attr({stroke: '#fe9a76'})
                break
            case 2:
                this.rep.attr({stroke: '#b03060'})
                break
            case 3:
                this.rep.attr({stroke: '#a52a2a'})
                break
        }
    }

    /**
     * Change color of the fill in function of current TDOP
     * @param TDOP the current TDOP of the student
     */
    setCircularTDOPEleve(TDOP) {
        switch(TDOP) {
            case 'b':
                this.rep.attr({fill: '#000000'})
                break
            default:
                this.rep.attr({fill: '#ffffff'})
        }
    }
}
