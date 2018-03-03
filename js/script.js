/**
 * Basic JS code, used to manage dynamic elements in the page
 * @module script
 * @author Basile Pesin
 */
var activePage;

// TODO Really add the students
var students = [];
for(var i = 0; i < 6; i++) {
    students.push(new Student({id: i}))
}

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
            activate_semantic_forms()
            circularRep('circular-svg-holder')
        })
    })

    // When clicking on "Représentaiton spatiale"
    $('#spatial-rep-tab').click(function() {
        loadPage('pages/spatial-rep.html', function() {
            activate_semantic_forms()
            spatialRep('spatial-svg-holder')
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
function activate_semantic_forms() {
    // Activating the checkboxes
    $('.ui.checkbox').checkbox()

    // Activating the radio checkboxes
    $('.ui.radio.checkbox').checkbox()
}
