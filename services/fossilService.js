
const fossilService = {
    async get(countryCode = null) {
        const filtroPais = countryCode ? `&country=${countryCode}` : "";
        const res = await fetch(
            `https://paleobiodb.org/data1.2/occs/list.json?country=${countryCode}&base_name=Dinosauria&show=coords&limit=50`
        )
        const data = await res.json()
        return data.records ?? []
    }
}

export default fossilService