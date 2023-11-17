mapboxgl.accessToken = "pk.eyJ1Ijoic2FpbGZpc2hlcyIsImEiOiJja2ZvYW8zZGEwY3hwMzJ0YWM5bmZrZnBpIn0.TNIlKhnJwqVDiS4dkNMpWg";
var newAxis = -30;

// Funktion zum Laden von Bildern
function loadImage(imageUrl, iconId) {
  map.loadImage(imageUrl, (error, image) => {
    if (error) throw error;
    map.addImage(iconId, image);
  });
}

// Karte komplett abdecken für "Fog of War"
var mask = {
  type: "Polygon",
  coordinates: [
    [
      [-180, -90],
      [-180, 90],
      [180, 90],
      [180, -90],
      [-180, -90],
    ],
  ],
};

// Erstellen Sie einen Puffer um Ihre Route mit der gewünschten Breite (z.B. 10km)
var routeBuffer = turf.buffer(travelPathEuree, 45, { units: "kilometers" });
// Schneiden Sie den Puffer aus der Maske aus
var fogOfWar = turf.difference(mask, routeBuffer);

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/sailfishes/cln0c577402xz01pb8mv9140b",
  center: [-60, -5],
  zoom: 3,
  pitch: 0,
  bearing: newAxis,
});

map.on("load", () => {
  // Bilder laden
  loadImage("./handlungsortIcon.png", "icon");
  loadImage("./gebirgeIcon.png", "gebirgeIcon");
  loadImage("./bunkerIcon.png", "bunkerIcon");
  loadImage("./hydritIcon.png", "hydritIcon");
  loadImage("./ruinenstadtIcon.png", "ruinenstadtIcon");
  // Daten aus JSON-Datei laden
  fetch("./handlungsorte.json")
    .then((response) => response.json())
    .then((data) => {
      // Leeres GeoJSON-Objekt erstellen
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };

      // Über die Einträge iterieren
      Object.keys(data).forEach((key) => {
        // Koordinaten für diesen Eintrag auslesen
        const coordinates = data[key];

        // Wenn keine Koordinaten vorhanden, überspringen
        if (!coordinates.length) return;

        // Für jedes Koordinatenpaar ein Feature erstellen
        coordinates.forEach((coords) => {
          geojson.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [coords.lon, coords.lat],
            },
            properties: {
              title: key, // Beschriftung
            },
          });
        });
      });

      // Quelle und Layer zur Karte hinzufügen
      map.addSource("handlungsorte", {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
        id: "Handlungsorte",
        type: "symbol",
        source: "handlungsorte",
        layout: {
          "icon-image": "icon",
          "icon-size": 0.15, // Größe anpassen
          "text-field": ["get", "title"],
          "text-size": 10,
          visibility: "none",
        },
        paint: {
          "text-color": "rgba(255,0,0,1)",
        },
      });
    });
  map.addSource("Topo", {
    type: "raster",
    tiles: ["./v2/{z}/{x}/{y}.png"], // Im Unterordner v2 liegen die neuen Tiles
    tileSize: 256,
  });

  map.addLayer({
    id: "TopoKarte",
    type: "raster",
    source: "Topo",
    layout: {
      visibility: "none", // Layer standardmäßig ausblenden
    },
  });
  fetch("https://de.maddraxikon.com/api.php?action=ask&query=[[Kategorie:Gebirge und Berge]]|?Koordinaten|limit%3D200&format=json")
    .then((response) => response.json())
    .then((data) => {
      // Erstellen Sie ein leeres GeoJSON-Objekt
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };
      // Über die Ergebnisse iterieren
      for (const result of Object.values(data.query.results)) {
        if (result.printouts.Koordinaten && result.printouts.Koordinaten[0]) {
          // Koordinaten und Artikelname extrahieren
          const { lat, lon } = result.printouts.Koordinaten[0];

          // Überprüfe, ob 'lat' und 'lon' definiert sind
          if (lat !== undefined && lon !== undefined) {
            const title = result.fulltext;
            const url = result.fullurl;
            // ...
            geojson.features.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [lon, lat],
              },
              properties: {
                title: title,
                url: url,
              },
            });
          }
        }
      }

      // Datenquelle in Karte einfügen
      map.addSource("Gebirge", {
        type: "geojson",
        data: geojson,
      });

      // Symbol-Layer zur Karte hinzufügen
      map.addLayer({
        id: "Gebirge",
        type: "symbol",
        source: "Gebirge",
        layout: {
          "icon-image": "gebirgeIcon",
          "icon-size": 0.1, // Größe anpassen
          //"text-field": ["get", "title"],
          "text-size": 10,
          visibility: "none",
        },
        paint: {
          "text-color": "rgba(255,0,0,1)",
        },
      });
    });
  // API-Abfrage durchführen
  fetch("https://de.maddraxikon.com/api.php?action=ask&query=[[Kategorie:Länder]]|?Koordinaten|limit%3D200&format=json")
    .then((response) => response.json())
    .then((data) => {
      // Erstellen Sie ein leeres GeoJSON-Objekt
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };
      // Über die Ergebnisse iterieren
      for (const result of Object.values(data.query.results)) {
        if (result.printouts.Koordinaten && result.printouts.Koordinaten[0]) {
          // Koordinaten und Artikelname extrahieren
          const { lat, lon } = result.printouts.Koordinaten[0];

          // Überprüfe, ob 'lat' und 'lon' definiert sind
          if (lat !== undefined && lon !== undefined) {
            const title = result.fulltext;
            const url = result.fullurl;
            // ...
            geojson.features.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [lon, lat],
              },
              properties: {
                title: title,
                url: url,
              },
            });
          }
        }
      }

      // Datenquelle in Karte einfügen
      map.addSource("Länder", {
        type: "geojson",
        data: geojson,
      });

      // Symbol-Layer zur Karte hinzufügen
      map.addLayer({
        id: "Länder",
        type: "symbol",
        source: "Länder",
        layout: {
          "text-field": ["get", "title"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": 14,
          visibility: "none",
        },
      });
    });
  fetch(
    "https://de.maddraxikon.com/api.php?action=ask&query=[[Kategorie:St%C3%A4dte%20in%20Amraka]]||[[Kategorie:St%C3%A4dte%20in%20Ausala]]||[[Kategorie:St%C3%A4dte%20in%20Euree]]||[[Kategorie:St%C3%A4dte%20in%20Meeraka]]||[[Kategorie:St%C3%A4dte%20in%20Aiaa]]||[[Kategorie:St%C3%A4dte%20in%20Afra]]||[[Kategorie:St%C3%A4dte%20in%20der%20Antakis]]|?Koordinaten|limit%3D400&format=json"
  )
    .then((response) => response.json())
    .then((data) => {
      // Erstellen Sie ein leeres GeoJSON-Objekt
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };

      // Über die Ergebnisse iterieren
      for (const result of Object.values(data.query.results)) {
        // Feature zum GeoJSON-Objekt hinzufügen
        if (result.printouts.Koordinaten && result.printouts.Koordinaten.length > 0) {
          const { lat, lon } = result.printouts.Koordinaten[0];
          const title = result.fulltext;
          const url = result.fullurl;
          geojson.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [lon, lat],
            },
            properties: {
              title: title,
              url: url,
            },
          });
        }
      }

      // Datenquelle in Karte einfügen
      map.addSource("Städte", {
        type: "geojson",
        data: geojson,
      });

      // Symbol-Layer zur Karte hinzufügen
      map.addLayer({
        id: "Städte",
        type: "symbol",
        source: "Städte",
        layout: {
          "icon-image": "ruinenstadtIcon",
          "icon-offset": [0, -128],
          "icon-size": 0.15, // Größe anpassen
          //"text-field": ["get", "title"],
          "text-size": 10,
          visibility: "none",
        },
        paint: {
          "text-color": "rgba(255,0,0,1)",
        },
      });
    });

  map.addSource("continents", {
    type: "geojson",
    data: continents,
  });
  map.addLayer({
    id: "Kontinente",
    type: "symbol",
    source: "continents",
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-size": 18,
      visibility: "none",
    },
  });
  fetch("https://de.maddraxikon.com/api.php?action=ask&query=[[Kategorie:St%C3%A4dte%20der%20Hydriten]]|?Koordinaten|limit%3D400&format=json")
    .then((response) => response.json())
    .then((data) => {
      // Erstellen Sie ein leeres GeoJSON-Objekt
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };

      // Über die Ergebnisse iterieren
      for (const result of Object.values(data.query.results)) {
        // Feature zum GeoJSON-Objekt hinzufügen
        if (result.printouts.Koordinaten && result.printouts.Koordinaten.length > 0) {
          const { lat, lon } = result.printouts.Koordinaten[0];
          const title = result.fulltext;
          const url = result.fullurl;
          geojson.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [lon, lat],
            },
            properties: {
              title: title,
              url: url,
            },
          });
        }
      }

      // Datenquelle in Karte einfügen
      map.addSource("Hydritenstädte", {
        type: "geojson",
        data: geojson,
      });

      // Symbol-Layer zur Karte hinzufügen
      map.addLayer({
        id: "Hydritenstädte",
        type: "symbol",
        source: "Hydritenstädte",
        layout: {
          "icon-image": "hydritIcon",
          "icon-size": 0.25, // Größe anpassen
          //"text-field": ["get", "title"],
          "text-size": 10,
          visibility: "visible",
        },
        paint: {
          "text-color": "rgba(255,0,0,1)",
        },
      });
    });
  fetch("https://de.maddraxikon.com/api.php?action=ask&query=[[Kategorie:Bunker]]|?Koordinaten|limit%3D400&format=json")
    .then((response) => response.json())
    .then((data) => {
      // Erstellen Sie ein leeres GeoJSON-Objekt
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };

      // Über die Ergebnisse iterieren
      for (const result of Object.values(data.query.results)) {
        // Feature zum GeoJSON-Objekt hinzufügen
        if (result.printouts.Koordinaten && result.printouts.Koordinaten.length > 0) {
          const { lat, lon } = result.printouts.Koordinaten[0];
          const title = result.fulltext;
          const url = result.fullurl;
          geojson.features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [lon, lat],
            },
            properties: {
              title: title,
              url: url,
            },
          });
        }
      }

      // Datenquelle in Karte einfügen
      map.addSource("Bunker", {
        type: "geojson",
        data: geojson,
      });

      // Symbol-Layer zur Karte hinzufügen
      map.addLayer({
        id: "Bunker",
        type: "symbol",
        source: "Bunker",
        layout: {
          "icon-image": "bunkerIcon",
          "icon-size": 0.2, // Größe anpassen
          //"text-field": ["get", "title"],
          "text-size": 10,
          visibility: "none",
        },
        paint: {
          "text-color": "rgba(255,0,0,1)",
        },
      });
    });
  // Reiseverlauf hinzufügen
  // GRÜN #688000 #7b8000 #8f8000 #a28000 #b68000 #c98000 #dd8000 #f08000 #ff8000 #ff8c00 #ff9900 #ffa500 #ffb200 #ffbf00 #ffcb00 #ffd800 #ffe400 #fff000 #fffc00 #ffff00  ROT
  map.addSource("travelPathEuree", {
    type: "geojson",
    data: travelPathEuree,
  });
  map.addLayer({
    id: "Reiseroute Euree-Zyklus",
    type: "line",
    source: "travelPathEuree",
    layout: {
      "line-join": "round",
      "line-cap": "round",
      visibility: "none",
    },
    paint: {
      "line-color": "#008000",
      "line-width": 3,
      "line-dasharray": [1, 2],
    },
  });
  map.addSource("travelPathMeeraka", {
    type: "geojson",
    data: travelPathMeeraka,
  });
  map.addLayer({
    id: "Reiseroute Meeraka-Zyklus",
    type: "line",
    source: "travelPathMeeraka",
    layout: {
      "line-join": "round",
      "line-cap": "round",
      visibility: "none",
    },
    paint: {
      "line-color": "#1a8000",
      "line-width": 3,
      "line-dasharray": [1, 2],
    },
  });
  map.addSource("travelPathExpedition", {
    type: "geojson",
    data: travelPathExpedition,
  });
  map.addLayer({
    id: "Reiseroute Expedition-Zyklus",
    type: "line",
    source: "travelPathExpedition",
    layout: {
      "line-join": "round",
      "line-cap": "round",
      visibility: "none",
    },
    paint: {
      "line-color": "#2d8000",
      "line-width": 3,
      "line-dasharray": [1, 2],
    },
  });
  map.addSource("travelPathKratersee", {
    type: "geojson",
    data: travelPathKratersee,
  });
  map.addLayer({
    id: "Reiseroute Kratersee-Zyklus",
    type: "line",
    source: "travelPathKratersee",
    layout: {
      "line-join": "round",
      "line-cap": "round",
      visibility: "none",
    },
    paint: {
      "line-color": "#418000",
      "line-width": 3,
      "line-dasharray": [1, 2],
    },
  });
  map.addSource("travelPathDaamuren", {
    type: "geojson",
    data: travelPathDaamuren,
  });
  map.addLayer({
    id: "Reiseroute Daa'muren-Zyklus",
    type: "line",
    source: "travelPathDaamuren",
    layout: {
      "line-join": "round",
      "line-cap": "round",
      visibility: "none",
    },
    paint: {
      "line-color": "#548000",
      "line-width": 3,
      "line-dasharray": [1, 2],
    },
  });
  // Fog of War als Layer zur Karte hinzufügen
  map.addLayer({
    id: "Unentdeckte Gebiete",
    type: "fill",
    source: {
      type: "geojson",
      data: fogOfWar,
    },
    layout: {
      visibility: "none", // Layer standardmäßig ausblenden
    },
    paint: {
      "fill-color": "#000", // Farbe des Nebels
      "fill-opacity": 0.75, // Transparenz des Nebels
    },
  });
});

