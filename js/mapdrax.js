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
// Beschriftungen der Kontinente
var continents = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Afra",
        url: "https://de.maddraxikon.com/index.php?title=Afra",
      },
      geometry: {
        type: "Point",
        coordinates: [20, 0], // Längen- und Breitengrad
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Meeraka",
        url: "https://de.maddraxikon.com/index.php?title=Meeraka",
      },
      geometry: {
        type: "Point",
        coordinates: [-100, 45],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Amraka",
        url: "https://de.maddraxikon.com/index.php?title=Amraka",
      },
      geometry: {
        type: "Point",
        coordinates: [-47, -10],
      },
    },
  ],
};

var states = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Argentiin",
        url: "https://de.maddraxikon.com/index.php?title=Argentiin",
      },
      geometry: {
        type: "Point",
        coordinates: [-65, -35],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Bolivien",
        url: "https://de.maddraxikon.com/index.php?title=Bolivien",
      },
      geometry: {
        type: "Point",
        coordinates: [-65, -15],
      },
    },
  ],
};
// Reiseroute Matt
var travelPath = {
  type: "Feature",
  properties: {
    name: "Reiseverlauf",
  },
  geometry: {
    type: "LineString",
    coordinates: [
      [10, 46.5], // Eisgebirge / MX1
      [11.342778, 44.493889], // Bolluna / MX2
      [12.483333, 41.883333], // Rooma / MX3
      [11.25, 43.783333], // Florenz / MX4
      [9.186389, 45.4625], // Millan / MX5
      [8.1, 46.5692623], // Eisgebirge / MX6
      [6.516667, 46.45], // Kleines Meer / MX7
      [8.54226, 47.371740], // Züri / MX8
      [11.574444, 48.139722], // Ethera / MX9
      [12.37475, 51.340333], // Laabsisch / MX10
      [13.408333, 52.518611], // Beelinn / MX11
      [6.956944, 50.938056], // Coellen / MX12
      [6.083889, 50.775278], // Aarachne / MX13
      [2.351667, 48.856667], // Parii / MX14
      [4.363056, 50.843333], // Bryssels / MX15
      [1.817103, 50.93869], // Caalaj / MX16
      [1.162809, 51.08735], // Folkestone / MX16
      [-0.11832, 51.50939], // Landán / MX17, MX18
      [-1.4047, 50.9069], // Saamton / MX19
      [-3.5, 50.7], // Plymeth / MX20
      [-4.136, 50.3719], // Plymeth / MX21
      [-39.88985, 40], // Vulkaninsel / MX23
      [-74.005833, 40.712778], // Nuu'ork / MX25, MX26
      [-75.163889, 39.952222], // Phillia / MX27
      [-77.036667, 38.895], // Waashton / MX28, MX30, MX31
      [-75.734250, 36.963067], // Hykton / MX32
      [-77.036667, 38.895000], // Waashton / MX33
      [-82.5, 31], // Unterwegs zum Kennedy Space Center / MX36
      [-80.650833, 28.585278], // Kennedy Space Center / MX36
      [-82.5, 31], // Unterwegs nach Waashton / MX37
      [-77.036667, 38.895], // Waashton / MX37
      [-83.942222, 35.972778], // Godswill / MX40
      [-90.048889, 35.149444], // Memvess / MX41
      [-101.845000, 35.199167], // Amarillo / MX42
      [-103.114859, 35.2678831], // New Mexico / MX44
      [-108.734167, 35.523611], // Gallup / MX45
      [-115.136389, 36.175000], // Las Vegas / MX46
      [-117.396111, 33.953333], // Riverside / MX47
      [-118.243611, 34.052222], // El'ay / MX48
      [-118.462830, 34.238486], // San Fernando Valley / MX49
      [-80.650833, 28.585278], // Kennedy Space Center / MX50
      [32.0, -1.0], // Victoriasee / MX599
      [-77.640383, -6.5], // Peru / MX 600
      [-78.510556, -7.164444], // Cajamarca
      [-79.20201, -3.99583], // Loja
      [-78.11747, -2.30414], // Macas
      [-76.98699, -0.46623], // Puerto Francisco de Orellana
      [-78.509722, -0.218611], // Kiito
      [-75.57376, 6.244735], // Medellín
      [-77.640383, -6.5], // Peru
    ],
  },
};

// Erstellen Sie einen Puffer um Ihre Route mit der gewünschten Breite (z.B. 10km)
var routeBuffer = turf.buffer(travelPath, 45, { units: "kilometers" });
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

        // Fügen Sie ein neues Feature zum GeoJSON-Objekt hinzu
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

      // Fügen Sie die GeoJSON-Daten als Datenquelle zur Karte hinzu
      map.addSource("Ruinenstadt", {
        type: "geojson",
        data: geojson,
      });

      // Fügen Sie einen neuen Symbol-Layer zur Karte hinzu
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

  map.addSource("states", {
    type: "geojson",
    data: states,
  });
  map.addLayer({
    id: "Länder",
    type: "symbol",
    source: "states",
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-size": 14,
    },
  });
  // Reiseverlauf hinzufügen
  map.addSource("travelPath", {
    type: "geojson",
    data: travelPath,
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
  // Fügen Sie den Fog of War als Layer zur Karte hinzu
  map.addLayer({
    id: "Unentdeckte Gebiete",
    type: "fill",
    source: {
      type: "geojson",
      data: fogOfWar,
    },
    layout: {},
    paint: {
      "fill-color": "#000", // Die Farbe des Nebels
      "fill-opacity": 0.75, // Die Transparenz des Nebels
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

  // Enumerate ids of the layers.
  const toggleableLayerIds = ["Ruinenstadt", "Kontinente", "Länder", "Reiseroute Matt", "Unentdeckte Gebiete"];

  // Set up the corresponding toggle button for each layer.
  for (const id of toggleableLayerIds) {
    // Skip layers that already have a button set up.
    if (document.getElementById(id)) {
      continue;
    }

    // Create a link.
    const link = document.createElement("a");
    link.id = id;
    link.href = "#";
    link.textContent = id;
    link.className = "active";

    // Show or hide layer when the toggle is clicked.
    link.onclick = function (e) {
      const clickedLayer = this.textContent;
      e.preventDefault();
      e.stopPropagation();

      const visibility = map.getLayoutProperty(clickedLayer, "visibility");

      // Toggle layer visibility by changing the layout object's visibility property.
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
