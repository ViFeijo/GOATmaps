let map
let currentMode = "clima"

export function initMap(onCountryClick, onWeatherClick) {
    map = L.map('map').setView([-14.235, -51.9253], 2)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap & Carto'
    }).addTo(map)

    map.on("click", (e) => {
        if (currentMode !== "clima") return

        const { lat, lng } = e.latlng
        onWeatherClick({ lat, lng })
    })

    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(res => res.json())
        .then(data => {
            L.geoJSON(data, {
                onEachFeature: (feature, layer) => {
                    layer.on("click", () => {
                        if (currentMode !== "economia") return

                        onCountryClick({
                            name: feature.properties.name,
                            code: feature.properties.iso_a2
                        })
                    })
                }
            }).addTo(map)
        })
}

export function setMapMode(mode) {
    currentMode = mode
}