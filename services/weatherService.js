const weatherService = {
    async get(lat, lng) {
        const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "pt-BR" } }
        )
        const geoData = await geoRes.json()

        const lugar =
            geoData.address?.city ||
            geoData.address?.town ||
            geoData.address?.village ||
            geoData.address?.county ||
            geoData.address?.state ||
            geoData.address?.country ||
            `${lat.toFixed(2)}, ${lng.toFixed(2)}`

        const pais = geoData.address?.country ?? ""

        // clima com Open-Meteo
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weathercode&timezone=auto`
        )
        const weatherData = await weatherRes.json()

        const temp = weatherData.current.temperature_2m
        const code = weatherData.current.weathercode

        return {
            pais: pais ? `${lugar}, ${pais}` : lugar,
            temperatura: temp,
            descricao: interpretarCodigo(code)
        }
    }
}

function interpretarCodigo(code) {
    if (code === 0) return "Céu limpo ☀️"
    if (code <= 2) return "Parcialmente nublado 🌤️"
    if (code === 3) return "Nublado ☁️"
    if (code <= 49) return "Névoa / neblina 🌫️"
    if (code <= 59) return "Garoa 🌦️"
    if (code <= 69) return "Chuva 🌧️"
    if (code <= 79) return "Neve 🌨️"
    if (code <= 82) return "Pancadas de chuva 🌦️"
    if (code <= 86) return "Neve forte 🌨️"
    if (code <= 99) return "Tempestade ⛈️"
    return "—"
}

export default weatherService