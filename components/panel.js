import apiConfig from "../config/apiConfig.js"


export function renderClima(data) {
    document.getElementById("painelpadrao").classList.add("hidden")
    document.getElementById("economiainfo").classList.add("hidden")
   // document.getElementById("dinoinfo").classList.add("hidden")
    document.getElementById("climainfo").classList.remove("hidden")

    document.getElementById("climaPais").textContent = data.pais
    document.getElementById("climaTemperatura").textContent = `${data.temperatura}°C`
    document.getElementById("climaDescricao").textContent = data.descricao
}

export async function renderEconomia(data) {
    document.getElementById("painelpadrao").classList.add("hidden")
    document.getElementById("climainfo").classList.add("hidden")
  //  document.getElementById("dinoinfo").classList.add("hidden")
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
}

export function renderFossilInfo(f) {
    document.getElementById("painelpadrao").classList.add("hidden")
    document.getElementById("climainfo").classList.add("hidden")
    document.getElementById("economiainfo").classList.add("hidden")
    document.getElementById("dinoinfo").classList.remove("hidden")

    const lista = document.getElementById("dinoList")
    lista.innerHTML = ""

    const campos = [
        { label: "Nome", valor: f.nam },
        { label: "Período", valor: f.early_interval ?? f.late_interval ?? "—" },
        { label: "Ambiente", valor: f.envtype ?? "—" },
        { label: "Formação", valor: f.formation ?? "—" },
        { label: "País", valor: f.cc ?? "—" },
        { label: "Lat / Lng", valor: f.lat && f.lng ? `${parseFloat(f.lat).toFixed(2)}, ${parseFloat(f.lng).toFixed(2)}` : "—" },
    ]

    campos.forEach(({ label, valor }) => {
        if (!valor || valor === "—") return
        const li = document.createElement("li")
        li.innerHTML = `<span class="fossil-label">${label}</span><span class="fossil-valor">${valor}</span>`
        lista.appendChild(li)
    })
}

export function renderFosseis(fosseis) {
    document.getElementById("painelpadrao").classList.add("hidden")
    document.getElementById("climainfo").classList.add("hidden")
    document.getElementById("economiainfo").classList.add("hidden")
    document.getElementById("dinoinfo").classList.remove("hidden")

    const lista = document.getElementById("dinoList")
    lista.innerHTML = ""

    if (fosseis.length === 0) {
        lista.innerHTML = "<li>Clique em uma bolinha no mapa.</li>"
        return
    }
}