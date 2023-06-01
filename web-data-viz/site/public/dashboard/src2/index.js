document.getElementById("profile-name").value = `Olá, ${sessionStorage.getItem("EMAIL_USUARIO")}`
document.getElementById("permission").value = `${() => {
    
    if (sessionStorage.getItem("PERMISSAO") == 1){
        return "administrador"
    } else {
        return "básico"
    }

}
    }`

const data = new Date()
const dia = String(data.getDate()).padStart(2, '0')
const mes = String(data.getMonth() + 1).padStart(2, '0')
const ano = data.getFullYear()
const hora = String(data.getHours()).padStart(2, '0')
const minutos = String(data.getMinutes()).padStart(2, '0')
const segundos = String(data.getSeconds()).padStart(2, '0')
dataAtual.innerHTML = `${dia}/${mes}/${ano} - ${hora}:${minutos}:${segundos}`

var freezer = 1;
var firstChart = document.getElementById('first_chart');
var secondChart = document.getElementById('second_chart');

var totalAberturasFreezer1 = 0;
var totalAberturasFreezer2 = 0;
var totalAberturasFreezer3 = 0;
var totalAberturasFreezer4 = 0;
var totalAberturasFreezer5 = 0;

async function updateDash(firstChart, secondChart) {
    showAlerts();
    freezer = Number(input_freezer.value)
    var temperaturas = [];
    var isPresent = [];
    const resposta = await fetch(`/medidas/ultimas/${freezer}`);
    const dados = await resposta.json();

    var soma = 0;
    var temperaturas = [];
    for (var i = 0; i < dados.length; i++) {
        var dado = dados[i]
        if (dado.tipo == 1) {
            if (dado.fkidSensor == 1) {
                if (dado.valor == 1) {
                    totalAberturasFreezer1++;
                }
            } else if (dado.fkidSensor == 2) {
                if (dado.valor == 1) {
                    totalAberturasFreezer2++;
                }
            } else if (dado.fkidSensor == 3) {
                if (dado.valor == 1) {
                    totalAberturasFreezer3++;
                }
            } else if (dado.fkidSensor == 4) {

                if (dado.valor == 1) {
                    totalAberturasFreezer4++;
                }

            } else if (dado.fkidSensor == 5) {
                if (dado.valor == 1) {
                    totalAberturasFreezer5++;
                }

            }
        } else {
            soma += dado.valor;
            if (dado.fktipoSensor == 2) {
                temperaturas.push(dado.valor);
            }
        }
    }

    var media = soma / dados.length;
    if (media >= 8 || media <= 2) {
        indicator_avg_temp.classList.remove("warning");
        indicator_avg_temp.classList.add("danger");

    } else {
        indicator_avg_temp.classList.remove("danger");
        indicator_avg_temp.classList.remove("warning");
        indicator_avg_temp.classList.add("success");
    }

    if (freezer == 1) {
        measurement.innerHTML = totalAberturasFreezer1;
    } else if (freezer == 2) {
        measurement.innerHTML = totalAberturasFreezer2;
    } else if (freezer == 3) {
        measurement.innerHTML = totalAberturasFreezer3;
    } else if (freezer == 4) {
        measurement.innerHTML = totalAberturasFreezer4;
    } else {
        measurement.innerHTML = totalAberturasFreezer5;
    }
    console.log(temperaturas);
    current_temp.innerHTML = temperaturas[temperaturas.length - 1].toFixed(2);
    avg.innerHTML = media.toFixed(2);

    var times = []
    for (let i = dados.length; i > 0; i--) {
        var value = dados[i - 1];
        if (value.fktipoSensor == 2) {
            times.push(parseDate(new Date(value.dt_hora)));
        }
    }

    var temperaturas = [];
    for (let i = dados.length; i > 0; i--) {
        var value = dados[i - 1];
        if (value.fktipoSensor == 2) {
            temperaturas.push(value.valor);
        }
    }
    var isPresent = [];
    for (let i = 0; i < dados.length; i++) {
        var value = dados[i];
        if (value.fktipoSensor == 1) {
            if (value.valor == 1) {
                isPresent.push(value.valor);
            }
        }
    }
    firstChart.config.data.labels.splice(0, 1);
    firstChart.data.datasets[0].data.splice(0, 1);

    secondChart.config.data.labels.splice(0, 1);
    secondChart.data.datasets[0].data.splice(0, 1);

    firstChart.data.datasets[0].data = temperaturas;
    firstChart.config.data.labels = times;
    secondChart.data.datasets[0].data = temperaturas;
    secondChart.data.datasets[1].data = isPresent;
    secondChart.config.data.labels = times;
    firstChart.update();
    secondChart.update();
    setTimeout(() => updateDash(firstChart, secondChart), 1000)
}

