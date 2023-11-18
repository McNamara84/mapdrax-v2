// Reiseroute Matt bis Band 24
var travelPathEuree = {
  type: "Feature",
  properties: {
    name: "Reiseverlauf Euree-Zyklus",
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
      [8.54226, 47.37174], // Züri / MX8
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
    ],
  },
};

var travelPathMeeraka = {
  type: "Feature",
  properties: {
    name: "Reiseverlauf Meeraka-Zyklus",
  },
  geometry: {
    type: "LineString",
    coordinates: [
      [-39.88985, 40], // Vulkaninsel / MX23
      [-74.005833, 40.712778], // Nuu'ork / MX25, MX26
      [-75.163889, 39.952222], // Phillia / MX27
      [-77.036667, 38.895], // Waashton / MX28, MX30, MX31
      [-75.73425, 36.963067], // Hykton / MX32
      [-77.036667, 38.895], // Waashton / MX33
      [-82.5, 31], // Unterwegs zum Kennedy Space Center / MX36
      [-80.650833, 28.585278], // Kennedy Space Center / MX36
      [-82.5, 31], // Unterwegs nach Waashton / MX37
      [-77.036667, 38.895], // Waashton / MX37
      [-80.73200871677884, 36.63124907895767], // Fort Clark / MX39
      [-83.942222, 35.972778], // Godswill / MX40
      [-90.048889, 35.149444], // Memvess / MX41
      [-101.845, 35.199167], // Amarillo / MX42
      [-103.114859, 35.2678831], // New Mexico / MX44
      [-108.734167, 35.523611], // Gallup / MX45
      [-115.136389, 36.175], // Las Vegas / MX46
      [-117.396111, 33.953333], // Riverside / MX47
      [-118.243611, 34.052222], // El'ay / MX48
      [-118.46283, 34.238486], // San Fernando Valley / MX49
      [-80.650833, 28.585278], // Kennedy Space Center / MX50
    ],
  },
};

// Reiseroute Matt bis Band 74
var travelPathExpedition = {
  type: "Feature",
  properties: {
    name: "Reiseverlauf Expedition-Zyklus",
  },
  geometry: {
    type: "LineString",
    coordinates: [
      [-101.845, 35.199167], // Amarillo / MX51, MX53
      [-118.46283, 34.238486], // San Fernando Valley / MX53, MX54
      [-119.79, 36.78], // Fresno / MX57
      [-122.4192, 37.7793], // Sub'Sisco / MX58, MX59
      [-122.681944, 45.520000], // Pootland / MX60
      [-113.493660, 53.540960], // Edmonton / MX61
      [-139.424572247722, 63.32096616474804], // Citysphere 01 / MX65
      [-120.584167, 65.924722], // Great Bear Lake / MX66
      [-134.883333, 67.433333], // Fort McPherson / MX67
      [-136.9, 67.583333], // Richardson Mountains / MX67
      [-145.256389, 66.567500], // Fort Yukon / MX69
      [-168.090287, 65.636793], // Berbow / MX70
      [-179.999, 62.0], // in Richtung Neu-Baltimore / MX73
    ],
  },
};

// Reiseroute Matt bis Band 99
var travelPathKratersee = {
  type: "Feature",
  properties: {
    name: "Reiseverlauf Kratersee-Zyklus",
  },
  geometry: {
    type: "LineString",
    coordinates: [
      [179.999, 62.0], // in Richtung Neu-Baltimore / MX73
      [159.97622121768967, 53.16198262047068], // Neu-Baltimore / MX73
      [129.52098832685698, 62.1400603569141], // Kristallfestung / MX79
      [72.5610, 66.3830], // Nydda / MX85
      [58.0, 56.25], // Perm / MX86
      [37.616667, 55.750000], // Moska / MX88
      [21.033333, 52.216667], // Warza / MX91
      [13.408333, 52.518611], // Beelinn / MX93
      [9.993333, 53.550556], // Ambuur / MX95
      [4.890444, 52.370197], // Amerdaam / MX96
      [-0.118320, 51.509390], // London / MX97
      [-1.549167, 53.799722], // Leeds / MX98
    ],
  },
};

// Reiseroute Matt bis Band 124
var travelPathDaamuren = {
  type: "Feature",
  properties: {
    name: "Reiseverlauf Daa'muren-Zyklus",
  },
  geometry: {
    type: "LineString",
    coordinates: [
      [-0.118320, 51.509390], // London / MX100
      [-28.367222, 38.481111], // Pico / MX101
      [-6.265833, 53.3425], // Dabblin / MX102
      [-4.136000, 50.371900], // Plymeth / MX103
      [18.954451, 69.651827], // Eilov Duum / MX105
      [2.351667, 48.856667], // Parii / MX107
      [4.841389, 45.758889], // Liion / MX109
      [9.186389, 45.462500], // Millan / MX112
      [-0.11832, 51.50939], // London / MX112
      [-3.27260063731439, 51.562161509689105], // Royal Institute for Neurological Disorders / MX113
      [16.373056, 48.208333], // Weean / MX115
      [21.918333, 48.757500], // Michalovce / MX116
      [37.616667, 55.750000], // Moska / MX118
      [33.372500, 46.776000], // Dnipro Stausee / MX119
      [13.408333, 52.518611], // Beelinn / MX120
      [12.578745, 55.675706], // Kobenhachen / MX121
      [6.083889, 50.774694], // Aarachnodom / MX123
      [-0.11832, 51.50939], // London / MX124
    ],
  },
};

// Reiseroute Matt bis Band 124
var travelPathWandler = {
  type: "Feature",
  properties: {
    name: "Reiseverlauf Wandler-Zyklus",
  },
  geometry: {
    type: "LineString",
    coordinates: [
      [-0.11832, 51.50939], // London / MX125
      [-2.72468420033478, 55.164070691306755], // Verbotenes Land / MX 126
      [1.840217, 53.743833], // Vernon / MX 129
      [71.23919692917, 51.14268332856136], // Westliches Ufer des Kratersees / MX 130
      [-5.353333, 36.138333], // Gibraltar / MX 133
      [13.408333, 52.518611], // Beelinn / MX135
      [24.791667, 46.220556], // Schäßburg / MX136
      [-1.644167, 42.818333], // Pamplona / MX138
      [139.774444, 35.683889], // Tokio / MX140
      [35.924167, 56.862500], // Tver / MX142
      [34.9310, 56.5085], // Tver / MX142
      [-0.11832, 51.50939], // London / MX147
      [-101.845, 35.199167], // Amarillo / MX148
    ],
  },
};

/*
var travelPathAmraka = {
  type: "Feature",
  properties: {
    name: "Reiseverlauf Amraka-Zyklus",
  },
  geometry: {
    type: "LineString",
    coordinates: [
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
};*/
