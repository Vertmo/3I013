/**
 * Module handling time for circular et spatial rep
 * @author Basile Pesin
 * @module time
 */

/**
 * Gets data for a specific time
 * @param data all the data
 * @param time time to look for
 * @return data for this time
 */
function getData(data, time) {
    
}


/**
 * Backward in time by 1 interval
 * @param time current time
 * @param interval how much are we going back ?
 * @return new time
 */
function previousTime(time, interval) {
    return new Date(time.getTime() - interval*1000)
}

/**
 * Forward in time by 1 interval
 * @param time current time
 * @param interval how much are we going forward ?
 * @return new time
 */
function nextTime(time, interval) {
    return new Date(time.getTime() + interval*1000)   
}

/**
 * Displays the time in the time-display element
 * @param startTime
 * @param endTime
 */
function displayTime(startTime, endTime) {
    let startTimeString = startTime.toUTCString().split(' ')[4]
    let endTimeString = endTime.toUTCString().split(' ')[4]
    $('#time-display').text(startTimeString + ' : ' + endTimeString)
}
