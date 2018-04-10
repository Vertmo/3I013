/**
 * Charts loading function
 * @module charts
 * @author Basile Pesin
 */

var timeByStudentChart

/**
 * Loads the charts on the main page
 * @param order Order in which to sort the students
 */
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
    } else if(order === "temps") {
        labels = Array.apply(null, Array(maxNbStudents)).map((_, i) => [])
        for(let i=0; i<4; i++) {
            let range = Array.apply(null, Array(maxNbStudents)).map((_, i) => (i+1))
            students.filter(s => s.teacherId==(i+1)).forEach(s => labels[s.id-1].push(s.id+"e"))
            values[i] = range.map(j => events.reduce((a, s) => s.teacherId==(i+1) && s.regarde==j ? a+1 : a, 0))
            let maxValue = values[i].reduce((a, v) => Math.max(a, v), 0)
            values[i] = values[i].map(v => v/maxValue)

            // On réorganise
            let labvals = []
            for(let j=0; j<values[i].length; j++) {
                labvals.push({'label': labels[j][i], 'value': values[i][j]})
            }
            labvals.sort((lv1, lv2) => lv1['value'] < lv2['value'])
            for(let j=0; j<labvals.length; j++) {
                labels[j][i] = labvals[j]['label'] || ''
                values[i][j] = labvals[j]['value']
            }
        }
    } else {
        labels = ['Faible', 'Passable', 'Bon', 'Très Bon']
        for(let i=0; i<4; i++) {
            values[i] = [0, 0, 0, 0]
            // Seulement les etudiants de l'enseignant i+1
            let filteredStudents = students.filter(s => s.teacherId==(i+1))
            // On compte les regards sur chaque categorie d'eleve
            events.filter(e => e.teacherId==(i+1) && !isNaN(e.regarde)).forEach(e => {
                let student = $.grep(filteredStudents, (s => s.id == e.regarde))
                values[i][labels.indexOf(student[0][order])] += 1
            })
            // On normalise les valeurs par rapport au nombre d'eleves de chaque categorie
            for(let j=0; j<4; j++) {
                values[i][j] = values[i][j]/filteredStudents.filter(s => s[order] == labels[j]).length
            }
            // On normalise par rapport a la valeur max
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
    $('#gini1').html(calculateGini(1).toFixed(3))
    $('#gini2').html(calculateGini(2).toFixed(3))
    $('#gini3').html(calculateGini(3).toFixed(3))
    $('#gini4').html(calculateGini(4).toFixed(3))
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
