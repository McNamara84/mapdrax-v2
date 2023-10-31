<?php

// API URL 
$api_url = 'https://de.maddraxikon.com/api.php?action=ask&query=[[Kategorie:Maddrax-Heftromane]]|?Handlungsort|?Nummer|?Handlungsort.Koordinaten|limit%3D2000&format=json';

// API Daten als JSON laden
$json = file_get_contents($api_url);

// Daten decodieren
$data = json_decode($json, true);

// Ergebnis Array  
$results = [];

foreach ($data['query']['results'] as $title => $info) {

    if (!empty($info['printouts']['Nummer'])) {
        $nummer = substr($info['printouts']['Nummer'][0], 7);
    }

    $koordinaten = [];
    if (!empty($info['printouts']['Koordinaten'])) {
        $koordinaten = $info['printouts']['Koordinaten'];
    }

    if (isset($nummer)) {
        $results[$nummer] = $koordinaten;
    }

}

// Array als JSON speichern
$output = json_encode($results);
file_put_contents('handlungsorte.json', $output);

echo "Ergebnis gespeichert!";

?>