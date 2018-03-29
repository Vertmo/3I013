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
        this.color = getRandomColor()
    }

    /**
     * Create timeline representation (small rectangle)
     * @param draw the SVG container
     * @param start start position
     * @param length length of the rectangle
     */
    createTimelineRep(draw, start, length, grouping) {
        let rect
        if(grouping == 'none') {
            rect = draw.rect(length, draw.height()).attr({ fill: this.color }).move(start, 0)
        } else {
            let niveau
            if(grouping == "francais") niveau = this.nivFrancais
            else niveau = this.nivMaths
            
            switch(niveau) {
                case "Faible":
                    rect = draw.rect(length, draw.height()).attr({ fill: '#FF0000' }).move(start, 0)
                    break;
                case "Passable":
                    rect = draw.rect(length, draw.height()).attr({ fill: '#FF8000' }).move(start, 0)
                    break;
                case "Bon":
                    rect = draw.rect(length, draw.height()).attr({ fill: '#FFFF00' }).move(start, 0)
                    break;
                case "Très Bon":
                    rect = draw.rect(length, draw.height()).attr({ fill: '#00FF00' }).move(start, 0)
                    break;
            }
        }

        // Display information on the student
        rect.on('mouseover', () => { this.displayAnnotations() })
        rect.on('mouseout', () => {
            $('#annotations-display').empty()
        })
    }

    /**
     * Create the SVG for the circular rep
     * @param draw the SVG container
     * @param radius radius of the circular rep
     * @param nbStudents number of students in this class
     */
    createCircularRep(draw, radius, nbStudents) {
        this.repCircle = draw.circle(20).attr({ fill: '#ffffff', stroke: '#000000', 'stroke-width':'3' })
        this.rep = draw.group().add(this.repCircle)
        if(this.besoinPart) this.rep.add(draw.polygon('10,0 12,8 20,10 12,12 10,20 8,12 0,10 8,8'))
        let distance = Math.sqrt(this.posY**2 + (this.posX-15)**2) * (2/3*radius)/60 + radius/3
        this.rep.move(radius-20/2 + Math.cos(this.id/nbStudents*2*Math.PI)*distance, radius-20/2 + Math.sin(this.id/nbStudents*2*Math.PI)*distance)

        // Display information on the student
        this.rep.on('mouseover', () => { this.displayAnnotations() })
        this.rep.on('mouseout', () => {
            $('#annotations-display').empty()
        })
    }

    /**
     * Create the SVG for the spatial rep
     * @param draw the SVG container
     * @param maxPosX maximum x position
     * @param maxPosY maximum y position
     */
    createSpatialRep(draw, maxPosX, maxPosY) {
        let width = draw.width()
        let height = draw.height()
        this.repCircle = draw.circle(20).attr({ fill: '#ffffff', stroke: '#000000', 'stroke-width':'3' })
        this.rep = draw.group().add(this.repCircle)
        if(this.besoinPart) this.rep.add(draw.polygon('10,0 12,8 20,10 12,12 10,20 8,12 0,10 8,8'))
        let spatialPosX = this.posX * (width-20) / maxPosX
        let spatialPosY = (this.posY - 3) * (height-100) / (maxPosY-1)
        this.rep.move(spatialPosX-10, height-spatialPosY-100)

        // Display information on the student
        this.rep.on('mouseover', () => { this.displayAnnotations() })
        this.rep.on('mouseout', () => {
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
    setColorAccordingToNiveau(niveau) {
        let niv = null
        switch(niveau) {
            case 'none':
                this.repCircle.attr({stroke: '#000000'})
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
                this.repCircle.attr({stroke: '#FFFF00'})
                break
            case 'Passable':
                this.repCircle.attr({stroke: '#FF8000'})
                break
            case 'Bon':
                this.repCircle.attr({stroke: '#FF0000'})
                break
            case 'Très Bon':
                this.repCircle.attr({stroke: '#a52a2a'})
                break
        }
    }

    /**
     * Change color of the fill in function of current TDOP
     * @param TDOP the current TDOP of the student
     * TODO
     */
    setCircularTDOPEleve(TDOP) {

    }
}
