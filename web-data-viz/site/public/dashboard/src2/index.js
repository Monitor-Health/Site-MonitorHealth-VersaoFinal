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

    async function atualizarDashboard() {
        freezer = Number(input_freezer.value)   
        const resposta = await fetch(`/medidas/ultimas/${freezer}`);
        const dados = await resposta.json();
        var totalAberturas = 0;
        var soma = 0;
        var temperaturas = [];
        dados.forEach(dado => {
            soma += dado.valor;
            if (dado.tipo == 1) {
                if (dado.valor == 1) {
                    totalAberturas++;
                }
            } else {
                temperaturas.push(dado.valor);
            }
        });
        var media = soma / dados.length;
        if (media >= 8 || media <= 2) {
            indicator_avg_temp.classList.remove("warning");
            indicator_avg_temp.classList.add("danger");
            
        } else {
            indicator_avg_temp.classList.remove("danger");
            indicator_avg_temp.classList.remove("warning");
            indicator_avg_temp.classList.add("success");
        }
        measurement.innerHTML = totalAberturas;
        current_temp.innerHTML = temperaturas[temperaturas.length - 1].toFixed(2);
        avg.innerHTML = media.toFixed(2);
        updateChart(dados, firstChart, secondChart);
        setTimeout(atualizarDashboard, 1000);
    }

    function updateChart(values, chart1, chart2) {
        var temperaturas = values.map(d => {
            if (d.fktipoSensor == 2) {
                return d.valor;
            }
        });
        var isPresent = values.map(d => {
            if (d.fktipoSensor == 1) {
                if (d.valor == 1) {
                    return d.valor;
                }
            }
        });
        var times = [];
        values.forEach(d => {
            times.push(parseDate(new Date(d.dt_hora)));
        })
        chart1.data.datasets[0].data = temperaturas;
        chart2.data.datasets[0].data = temperaturas;
        chart1.labels = times;
        chart2.labels = times;
        chart2.data.datasets[1].data = isPresent;
        chart1.update();
        chart2.update();
    }

    const alerts = [];

    window.addEventListener("DOMContentLoaded", async () => {
        if (sessionStorage.length == 0) {
            window.location = "../index.html";
        }
        const resposta = await fetch(`/medidas/ultimas/${freezer}`);
        const dados = await resposta.json();
        createFirstChart(dados);
        createSecondChart(dados);
        const response = await fetch('/medidas/tempo-real');
        const data = await response.json();
        const temperaturasTodosFreezer = [];
        data.forEach(dado => {
            if(dado.fktipoSensor == 2){
                temperaturasTodosFreezer.push({ temperatura: dado.valor, freezer: dado.fkidSensor});
            }
        });
        setTimeout(atualizarDashboard, 1000);
        for(var i = temperaturasTodosFreezer.length - 1; i > temperaturasTodosFreezer.length - 6; i--){
            var ultimaTemperatura = temperaturasTodosFreezer[i].temperatura;
            var ultimoFreezer = temperaturasTodosFreezer[i].freezer;
            if(ultimaTemperatura > 8){
                alerts.push({
                    title: `Freezer: ${ultimoFreezer}, Derretendo`,
                    timer: 5000, 
                    toast: true,
                    position: 'center-end',
                    showConfirmButton: false,
                    color: "white",
                    background: "red"
                });
            }else if(ultimaTemperatura >= 6.27 && ultimaTemperatura <= 8){
                alerts.push({
                    title: `Freezer: ${ultimoFreezer}, Emergência`,
                    timer: 5000, 
                    toast: true,
                    position: 'center-end',
                    showConfirmButton: false,
                    color: "white",
                    background: "pink"
                });
            }else if(ultimaTemperatura >= 5.09 && ultimaTemperatura <= 6.26){
                alerts.push({
                    title: `Freezer: ${ultimoFreezer}, Quente`,
                    timer: 5000, 
                    toast: true,
                    position: 'center-end',
                    showConfirmButton: false,
                    color: "white",
                    background: "yellow"
                })     
            }else if(ultimaTemperatura >= 2 && ultimaTemperatura <= 3.37){
                alerts.push({
                    title: `Freezer: ${ultimoFreezer}, Frio`,
                    timer: 5000, 
                    toast: true,
                    position: 'center-end',
                    showConfirmButton: false,
                    color: "white",
                    background: "lightblue"
                });
            }else if(ultimaTemperatura < 2){
                alerts.push({
                    title: `Freezer: ${ultimoFreezer}, Congelante`,
                    timer: 5000, 
                    toast: true,
                    position: 'center-end',
                    showConfirmButton: false,
                    color: "white",
                    background: "blue"
                })
            }
            Swal.queue(alerts);
        }
        
    });

    function createFirstChart(values) {

        var times = [];
        values.forEach(d => {
            if (d.fktipoSensor == 1) {
                times.push(parseDate(new Date(d.dt_hora)));
            }
        })
        var temperatures = [];
        values.forEach(d => {
            if (d.fktipoSensor == 2) {
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
        var times = [];
        values.forEach(d => {
            if (d.fktipoSensor == 1) {
                times.push(parseDate(new Date(d.dt_hora)));
            }
        })
        var temperatures = [];
        var isPresent = [];
        values.forEach(d => {
            if (d.fktipoSensor == 2) {
                temperatures.push(d.valor);
            } else {
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