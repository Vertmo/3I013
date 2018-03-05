/**
 * Student class
 * @module Student
 * @author Basile Pesin
 */

class Student {
    //TODO actual constructor
    constructor(data) {
        this.teacherId = data.teacherId
        this.id = data.id
        this.classe = data.classe
        this.nivFrancais = data.nivFrancais
        this.nivMaths = data.nivMaths
        this.besoinPart = data.besoinPart
        this.posX = data.posX
        this.posY = data.posY

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
        let distance = Math.sqrt(this.posY**2 + (this.posX-15)**2) * (2/3*radius)/60 + radius/3
        repGroup.move(radius-20/2 + Math.cos(this.id/nbStudents*2*Math.PI)*distance, radius-20/2 + Math.sin(this.id/nbStudents*2*Math.PI)*distance)

        // Events TODO
        repGroup.on('mouseover', () => { this.displayAnnotations() })
        repGroup.on('mouseout', () => {
            $('#annotations-display').empty()
        })
    }

    /**
     * Create the SVG for the spatial rep
     * @param draw the SVG container
     */
    createSpatialRep(draw, maxPosX, maxPosY) {
        let width = draw.width()
        let height = draw.height()
        this.rep = draw.group()
        this.rep = draw.circle(20).attr({ fill: '#ffffff', stroke: '#000000', 'stroke-width':'3' })
        let repGroup = draw.group().add(this.rep)
        if(this.besoinPart) repGroup.add(draw.polygon('10,0 12,8 20,10 12,12 10,20 8,12 0,10 8,8'))
        let spatialPosX = this.posX * (width-20) / maxPosX
        let spatialPosY = (this.posY - 3) * (height-100) / (maxPosY-1)
        repGroup.move(spatialPosX-10, height-spatialPosY-100)

        // Events TODO
        repGroup.on('mouseover', () => { this.displayAnnotations() })
        repGroup.on('mouseout', () => {
            $('#annotations-display').empty()
        })
    }


    /**
     * Displays the informations related to this student
     */
    displayAnnotations() {
        let htmlString = '<b>Elève numéro ' + this.id + '</b><br/>'
        htmlString += 'Classe : ' + this.classe + '<br/>'
        htmlString += 'Niveau de Francais : ' + this.nivFrancais + '<br/>'
        htmlString += 'Niveau de Maths : ' + this.nivMaths + '<br/>'
        if(this.besoinPart) htmlString += 'Besoins particuliers : ' + this.besoinPart
        $('#annotations-display').html(htmlString)
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
                niv = this.nivMaths
                break
        }
        switch(niv) {
            case 'Faible':
                this.rep.attr({stroke: '#ffd700'})
                break
            case 'Passable':
                this.rep.attr({stroke: '#fe9a76'})
                break
            case 'Bon':
                this.rep.attr({stroke: '#b03060'})
                break
            case 'Très Bon':
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
