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
        document.getElementById('leftPanel').style.left = "-400px";
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

    var filterNHS = ["match", ["get", "NHS"]];
    var filterNHSList = [];
    if (document.getElementById("ftNHS1").checked) {
        filterNHSList.push(1);
    }
    if (document.getElementById("ftNHS2").checked) {
        filterNHSList.push(0);
    }
    if (filterNHSList.length == 0) {
        filterNHSList.push(2);        
    }
    filterNHS.push(filterNHSList);
    filterNHS.push(true);
    filterNHS.push(false);
    if (filterNHSList.length < 2) {
        newFilter.push(filterNHS);
    }


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
    }
    filterFC.push(filterFCList);
    filterFC.push(true);
    filterFC.push(false);
    if (filterFCList.length < 6) {
        newFilter.push(filterFC);
    }
  
    var lowPCI = 0;
    var upPCI = 100;
    if (isNaN(document.getElementById("ftPCI1").value) == false) {
        if (parseInt(document.getElementById("ftPCI1").value) > 0 && parseInt(document.getElementById("ftPCI1").value) < 100) {
            lowPCI = parseInt(document.getElementById("ftPCI1").value)
        }
    }
    if (isNaN(document.getElementById("ftPCI2").value) == false) {
        if (parseInt(document.getElementById("ftPCI2").value) > 0 && parseInt(document.getElementById("ftPCI2").value) < 100) {
            upPCI = parseInt(document.getElementById("ftPCI2").value)
        }
    }
    if (lowPCI > 0) {
        var filterPCI = [">", ["get", "PCI"], lowPCI];
        newFilter.push(filterPCI);
    }
    if (upPCI <100) {
        var filterPCI=["<", ["get", "PCI"], upPCI];
        newFilter.push(filterPCI);
    }

    var filterCP;
    var filterCPList = [];
    if (document.getElementById("chkNoCP").checked) {
        filterCPList.push("");
    }
    else {
        if (document.getElementById("ftCP1").checked) {
            filterCPList.push("FAR");
        }
        if (document.getElementById("ftCP2").checked) {
            filterCPList.push("PRR");
        }
        if (document.getElementById("ftCP3").checked) {
            filterCPList.push("REC");
        }
        if (document.getElementById("ftCP4").checked) {
            filterCPList.push("CKS");
        }
        if (document.getElementById("ftCP5").checked) {
            filterCPList.push("MIC");
        }
        if (document.getElementById("ftCP6").checked) {
            filterCPList.push("SLS");
        }
    }
    if (filterCPList.length > 0) {
        var lowYear = 2005;
        var upYear = 2020;
        if (isNaN(document.getElementById("frYR").value) == false) {
            if (parseInt(document.getElementById("frYR").value) > 2005 && parseInt(document.getElementById("frYR").value) < 2020) {
                lowYear=parseInt(document.getElementById("frYR").value)
            }
        }
        if (isNaN(document.getElementById("toYR").value) == false) {
            if (parseInt(document.getElementById("toYR").value) > 2005 && parseInt(document.getElementById("toYR").value)<2020) {
                upYear = parseInt(document.getElementById("toYR").value)
            }
        }
        if (filterCPList.length == 1 && filterCPList[0] == "") {
            for (var i = lowYear; i <= upYear; i++) {
                var filterCP = ["match", ["get", "P" + i.toString().substr(-2)]];
                filterCP.push(filterCPList);
                filterCP.push(true);
                filterCP.push(false);
                newFilter.push(filterCP);
            }
        }
        else {
            var filterCPAll = ["any"];
            for (var i = lowYear; i <= upYear; i++) {
                var filterCP = ["match", ["get", "P" + i.toString().substr(-2)]];
                filterCP.push(filterCPList);
                filterCP.push(true);
                filterCP.push(false);
                filterCPAll.push(filterCP);
            }
            newFilter.push(filterCPAll);         
        }
    }

    var filterPPList = [];
    if (document.getElementById("chkNoPP").checked) {
        filterPPList.push("");
    }
    else {
        if (document.getElementById("ftPP1").checked) {
            filterPPList.push("FAR");
        }
        if (document.getElementById("ftPP2").checked) {
            filterPPList.push("PRR");
        }
        if (document.getElementById("ftPP3").checked) {
            filterPPList.push("REC");
        }
        if (document.getElementById("ftPP4").checked) {
            filterPPList.push("CKS");
        }
        if (document.getElementById("ftPP5").checked) {
            filterPPList.push("MIC");
        }
        if (document.getElementById("ftPP6").checked) {
            filterPPList.push("SLS");
        }
    }
    if (filterPPList.length > 0) {
        var filterPP = ["match", ["get", "PP"]];
        filterPP.push(filterPPList);
        filterPP.push(true);
        filterPP.push(false);
        newFilter.push(filterPP);
    }
    filter(newFilter);
}

function filter(filter) {
    map.setFilter('segments', filter);
}

function applyStyle() {
}

function changeNoCP() {
    document.getElementById("divFtCP").style.display = (document.getElementById("chkNoCP").checked ? "none" : "");
}

function changeNoPP() {
    document.getElementById("divFtPP").style.display = (document.getElementById("chkNoPP").checked ? "none" : "");
}