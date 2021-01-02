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
				'line-width': 2,
				'line-color': '#f31616'
			},
			'layout': {}
		});
	}