// Inisialisasi peta
const map = L.map('map').setView([0.8890438, 104.1346073], 10);

// Basemap OSM
const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Basemap Google Maps
const baseMapGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: 'Map by <a href="https://maps.google.com/">Google</a>',
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Basemap Google Satellite
const baseMapSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: 'Satellite by <a href="https://maps.google.com/">Google</a>',
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Tambahkan salah satu basemap secara default
basemapOSM.addTo(map);

// Tombol "Home"
const homeControl = L.control({ position: 'topleft' });
homeControl.onAdd = function(map) {
  const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  div.innerHTML = '🏠';
  div.style.backgroundColor = 'white';
  div.style.width = '30px';
  div.style.height = '30px';
  div.style.lineHeight = '30px';
  div.style.textAlign = 'center';
  div.style.cursor = 'pointer';
  div.title = 'Kembali ke Home';
  div.onclick = function() {
    map.setView([0.8890438, 104.1346073], 10); // koordinat awal
  };
  return div;
};
homeControl.addTo(map);

// Fitur "My Location"
L.control.locate({
  position: 'topleft',
  flyTo: true,
  strings: {
    title: "Temukan lokasiku"
  },
  locateOptions: {
    enableHighAccuracy: true
  }
}).addTo(map);

// Membuat LayerGroup untuk penggunaan lahan 2018
const PL18 = new L.LayerGroup();

// Memuat GeoJSON penggunaan lahan 2018

// Membuat LayerGroup untuk batas admin kelurahan
const adminKelurahanAR = new L.LayerGroup();
$.getJSON("asset/data-spasial/adminkelurahan.geojson", function (data) {
    L.geoJSON(data, {
        style: {
            color: "black",
            weight: 2,
            opacity: 1,
            dashArray: '3,3,20,3,20,3,20,3,20,3,20',
            lineJoin: 'round'
        }
    }).addTo(adminKelurahanAR);
    adminKelurahanAR.addTo(map);
});

const PL1 = new L.LayerGroup();
$.getJSON("asset/data-spasial/spr23.geojson", function (data) {
    L.geoJSON(data, {
        style: function(feature) {
            switch (feature.properties.TL) {
                case 'BADAN AIR':
                    return { fillColor: "#00FFFF", fillOpacity: 0.8, weight: 0.5, color: "#808080" };
                case 'BANGUNAN':
                    return { fillColor: "#FF0000", fillOpacity: 0.8, weight: 0.5, color: "#4065EB" };
                case 'HUTAN':
                    return { fillColor: "#38A800", fillOpacity: 0.8, weight: 0.5, color: "#38A800" };
                case 'PERKEBUNAN':
                    return { fillColor: "#E9FFBE", fillOpacity: 0.8, weight: 0.5, color: "#E9FFBE" };
                case 'LAHAN KOSONG':
                    return { fillColor: "#FFFFFF", fillOpacity: 0.8, weight: 0.5, color: "#000000" };
                default:
                    return { fillColor: "#CCCCCC", fillOpacity: 0.5, color: "#999999" };
            }
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<b>Tutupan Lahan 18: </b>' + feature.properties.REMARK);
        }
    }).addTo(PL1);
    PL1.addTo(map);
});
// LayerGroup untuk tutupan lahan
const PL2 = new L.LayerGroup();
$.getJSON("asset/data-spasial/spr18.geojson", function (data) {
    L.geoJSON(data, {
        style: function(feature) {
            switch (feature.properties.Class_name) {
                case 'Badan Air':
                    return { fillColor: "#00FFFF", fillOpacity: 0.8, weight: 0.5, color: "#808080" };
                case 'Bangunan':
                    return { fillColor: "#FF0000", fillOpacity: 0.8, weight: 0.5, color: "#4065EB" };
                case 'Hutan':
                    return { fillColor: "#38A800", fillOpacity: 0.8, weight: 0.5, color: "#38A800" };
                case 'Perkebunan':
                    return { fillColor: "#E9FFBE", fillOpacity: 0.8, weight: 0.5, color: "#E9FFBE" };
                case 'Lahan Kosong':
                    return { fillColor: "#FFFFFF", fillOpacity: 0.8, weight: 0.5, color: "#000000" };
                default:
                    return { fillColor: "#CCCCCC", fillOpacity: 0.5, color: "#999999" };
            }
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<b>Tutupan Lahan 23: </b>' + feature.properties.REMARK);
        }
    }).addTo(PL2);
    PL2.addTo(map);
});

// Layer control
const baseMaps = {
    "OpenStreetMap": basemapOSM,
    "Google Maps": baseMapGoogle,
    "Google Satellite": baseMapSatellite
};
const overlayMaps = {
    "Tutupan Lahan 23": PL1,
    "Tutupan Lahan 18": PL2
};
L.control.layers(baseMaps, overlayMaps).addTo(map);

// Legenda
let legend = L.control({ position: "topright" });
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML =
        '<p style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">Legenda</p>' +
        '<div style="background-color; height: 10px;"></div>Hutan<br>' +
        '<div style="background-color: #38A800; height: 10px;"></div>Badan Air<br>' +
        '<div style="background-color: #00FFFF; height: 10px;"></div>Bangunan<br>' +
        '<div style="background-color: #FF0000; height: 10px;"></div>Perkebunan<br>' +
        '<div style="background-color: #E9FFBE; height: 10px;"></div>Lahan Kosong<br>' +
        '<div style="background-color: #FFFFFF; height: 10px;"></div><br>';
    return div;
};
legend.addTo(map);
