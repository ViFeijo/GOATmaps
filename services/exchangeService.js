import apiConfig from "../config/apiConfig.js"

const exchangeService = {
    async get(currency) {
        const { key, baseUrl } = apiConfig.exchangeRate
        const res = await fetch(`${baseUrl}/${key}/latest/USD`)
        const data = await res.json()

        const rate = data.conversion_rates[currency]

        return {
            cambio: rate
                ? `1 USD = ${rate.toFixed(2)} ${currency}`
                : "Câmbio indisponível"
        }
    }
}

export default exchangeService
