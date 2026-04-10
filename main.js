import { initMap, setMapMode, flyTo, plotarFosseis } from "./components/map.js"
import { renderClima, renderEconomia, renderFossilInfo, renderFosseis } from "./components/panel.js"
import { buscar } from "./utils/searchHelper.js"

import weatherService from "./services/weatherService.js"
import countryService from "./services/countryService.js"
import exchangeService from "./services/exchangeService.js"
import newsService from "./services/newsService.js"
import fossilService from "./services/fossilService.js"

let mode = "clima"

initMap(onCountryClick, onWeatherClick, onDinoClick)

document.getElementById("climaTab").onclick = () => setMode("clima")
document.getElementById("economiaTab").onclick = () => setMode("economia")
//document.getElementById("dinoTab").onclick = () => setMode("dino")
/*
async function setMode(newMode) {
    mode = newMode
    setMapMode(mode)

    if (newMode !== "dino") {
        const fosseis = await fossilService.get()
        plotarFosseis(fosseis, onFossilClick)
        renderFosseis([])
    }else{
        plotarFosseis([], null)
    }

    document.getElementById("climaTab").classList.toggle("active", mode === "clima")
    document.getElementById("economiaTab").classList.toggle("active", mode === "economia")
    document.getElementById("dinoTab").classList.toggle("active", mode === "dino")
}*/
const searchInput = document.getElementById("searchInput")
const searchResults = document.getElementById("searchResults")
let searchTimeout = null

function setMode(newMode) {
    mode = newMode
    setMapMode(mode)

    document.getElementById("climaTab").classList.toggle("active", mode === "clima")
    document.getElementById("economiaTab").classList.toggle("active", mode === "economia")
}
searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout)
    const query = searchInput.value.trim()

    if (query.length < 3) {
        searchResults.innerHTML = ""
        searchResults.classList.add("hidden")
        return
    }

    searchTimeout = setTimeout(async () => {
        const resultados = await buscar(query)
        renderSearchResults(resultados)
    }, 400)
})

function renderSearchResults(resultados) {
    searchResults.innerHTML = ""
    if (resultados.length === 0) { searchResults.classList.add("hidden"); return }

    resultados.forEach(r => {
        const li = document.createElement("li")
        li.innerHTML = `
            <span class="search-tipo">${r.tipo}</span>
            <span class="search-nome">${r.nome}</span>
        `
        li.onclick = () => {
            const zoom = r.tipo === "país" ? 4 : r.tipo === "estado" ? 6 : 10
            flyTo(r.lat, r.lng, zoom)
            searchInput.value = ""
            searchResults.classList.add("hidden")
        }
        searchResults.appendChild(li)
    })
    searchResults.classList.remove("hidden")
}

document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchWrapper")) searchResults.classList.add("hidden")
})
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
async function onDinoClick(country) {
    const fosseis = await fossilService.get(country.code)
    renderFosseis([])   // limpa e mostra "clique numa bolinha"
    plotarFosseis(fosseis, onFossilClick)
}
function onFossilClick(fossil) {
    renderFossilInfo(fossil)
}