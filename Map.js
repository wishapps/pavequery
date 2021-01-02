var map;
getMapboxToken();

function getMapboxToken() {
	mapboxgl.accessToken = 'pk.eyJ1Ijoid2p3aXNoIiwiYSI6ImNramQ4eHMzdDA1ZWszMHA4azZiZWgzNXEifQ.e2-TBv6QT3YQyOeryiNsqg';  //PaveQuery		
	createMap();
}

function createMap() {
	var bounds = [
		[-77.377207, 38.745837], // Southwest coordinates
		[-76.709567, 39.036590]  // Northeast coordinates
	];
    
	// Import the map from the mapbox style created through Mapbox Studio
	map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/wjwish/ckjd9nezo7ygs19nwruw57mwl', //PaveQuery			
		center: [-77.015030, 38.896594],
		zoom: 15,
		minZoom: 11,
		maxBounds: bounds,
		attributionControl:false 
	});
	map.addControl(new mapboxgl.NavigationControl());
	map.on('load', function () {
		loadOneSegments();
	});	
}
	
function loadOneSegments() {
	map.addSource('segment-data', { 'type': 'geojson', 'data': 'https://wishapps.github.io/pavequery/PCISegments.json' });
	map.addLayer({
		'id': 'segments',
		'type': 'line',
		'source': 'segment-data',
		'paint': {
			'line-width': ["interpolate", ["linear"],  ["zoom"],  11,  1,  18,  2],
			'line-color': '#f31616'
		},
		'layout': {}
	});
}
	
var expanded = true;

function expand() {
    if (expanded) {
        document.getElementById('leftPanel').style.left = "-350px";
        document.getElementById('expandArrow').style.transform = "rotate(180deg)";
        expanded = false;
    } else {
        document.getElementById('leftPanel').style.left = "0";
        document.getElementById('expandArrow').style.transform = "rotate(0deg)";
        expanded = true;
    }
}
function applyFilter() {
    var newFilter = ["all"];
    var filterFC = ["match", ["get", "FN"]];
    var filterFCList = [];
    if (document.getElementById("ftFC1").checked) {
        filterFCList.push("Freeway");
    }
    if (document.getElementById("ftFC2").checked) {
        filterFCList.push("Other Freeway and Expressway");
    }
    if (document.getElementById("ftFC3").checked) {
        filterFCList.push("Principal Arterial");
    }
    if (document.getElementById("ftFC4").checked) {
        filterFCList.push("Minor Arterial");
    }
    if (document.getElementById("ftFC5").checked) {
        filterFCList.push("Collector");
    }
    if (document.getElementById("ftFC6").checked) {
        filterFCList.push("Local");
    }
    if (filterFCList.length == 0) {
        filterFCList.push("test");
        alert("No functional class is selected, please select at least one functional class.");
    }
    filterFC.push(filterFCList);
    filterFC.push(true);
    filterFC.push(false);

    if (filterFCList.length < 6) {
        newFilter.push(filterFC);
    }
    //if (filterFCList.length == 0) {
    //    alert("No functional class is selected, please select at least one functional class.");
    //}

    filter(newFilter);
}

function filter(filter) {
    map.setFilter('segments', filter);
}

function applyStyle() {
}