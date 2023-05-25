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
        data: [10.0, 11.3, 12.6, 13.6, 14.5, 17]
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
        data: [10.0, 11.3, 12.6, 13.6, 14.5, 17, 18.3, 19.6, 21.4],
        yAxisID: 'Temperatura',
        type: 'line',
        tension: 0.4
    },
    {
        label: 'Abertura',
        backgroundColor: 'rgb(224,224,224)',
        borderColor: 'rgb(224,224,224)',
        data: [9, 13, 17, 7, 11, 12, 3, 15, 14],
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
                suggestedMax: 20,
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
    document.getElementById('tempXtempo'),
    config
)
const tempXabertura = new Chart(
    document.getElementById('tempXabertura'),
    config2
)