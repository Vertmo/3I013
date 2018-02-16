/**
 * Basic JS code, used to manage dynamic elements in the page
 */
$(function() {
    // Decorating the tabs
    $('#tabs .item').click(function() {
        $('#tabs .item').removeClass('active')
        $(this).addClass('active')
    })
    $('#main-tab').click(function() {
        $('#container-div').load('pages/main.html')
    })
    $('#spatial-rep-tab').click(function() {
        $('#container-div').load('pages/spatial-rep.html', function() {
            var s1 = function(sketch) {
                sketch.setup = function() {
                    sketch.createCanvas(600, 400)
                    sketch.background(0, 0, 0)
                }
            }
            new p5(s1, 'spatial-sketch-holder')
        })
    })

    // Default tab
    $('#container-div').load('pages/main.html')
})

function load_page(page) {
}
