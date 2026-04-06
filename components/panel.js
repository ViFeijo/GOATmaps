import apiConfig from "../config/apiConfig.js"

let grafico = null

export function renderClima(data) {
    document.getElementById("painelpadrao").classList.add("hidden")
    document.getElementById("economiainfo").classList.add("hidden")
    document.getElementById("climainfo").classList.remove("hidden")

    document.getElementById("climaPais").textContent = data.pais
    document.getElementById("climaTemperatura").textContent = `${data.temperatura}°C`
    document.getElementById("climaDescricao").textContent = data.descricao
}

export async function renderEconomia(data) {
    document.getElementById("painelpadrao").classList.add("hidden")
    document.getElementById("climainfo").classList.add("hidden")
    document.getElementById("economiainfo").classList.remove("hidden")

    document.getElementById("nomePais").textContent = data.nome
    document.getElementById("cambio").textContent = `Câmbio: ${data.cambio}`
    document.getElementById("populacao").textContent = `População: ${data.populacao}`
    document.getElementById("capital").textContent = `Capital: ${data.capital}`

    const lista = document.getElementById("newsList")
    lista.innerHTML = ""
    if (data.noticias && data.noticias.length > 0) {
        data.noticias.forEach(n => {
            const li = document.createElement("li")
            if (typeof n === "string") {
                li.textContent = n
            } else {
                li.innerHTML = `<a href="${n.url}" target="_blank" style="color:inherit;text-decoration:none;">
                    <strong>${n.fonte}</strong><br>${n.titulo}
                </a>`
            }
            lista.appendChild(li)
        })
    }

    await renderGrafico(data.currency)
}

async function renderGrafico(currency) {
    if (!currency) return

    try {
        const { key, baseUrl } = apiConfig.exchangeRate
        const res = await fetch(`${baseUrl}/${key}/latest/USD`)
        const data = await res.json()


        const moedas = ["BRL", "EUR", "GBP", "JPY", "ARS", "CLP", "MXN", currency]
        const labels = [...new Set(moedas)]
        const valores = labels.map(m => data.conversion_rates[m] ?? 0)

        const ctx = document.getElementById("graficoMoedinha").getContext("2d")

        if (grafico) grafico.destroy()

        grafico = new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Valor em relação ao USD",
                    data: valores,
                    backgroundColor: labels.map(m =>
                        m === currency
                            ? "rgba(201, 168, 76, 0.85)"
                            : "rgba(45, 125, 95, 0.5)"
                    ),
                    borderColor: labels.map(m =>
                        m === currency ? "#C9A84C" : "#2D7D5F"
                    ),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        ticks: { color: "#9E9880" },
                        grid: { color: "rgba(201,168,76,0.1)" }
                    },
                    x: {
                        ticks: { color: "#9E9880" },
                        grid: { display: false }
                    }
                }
            }
        })
    } catch (e) {
        console.error("Erro ao gerar gráfico:", e)
    }
}