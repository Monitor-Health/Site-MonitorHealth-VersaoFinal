var values = [];
window.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch('/medidas/ultimas');
    values = await response.json();
    createFirstChart(values);
    createSecondChart(values);
});


function createFirstChart(values){
    var times = [];
    values.forEach(d => {
        var hourAndSec = new Date(d.dt_hora).getHours() + ":0" + new Date(d.dt_hora).getMinutes();
        times.push(hourAndSec);
    })
    var temperatures = [];
    values.forEach(d => {
        if (d.fkSensor == 2) {
            temperatures.push(d.valor);
        } 
    })

    const labels = times;
    const data = {
        labels: labels,
        datasets: [{
            label: 'Temperatura °C',
            backgroundColor: 'rgb(77,77,77)',
            borderColor: 'rgb(77,77,77)',
            data: temperatures
        }]
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
    new Chart(
        document.getElementById('first_chart'),
        config
    )
}


function createSecondChart(values){
    var times = [];
    values.forEach(d => {
        var hourAndSec = new Date(d.dt_hora).getHours() + ":0" + new Date(d.dt_hora).getMinutes();
        times.push(hourAndSec);
    })
    var temperatures = [];
    var isPresent = [];
    values.forEach(d => {
        if (d.fkSensor == 2) {
            temperatures.push(d.valor);
        }else{
            isPresent.push(d.valor);
        }
    })

    const labels2 = times;
    const data2 = {
        labels: labels2,
        datasets: [{
                label: 'Temperatura °C',
                backgroundColor: 'rgb(77,77,77)',
                borderColor: 'rgb(77,77,77)',
                data: temperatures,
                yAxisID: 'Temperatura',
                type: 'line',
                tension: 0.4
            },
            {
                label: 'Abertura',
                backgroundColor: 'rgb(224,224,224)',
                borderColor: 'rgb(224,224,224)',
                data: isPresent,
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
    
    new Chart(
        document.getElementById('second_chart'),
        config2
    )
}