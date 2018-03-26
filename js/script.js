/**
 * Basic JS code, used to manage dynamic elements in the page
 * @module script
 * @author Basile Pesin
 */
var activePage
var rep = null

var students = []
loadStudents()
var events = []
loadEvents()

$(function() {
    // Decorating the tabs
    $('#tabs .item').click(function() {
        $('#tabs .item').removeClass('active')
        $(this).addClass('active')
    })

    // When clicking on "Résumé"
    $('#main-tab').click(function() {
        loadPage('pages/main.html', () => {activateSemanticForms(); loadCharts('num')})
    })

    // When clicking on "Timelines"
    $('#timelines-tab').click(function() {
        loadPage('pages/timelines.html', () => {
            rep = [new TimelineRep('timelineHolder1', 1),
                    new TimelineRep('timelineHolder2', 2),
                    new TimelineRep('timelineHolder3', 3),
                    new TimelineRep('timelineHolder4', 4)]
        })
    })

    // When clicking on "Représentation circulaire"
    $('#circular-rep-tab').click(() => {
        loadPage('pages/circular-rep.html', function() {
            activateSemanticForms()
            repType = 'circular'
            rep = new CircularRep('circular-svg-holder', 1)
            rep.applyParameters()
        })
    })

    // When clicking on "Représentaiton spatiale"
    $('#spatial-rep-tab').click(() => {
        loadPage('pages/spatial-rep.html', function() {
            activateSemanticForms()
            repType = 'spatial'
            rep = new SpatialRep('spatial-svg-holder', 1)
            rep.applyParameters()
        })
    })

    // Default : main tab
    loadPage('pages/main.html', () => {activateSemanticForms(); loadCharts('num')})
})


/**
 * Loads one of the pages (tabs)
 * @param page The path of the html file to load
 * @param func Callback function when the page is loaded
 */
function loadPage(page, func) {
    // If the page is already loaded, why reload it ?
    if(activePage === page) return
    $('#container-div').load(page, func)
    activePage = page;
}

/**
 * Semantic UI forms need to be activated when the pages load
 */
function activateSemanticForms() {
    // Activating the checkboxes
    $('.ui.checkbox').checkbox()

    // Activating the radio checkboxes
    $('.ui.radio.checkbox').checkbox()

    // Form change event listener
    $('.rep-form :input').change(function() {
        if(rep == null) return
        if(Array.isArray(rep)) {
            // TODO (pour les timlines)
            return
        }
        rep.changeParameters($(this))
        
        if($(this).attr('name')==='enseignant') {
            if(rep instanceof CircularRep) rep = new CircularRep('circular-svg-holder', $(this).attr('tabindex'), rep.parameters)
            else if(rep instanceof SpatialRep) rep = new SpatialRep('spatial-svg-holder', $(this).attr('tabindex'), rep.parameters)
        }

        // Impacting the changes
        rep.applyParameters()
    })

    // Main page form change event listener
    $('#main-page-form :input').change(function() {
        if($(this).attr('name')==='chart-ordre') {
            loadCharts($(this).attr('tabindex'))
        }
    })

    $('#previous-button').addClass('disabled')
    $('#previous-button').click(() => {
        rep.previousTime()
    })

    $('#next-button').click(() => {
        rep.nextTime()
    })
}

/**
 * Loads the list of students (from the CSV for now)
 */
function loadStudents() {
    let filename = 'data/users.csv'
    $.ajax({
        type: 'GET',
        url: filename,
        dataType: 'text',
        success: data => {
            let array = CSVToArray(data, ',')
            array = array.slice(1, array.length-1)
            array.forEach(arr => {
                students.push(new Student({
                    teacherId: parseInt(arr[0].slice(2)),
                    id: parseInt(arr[1]),
                    classe: arr[4],
                    nivFrancais: arr[7],
                    nivMaths: arr[8],
                    besoinPart: arr[22],
                    posX: parseInt(arr[23]),
                    posY: parseInt(arr[24])
                }))
            })
        }
    })
}

/** 
 * Loads the list of events (from CSV for now)
 */
function loadEvents() {
    let filename = 'data/events.csv'
    $.ajax({
        type: 'GET',
        url: filename,
        dataType: 'text',
        success: data => {
            let array = CSVToArray(data, ',')
            array = array.slice(1, array.length-1)
            array.forEach(arr => {
                events.push({
                    startTime: new Date(parseInt(arr[2])),
                    endTime: new Date(parseInt(arr[5])),
                    teacherId: parseInt(arr[23].slice(2)),
                    verbalisation: arr[12],
                    TDOP: arr[14],
                    descTDOP: arr[17],
                    regarde: parseInt(arr[11])
                })
            })
        }
    })
}
