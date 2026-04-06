import { initMap, setMapMode } from "./components/map.js"
import { renderClima, renderEconomia } from "./components/panel.js"

import weatherService from "./services/weatherService.js"
import countryService from "./services/countryService.js"
import exchangeService from "./services/exchangeService.js"
import newsService from "./services/newsService.js"

let mode = "clima"

initMap(onCountryClick, onWeatherClick)

document.getElementById("climaTab").onclick = () => setMode("clima")
document.getElementById("economiaTab").onclick = () => setMode("economia")

function setMode(newMode) {
    mode = newMode
    setMapMode(mode)

    document.getElementById("climaTab").classList.toggle("active", mode === "clima")
    document.getElementById("economiaTab").classList.toggle("active", mode === "economia")
}

async function onWeatherClick({ lat, lng }) {
    const data = await weatherService.get(lat, lng)
    renderClima(data)
}

async function onCountryClick(country) {
    const countryData = await countryService.get(country.code, country.name)
    const exchange = await exchangeService.get(countryData.currency)
    const noticias = await newsService.get(countryData.nome)

    renderEconomia({
        nome: countryData.nome,
        populacao: countryData.populacao,
        capital: countryData.capital,
        cambio: exchange.cambio,
        currency: countryData.currency,
        noticias
    })
}