/**
 * Timeline representation
 * @module sketches/SpatialRep
 * @author Basile Pesin
 */

class TimelineRep extends Rep {
    constructor(holder, currentTeacher, parameters = {studentGrouping:'none'}) {
        super(currentTeacher, parameters)

        // Basic Setup
        $('#'+holder).empty()
        this.draw = SVG(holder).size(this.filteredEvents.length*4, 30)

        // Students
        this.students = students.filter(s => (s.teacherId == currentTeacher))

        // Drawing the timeline
        this.timeline = this.partitionByRegarde(this.filteredEvents)
        let moyenne = this.timeline.reduce((a, x) => a + x.length, 0)/this.timeline.length/2
        $('#tl-dureemoy' + currentTeacher).html('Duréer moyenne d\'un regard : ' + moyenne.toFixed(2) + 's')
        let i = 0
        this.timeline.forEach(e => {
            if(isNaN(e[0].regarde)) this.draw.rect(e.length*4, this.draw.height()).attr({ fill: '#FFFFFF' }).move(i*4)
            else this.students[e[0].regarde-1].createTimelineRep(this.draw, i*4, e.length*4, parameters["studentGrouping"])
            i += e.length
        })
    }

    /**
     * Partition the timeline by students watched
     * @return list of lists, each list with regards to a single student
     */
    partitionByRegarde(xs) {
        return xs.reduce((acc, v) => {
            if(!acc) return [[v]]
            if(acc[acc.length-1][0].regarde == v.regarde) {
                acc[acc.length-1].push(v)
                return acc
            }
            acc.push([v])
            return acc
        }, null)
    };
}
