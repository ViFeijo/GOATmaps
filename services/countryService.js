const countryService = {
    async get(code, name) {
        let url

        if (!code || code === "-99" || code.length !== 2) {
            url = `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`
        } else {
            url = `https://restcountries.com/v3.1/alpha/${code}`
        }

        const res = await fetch(url)
        if (!res.ok) throw new Error(`País não encontrado: ${code} / ${name}`)

        const data = await res.json()
        const country = data[0]

        return {
            nome: country.name.common,
            populacao: country.population.toLocaleString("pt-BR"),
            capital: country.capital?.[0] ?? "—",
            currency: Object.keys(country.currencies)[0]
        }
    }
}

export default countryService
