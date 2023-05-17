const labels = [
    '12:01',
    '12:02',
    '12:03',
    '12:04',
    '12:05',
];
const data = {
    labels: labels,
    datasets: [{
        label: 'Temperatura °C',
        backgroundColor: 'rgb(77,77,77)',
        borderColor: 'rgb(77,77,77)',
        data: [3.51, 3.93, 4.55, 3.57, 4.60, 4.01]
    }
    ]
}
const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        scales: {
            y: {
                suggestedMin: 0,
                suggestedMax: 10
            }
        },
        plugins: {
            title: {
                text: "Temperatura °C"


            },
            legend: {
                labels: {
                    font: {
                        family: "Montserrat",
                        weight: "bold"
                    }
                }
            }
        }
    }
}
const labels2 = [
    '08-09',
    '09-10',
    '10-11',
    '11-12',
    '12-13',
    '13-14',
];
const data2 = {
    labels: labels2,
    datasets: [{
        label: 'Temperatura °C',
        backgroundColor: 'rgb(77,77,77)',
        borderColor: 'rgb(77,77,77)',
        data: [2, 2.4, 3.1, 5.3, 4.2, 6.7, 7.15, 5.2, 4],
        yAxisID: 'Temperatura',
        type: 'line',
        tension: 0.4
    },
    {
        label: 'Abertura',
        backgroundColor: 'rgb(224,224,224)',
        borderColor: 'rgb(224,224,224)',
        data: [0, 10, 12, 20, 15, 35, 40, 22, 14],
        yAxisID: 'Y',
        type: 'bar'
    }
    ]

}
const config2 = {
    data: data2,
    options: {
        responsive: true,
        scales: {
            Y: {
                type: 'linear',
                position: 'left'
            },
            Temperatura: {
                beginAtZero: true,
                suggestedMax: 10,
                type: 'linear',
                position: 'right',
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    callback: function (value, index, values) {
                        return `${value} °C `
                    }
                }
            }
        },
        plugins: {
            title: {
                text: "Temperatura °C"
            },
            legend: {
                labels: {
                    font: {
                        family: "Montserrat",
                        weight: "bold"
                    }
                }
            }
        }
    }
}

const tempXtempo = new Chart(
    document.getElementById('first_chart'),
    config
)

const tempXabertura = new Chart(
    document.getElementById('second_chart'),
    config2
)
