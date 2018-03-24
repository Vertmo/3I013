/**
 * Charts loading function
 * @module charts
 * @author Basile Pesin
 */

function loadCharts() {
    let maxNbStudents = students.reduce((a, s) => Math.max(a, s.id), 0)
    let values = [[],[],[],[]]
    for(let i=0; i<4; i++) {
        let range = Array.apply(null, Array(maxNbStudents)).map((_, i) => (i+1))
        values[i] = range.map(j => events.reduce((a, s) => s.teacherId==(i+1) && s.regarde==j ? a+1 : a, 0))
        let maxValue = values[i].reduce((a, v) => Math.max(a, v), 0)
        values[i] = values[i].map(v => v/maxValue)
    }
    console.log(values)
    let ctx = $('#timeByStudentChart')
    let timeByStudentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.apply(null, Array(maxNbStudents)).map((_, i) => (i+1) + "e"),
            datasets: [{
                label:'EN1',
                data: values[0],
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderColor: 'rgba(255, 0, 0, 1)'
            },
            {
                label:'EN2',
                data: values[1],
                backgroundColor: 'rgba(55, 255, 30, 0.2)',
                borderColor: 'rgba(55, 255, 30, 1)'
            },
            {
                label:'EN3',
                data: values[2],
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                borderColor: 'rgba(0, 0, 255, 1)'
            },
            {
                label:'EN4',
                data: values[3],
                backgroundColor: 'rgba(255, 255, 0, 0.2)',
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
