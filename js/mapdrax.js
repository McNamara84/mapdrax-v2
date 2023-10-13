mapboxgl.accessToken = "pk.eyJ1Ijoic2FpbGZpc2hlcyIsImEiOiJja2ZvYW8zZGEwY3hwMzJ0YWM5bmZrZnBpIn0.TNIlKhnJwqVDiS4dkNMpWg";
var newAxis = -30;
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
      map.addSource("continents", {
        type: "geojson",
        data: continents,
      });
      map.addLayer({
        id: "Kontinent",
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
  const toggleableLayerIds = ["Ruinenstadt", "Kontinent", "Länder"];

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

map.on("click", "Kontinent", function (e) {
  var url = e.features[0].properties.url; // URL der Wiki-Seite
  window.open(url, "_blank"); // Öffnet die URL in einem neuen Tab
});

map.on("click", "Länder", function (e) {
  var url = e.features[0].properties.url; // URL der Wiki-Seite
  window.open(url, "_blank"); // Öffnet die URL in einem neuen Tab
});