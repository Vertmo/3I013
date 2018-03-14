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
        applyParameters()
    }

    /**
     * On clicking the next time button
     */
    nextTime() {
        this.startTime = this.endTime
        this.endTime = nextTime(this.endTime, parseInt(this.parameters['duree']))
        $('#previous-button').removeClass('disabled')
        applyParameters()
    }

    /**
     * Apply general parameters
     */
    applyParameters() {
         // Time parameters
        this.endTime = nextTime(this.startTime, this.parameters['duree'])
        displayTime(this.startTime, this.endTime)
        this.currentEvents = filterEventsByTime(this.filteredEvents, this.startTime, this.endTime)
    }
}
