/**
 * Charts loading function
 * @module charts
 * @author Basile Pesin
 */

/**
 * Loads the charts on the main page
 * @param order Order in which to sort the students
 */

var timeByStudentChart

function loadCharts(order) {
    let maxNbStudents = students.reduce((a, s) => Math.max(a, s.id), 0)
    let labels
    let values = [[],[],[],[]]
    if(order === 'num') {
        labels = Array.apply(null, Array(maxNbStudents)).map((_, i) => (i+1) + "e")
        for(let i=0; i<4; i++) {
            let range = Array.apply(null, Array(maxNbStudents)).map((_, i) => (i+1))
            values[i] = range.map(j => events.reduce((a, s) => s.teacherId==(i+1) && s.regarde==j ? a+1 : a, 0))
            let maxValue = values[i].reduce((a, v) => Math.max(a, v), 0)
            values[i] = values[i].map(v => v/maxValue)
        }
    } else {
        labels = Array.apply(null, Array(maxNbStudents)).map((_, i) => [[],[],[],[]])
        for(let i=0; i<4; i++) {
            let sortedStudents = students.filter(s => s.teacherId==(i+1)).sort((s1, s2) => niveauValue(s1[order]) > niveauValue(s2[order]))
            for(let j=0; j<sortedStudents.length; j++) labels[j][i] = sortedStudents[j].id + 'e'
            values[i] = sortedStudents.map(s => events.reduce((a, e) => e.teacherId==(i+1) && e.regarde==s.id ? a+1 : a, 0))
            let maxValue = values[i].reduce((a, v) => Math.max(a, v), 0)
            values[i] = values[i].map(v => v/maxValue)
        }
    }
    let ctx = $('#timeByStudentChart')
    if(timeByStudentChart) timeByStudentChart.destroy()
    timeByStudentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label:'EN1',
                data: values[0],
                backgroundColor: 'rgba(255, 0, 0, 0.4)',
                borderColor: 'rgba(255, 0, 0, 1)'
            },
            {
                label:'EN2',
                data: values[1],
                backgroundColor: 'rgba(55, 255, 30, 0.4)',
                borderColor: 'rgba(55, 255, 30, 1)'
            },
            {
                label:'EN3',
                data: values[2],
                backgroundColor: 'rgba(0, 0, 255, 0.4)',
                borderColor: 'rgba(0, 0, 255, 1)'
            },
            {
                label:'EN4',
                data: values[3],
                backgroundColor: 'rgba(255, 255, 0, 0.4)',
                borderColor: 'rgba(255, 255, 0, 1)'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    })
}

/**
 * Versions numérique des niveaux (textuels) des élèves
 * @param string le niveau (textuel)
 * @return la valeur numérique
 */
function niveauValue(string) {
    if(string==='Faible') return 0
    if(string==='Passable') return 1
    if(string==='Bon') return 2
    return 3
}

/**
 * Displays all the Gini coefficients
 */
function displayGinis() {
    $('#gini1').html(calculateGini(1))
    $('#gini2').html(calculateGini(2))
    $('#gini3').html(calculateGini(3))
    $('#gini4').html(calculateGini(4))
}

/**
 * Calculates the Gini coefficient of a teacher
 * @param teacherId the id of the teacher we're calculating the Gini coefficient of
 * @return the Gini coefficient
 */
function calculateGini(teacherId) {
    let filteredStudents = students.filter(s => s.teacherId == teacherId)
    let filteredEvents = events.filter(e => e.teacherId == teacherId)
    let values = filteredStudents.map(s => 0)
    filteredEvents.forEach(e => {
        if(!isNaN(e.regarde)) values[e.regarde-1] += 1
    })
    values = values.sort((x, y) => x > y)
    let n = values.length
    let somme = 0
    for(let i=1; i<=n; i++) somme += (n + 1 - i)*values[i-1]
    let g = (1/n)*(n+1-2*(somme)/(values.reduce((x, y) => x + y, 0)))
    return g
}
