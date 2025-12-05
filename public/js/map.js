// Convert Mapbox coords → Leaflet coords
const leafletCoords = [coordinates[1], coordinates[0]];  
// coordinates MUST BE PASSED FROM SERVER (same as your Mapbox code)

// 1️⃣ Create Leaflet map
const map = L.map('map').setView(leafletCoords, 9);

// 2️⃣ Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// 3️⃣ Custom red marker (optional)
const redIcon = L.icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -35]
});

// 4️⃣ Add marker WITH popup
L.marker(leafletCoords, { icon: redIcon })
    .addTo(map)
    .bindPopup(`
        <h4>${listing.title}</h4>
        <p>Exact Location provided after booking</p>
    `)
    .openPopup();
