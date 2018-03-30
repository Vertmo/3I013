/**
 * Representation of the classroom during a session
 * @module sketches/Rep
 * @author Basile Pesin
 */

class Rep {
    constructor(currentTeacher, parameters) {
        // Time
        this.startTime = new Date(0)
        if(parameters) this.endTime = nextTime(this.startTime, parameters.duree)
        else this.endTime = nextTime(this.startTime, 30)
        displayTime(this.startTime, this.endTime)

        // Data
        this.filteredEvents = events.filter(e => e.teacherId == currentTeacher)
        this.curretEvents = filterEventsByTime(this.filteredEvents, this.startTime, this.endTime)

        this.regards = []
    }

    /**
     * On clicking the previous time button
     */
    previousTime() {
        this.endTime = this.startTime
        this.startTime = previousTime(this.startTime, parseInt(this.parameters['duree']))
        if(this.startTime <= new Date(0)) {
            this.startTime = new Date(0)
            this.endTime = nextTime(this.startTime, this.parameters['duree'])
            $('#previous-button').addClass('disabled')
        }
        this.applyParameters()
    }

    /**
     * On clicking the next time button
     */
    nextTime() {
        this.startTime = this.endTime
        this.endTime = nextTime(this.endTime, parseInt(this.parameters['duree']))
        $('#previous-button').removeClass('disabled')
        this.applyParameters()
    }

    /**
     * Apply general parameters
     */
    applyParameters() {
        // Time parameters
        if(this.parameters['duree'] == 'all') {
            this.startTime = new Date(0)
            this.endTime = new Date(3600*1000)
            displayTime(this.startTime, this.endTime)
            this.currentEvents = filterEventsByTime(this.filteredEvents, this.startTime, this.endTime)

            $('#previous-button').addClass('disabled')
            $('#next-button').addClass('disabled')
        } else {
            this.endTime = nextTime(this.startTime, this.parameters['duree'])
            displayTime(this.startTime, this.endTime)
            this.currentEvents = filterEventsByTime(this.filteredEvents, this.startTime, this.endTime)

            $('#next-button').removeClass('disabled')
        }
    }

    /**
     * Update regards from teacher to students (lines)
     */
    updateRegards() {
        // Removes previous
        this.regards.forEach(r => {r.remove()})

        // Computes frequency and duration of each
        let frequency = this.students.map(s => 0)
        let duration = this.students.map(s => [])
        let lastRegarde = 0
        this.currentEvents.forEach(e => {
            if(e.regarde) {
                if(lastRegarde == e.regarde) {
                    duration[e.regarde-1][duration[e.regarde-1].length-1] += 1
                } else {
                    frequency[e.regarde-1] += 1
                    duration[e.regarde-1].push(1)
                }
                lastRegarde = e.regarde
            } else lastRegarde = 0
        })

        duration = duration.map(d => {
            if(d.length > 0) return d.reduce((x, y) => x + y, 0)/d.length
            return 0
        })

        return [frequency, duration]
    }
}