window.addEventListener("DOMContentLoaded", async () => {
    if (sessionStorage.length == 0) {
        window.location = "../index.html";
    }
    const resposta = await fetch(`/medidas/ultimas/${freezer}`);
    const dados = await resposta.json();
    createFirstChart(dados);
    createSecondChart(dados);
    updateDash();
});

async function showAlerts() {
    const response = await fetch('/medidas/tempo-real');
    const data = await response.json();
    const temperaturasTodosFreezer = [];
    const alertas = []
    data.forEach(dado => {
        if (dado.fktipoSensor == 2) {
            temperaturasTodosFreezer.push({ temperatura: dado.valor, freezer: dado.fkidSensor });
        }
    });
    for (var i = temperaturasTodosFreezer.length - 1; i > temperaturasTodosFreezer.length - 6; i--) {
        var ultimaTemperatura = temperaturasTodosFreezer[i].temperatura;
        var ultimoFreezer = temperaturasTodosFreezer[i].freezer;
        if (ultimaTemperatura > 8) {
            alertas.push({
                title: `Freezer: ${ultimoFreezer}, Derretendo`,
                timer: 3000,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                color: "white",
                background: "red"
            });
        } else if (ultimaTemperatura >= 6.27 && ultimaTemperatura <= 8) {
            alertas.push({
                title: `Freezer: ${ultimoFreezer}, Emergência`,
                timer: 3000,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                color: "white",
                background: "pink"
            });
        } else if (ultimaTemperatura >= 5.09 && ultimaTemperatura <= 6.26) {
            alertas.push({
                title: `Freezer: ${ultimoFreezer}, Quente`,
                timer: 3000,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                color: "white",
                background: "yellow"
            })
        } else if (ultimaTemperatura >= 2 && ultimaTemperatura <= 3.37) {
            alertas.push({
                title: `Freezer: ${ultimoFreezer}, Frio`,
                timer: 3000,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                color: "white",
                background: "lightblue"
            });
        } else if (ultimaTemperatura < 2) {
            alertas.push({
                title: `Freezer: ${ultimoFreezer}, Congelante`,
                timer: 3000,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                color: "white",
                background: "blue"
            })

        }
    }
    Swal.queue(alertas)
}


function createFirstChart(values) {

    var times = []
    for (let i = values.length; i > 0; i--) {
        var value = values[i - 1];
        if (value.tipo == 2) {
            times.push(parseDate(new Date(value.dt_hora)));
        }
    }

    var temperatures = [];
    for (let i = values.length; i > 0; i--) {
        var value = values[i - 1];
        if (value.fktipoSensor == 2) {
            temperatures.push(value.valor);
        }
    }

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
                },
                x: {
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

    var ctx = document.getElementById('first_chart');
    firstChart = new Chart(ctx, config)
}

function createSecondChart(values) {

    var times = []
    for (let i = values.length; i > 0; i--) {
        var value = values[i - 1];
        if (value.fktipoSensor == 2) {
            times.push(parseDate(new Date(value.dt_hora)));
        }
    }

    var temperatures = [];
    for (let i = values.length; i > 0; i--) {
        var value = values[i - 1];
        if (value.fktipoSensor == 2) {
            temperatures.push(value.valor);
        }
    }
    var isPresent = [];
    for (let i = values.length; i > 0; i--) {
        var value = values[i - 1];
        if (value.fktipoSensor == 1) {
            if (value.valor == 1) {
                isPresent.push(value.valor);
            }
        }
    }

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

    var ctx = document.getElementById('second_chart');
    secondChart = new Chart(ctx, config2)
}

function parseDate(data) {
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = data.getFullYear()
    const hora = String(data.getHours()).padStart(2, '0')
    const minutos = String(data.getMinutes()).padStart(2, '0')
    const segundos = String(data.getSeconds()).padStart(2, '0')
    dataAtual.innerHTML = `${dia}/${mes}/${ano} - ${hora}:${minutos}:${segundos}`
    return `${hora}:${minutos}:${segundos}`;
}