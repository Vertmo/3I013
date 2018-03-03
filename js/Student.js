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

    createCircularRep(draw, radius, nbStudents) {
        this.rep = draw.circle(20).attr({ fill: '#ffffff', stroke: '#000000', 'stroke-width':'3' })
        this.rep.move(radius-20/2 + Math.cos(this.id/nbStudents*2*Math.PI)*radius/3, radius-20/2 + Math.sin(this.id/nbStudents*2*Math.PI)*radius/3)
    }

    setCircularColorAccordingToNiveau(niveau) {
        switch(niveau) {
            case 'none':
                this.rep.attr({stroke: '#000000'})
                return
            case 'francais':
                switch(this.nivFrancais) {
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
                return
            case 'maths':
                switch(this.nivMath) {
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
                return
        }
    }
}