map.on("rotate", function () {
  if (map.getBearing() != newAxis) {
    map.setBearing(newAxis);
  }
});

map.on("idle", () => {
  if (!map.getLayer("Städte")) {
    console.log("Layer Städte fehlt");
    return;
  }

  // Liste aller Layer für Buttons
  const toggleableLayerIds = [
    "Kontinente",
    "Länder",
    "Gebirge",
    "Städte",
    "Bunker",
    "Hydritenstädte",
    "Reiseroute Euree-Zyklus",
    "Reiseroute Meeraka-Zyklus",
    "Reiseroute Expedition-Zyklus",
    "Reiseroute Kratersee-Zyklus",
    "Reiseroute Daa'muren-Zyklus",
    "Unentdeckte Gebiete",
    "TopoKarte",
    "Handlungsorte",
  ];

  // Button für alle Layer erstellen
  for (const id of toggleableLayerIds) {
    // Wenn Button schon vorhanden, dann diesen überspringen
    if (document.getElementById(id)) {
      continue;
    }

    // Link erstellen
    const link = document.createElement("a");
    link.id = id;
    link.href = "#";
    link.textContent = id;
    link.className = "active";

    // Aus- oder Einblenden des richtigen Layers
    link.onclick = function (e) {
      const clickedLayer = this.textContent;
      e.preventDefault();
      e.stopPropagation();
      const visibility = map.getLayoutProperty(clickedLayer, "visibility");
      if (visibility === "visible") {
        map.setLayoutProperty(clickedLayer, "visibility", "none");
        this.className = "";
      } else {
        this.className = "active";
        map.setLayoutProperty(clickedLayer, "visibility", "visible");
      }
    };

    // Setze den anfänglichen Zustand des Buttons basierend auf der Sichtbarkeit des Layers
    if (map.getLayoutProperty(id, "visibility") === "visible") {
      link.className = "active";
    } else {
      link.className = "";
    }

    const layers = document.getElementById("menu");
    layers.appendChild(link);
  }
});

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

