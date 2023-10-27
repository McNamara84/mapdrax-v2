mapboxgl.accessToken = "pk.eyJ1Ijoic2FpbGZpc2hlcyIsImEiOiJja2ZvYW8zZGEwY3hwMzJ0YWM5bmZrZnBpIn0.TNIlKhnJwqVDiS4dkNMpWg";
var newAxis = -30;
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
var routeBuffer = turf.buffer(travelPathEureeMeeraka, 45, { units: "kilometers" });
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
  // API-Abfrage durchführen
  fetch("https://de.maddraxikon.com/api.php?action=ask&query=[[Kategorie:Länder]]|?Koordinaten&format=json")
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
          "text-size": 18,
        },
      });
    });
  fetch("https://de.maddraxikon.com/api.php?action=ask&query=[[Kategorie:Städte in Amraka]]|?Koordinaten&format=json")
    .then((response) => response.json())
    .then((data) => {
      // Erstellen Sie ein leeres GeoJSON-Objekt
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };

      // Über die Ergebnisse iterieren
      for (const result of Object.values(data.query.results)) {
        // Koordinaten und Artikelname extrahieren
        const { lat, lon } = result.printouts.Koordinaten[0];
        const title = result.fulltext;
        const url = result.fullurl;

        // Feature zum GeoJSON-Objekt hinzufügen
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

      // Datenquelle in Karte einfügen
      map.addSource("Ruinenstadt", {
        type: "geojson",
        data: geojson,
      });

      // Symbol-Layer zur Karte hinzufügen
      map.addLayer({
        id: "Ruinenstadt",
        type: "circle",
        source: "Ruinenstadt",
        layout: {
          visibility: "visible",
        },
        paint: {
          "circle-radius": 6,
          "circle-color": "rgba(139,35,35,1)",
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
    },
  });

  // Reiseverlauf hinzufügen
  map.addSource("travelPath", {
    type: "geojson",
    data: travelPathEureeMeeraka,
  });
  map.addLayer({
    id: "Reiseroute Matt",
    type: "line",
    source: "travelPath",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#ff7f00",
      "line-width": 3,
      "line-dasharray": [1, 2], // Erstellt eine gestrichelte Linie
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
    layout: {},
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
  if (!map.getLayer("Ruinenstadt")) {
    console.log("Layer Ruinenstadt fehlt");
    return;
  }

  // Liste aller Layer für Buttons
  const toggleableLayerIds = ["Ruinenstadt", "Kontinente", "Reiseroute Matt", "Unentdeckte Gebiete", "Länder"];

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
    const layers = document.getElementById("menu");
    layers.appendChild(link);
  }
});

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

map.on("click", "Ruinenstadt", function (e) {
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
