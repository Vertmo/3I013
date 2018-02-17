/**
 * Basic JS code, used to manage dynamic elements in the page
 */
var active_page;

$(function() {
    // Decorating the tabs
    $('#tabs .item').click(function() {
        $('#tabs .item').removeClass('active')
        $(this).addClass('active')
    })

    // When clicking on "Résumé"
    $('#main-tab').click(function() {
        load_page('pages/main.html', null)
    })

    // When clicking on "Timelines"
    $('#timelines-tab').click(function() {
        load_page('pages/timelines.html', null)
    })

    // When clicking on "Représentation circulaire"
    $('#circular-rep-tab').click(function() {
        load_page('pages/circular-rep.html', null)
    })

    // When clicking on "Représentaiton spatiale"
    $('#spatial-rep-tab').click(function() {
        load_page('pages/spatial-rep.html', function() {
            new p5(spatialSketch, 'spatial-sketch-holder')
        })
    })

    // Default : main tab
    load_page('pages/main.html', null)
})

function load_page(page, func) {
    // If the page is already loaded, why reload it ?
    if(active_page === page) return
    $('#container-div').load(page, func)
    active_page = page;
}