map.on("click", "Städte", function (e) {
  var coordinates = e.features[0].geometry.coordinates.slice();
  var title = e.features[0].properties.title; // Artikelname
  var url = e.features[0].properties.url;
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML("<h3>" + title + '</h3><p><a href="' + url + '" target="_blank">Link zum Wiki</a></p>')
    .addTo(map);
});

map.on("click", "Bunker", function (e) {
  var coordinates = e.features[0].geometry.coordinates.slice();
  var title = e.features[0].properties.title; // Artikelname
  var url = e.features[0].properties.url;
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML("<h3>" + title + '</h3><p><a href="' + url + '" target="_blank">Link zum Wiki</a></p>')
    .addTo(map);
});

map.on("click", "Hydritenstädte", function (e) {
  var coordinates = e.features[0].geometry.coordinates.slice();
  var title = e.features[0].properties.title; // Artikelname
  var url = e.features[0].properties.url;
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML("<h3>" + title + '</h3><p><a href="' + url + '" target="_blank">Link zum Wiki</a></p>')
    .addTo(map);
});

map.on("click", "Kontinente", function (e) {
  var url = e.features[0].properties.url; // URL der Wiki-Seite
  window.open(url, "_blank"); // Öffnet die URL in einem neuen Tab
});

map.on("click", "Länder", function (e) {
  var url = e.features[0].properties.url; // URL der Wiki-Seite
  window.open(url, "_blank"); // Öffnet die URL in einem neuen Tab
});

map.on("click", "Gebirge", function (e) {
  var url = e.features[0].properties.url; // URL der Wiki-Seite
  window.open(url, "_blank"); // Öffnet die URL in einem neuen Tab
});

////////////////////// Koordinaten-Debugging //////////////////
/*const marker = new mapboxgl.Marker({
  draggable: true,
})
  .setLngLat([0, 0])
  .addTo(map);
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});
marker.on("drag", () => {
  const lngLat = marker.getLngLat();
  popup
    .setHTML(`Koordinaten: ${lngLat.lng.toFixed(4)}, ${lngLat.lat.toFixed(4)}`)
    .setLngLat(lngLat)
    .addTo(map);
});
marker.on("click", () => {
  popup.addTo(map);
});*/
