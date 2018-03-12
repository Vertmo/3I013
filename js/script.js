/**
 * Basic JS code, used to manage dynamic elements in the page
 * @module script
 * @author Basile Pesin
 */
var activePage
var rep = null
var repType = null

var students = []
loadStudents()

$(function() {
    // Decorating the tabs
    $('#tabs .item').click(function() {
        $('#tabs .item').removeClass('active')
        $(this).addClass('active')
    })

    // When clicking on "Résumé"
    $('#main-tab').click(function() {
        loadPage('pages/main.html', null)
    })

    // When clicking on "Timelines"
    $('#timelines-tab').click(function() {
        loadPage('pages/timelines.html', null)
    })

    // When clicking on "Représentation circulaire"
    $('#circular-rep-tab').click(function() {
        loadPage('pages/circular-rep.html', function() {
            activateSemanticForms()
            repType = 'circular'
            rep = new CircularRep('circular-svg-holder', 1)
            rep.applyParameters()
        })
    })

    // When clicking on "Représentaiton spatiale"
    $('#spatial-rep-tab').click(function() {
        loadPage('pages/spatial-rep.html', function() {
            activateSemanticForms()
            repType = 'spatial'
            rep = new SpatialRep('spatial-svg-holder', 1)
            rep.applyParameters()
        })
    })

    // Default : main tab
    loadPage('pages/main.html', null)
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
        rep.changeParameters($(this))

        if($(this).attr('name')==='enseignant') {
            if(repType==='circular') rep = new CircularRep('circular-svg-holder', $(this).attr('tabindex'), rep.parameters)
            else if(repType==='spatial') rep = new SpatialRep('spatial-svg-holder', $(this).attr('tabindex'), rep.parameters)
        }

        // Impacting the changes
        rep.applyParameters()
    })
}

/**
 * Loads the list of students (from the CSV for now)
 */
function loadStudents() {
    let fileName = '../data/users.csv'
    $.ajax({
        type: 'GET',
        url: 'data/users.csv',
        dataType: 'text',
        success: data => {
            let lines = data.split('\n')
            lines = lines.slice(1, lines.length-1)
            lines.forEach(l => {
                let arr = l.split(',')
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
