var map;
var disType=[];
disType.push({code:"01",type:"Alligator Cracking"});
disType.push({code:"02",type:"Bleeding"});
disType.push({code:"03",type:"Block Cracking"});
disType.push({code:"06",type:"Depression"});
disType.push({code:"10",type:"Longit. Cracking"});
disType.push({code:"11",type:"Patch/Cut"});
disType.push({code:"13",type:"Pothole"});
disType.push({code:"14",type:"Rail Crossing"});
disType.push({code:"15",type:"Rutting"});
disType.push({code:"16",type:"Shoving"});
disType.push({code:"17",type:"Slippage Cracking"});
disType.push({code:"19",type:"Raveling"});
disType.push({code:"22",type:"Corner Break"});
disType.push({code:"23",type:"Divided Slab"});
disType.push({code:"25",type:"Faulting"});
disType.push({code:"26",type:"Joint Seal Damage"});
disType.push({code:"28",type:"Linear Cracking"});
disType.push({code:"29",type:"Large Patch/Cut"});
disType.push({code:"30",type:"Small Patch"});
disType.push({code:"32",type:"Popouts"});
disType.push({code:"34",type:"Punchout"});
disType.push({code:"36",type:"Scaling/Crazing"});
disType.push({code:"37",type:"Shrikage Cracking"});
disType.push({code:"38",type:"Corner Spalling"});
disType.push({code:"39",type:"Joint Spalling"});
var maxTR=0;
document.getElementById('leftPanel').style.maxHeight=($(window).height()-50)+'px';
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
	    applyFilter();
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
        document.getElementById('leftPanel').style.left = "-405px";
		document.getElementById('expandArrow').style.left = "0";
        document.getElementById('expandArrow').style.transform = "rotate(180deg)";
        expanded = false;
    } else {
        document.getElementById('leftPanel').style.left = "0";
		document.getElementById('expandArrow').style.left = "405px";
        document.getElementById('expandArrow').style.transform = "rotate(0deg)";
        expanded = true;
    }
}
function applyFilter() {
    var newFilter = ["all"];

    if (document.getElementById("ftNHS").checked) {
        var filterNHS = ["match", ["get", "NHS"],[1],true,false];
        newFilter.push(filterNHS);
    }

    var filterFC = ["match", ["get", "FN"]];
    var filterFCList = [];
    if (document.getElementById("ftFC1").checked) {
        filterFCList.push("Interstate");
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
	
	for (var i=1; i<=maxTR; i++) {
		var minDs=parseInt(document.getElementById("fmD" + i).value);
		var maxDs=parseInt(document.getElementById("toD" + i).value);
		if (document.getElementById("tr" + i).style.display !="none" && (minDs>0 || maxDs<100)){
			var filterDS=[];
			//var filterObj = (function(disType){ return disType.tp[type] === value})			
			//disType.find(function(e) {
			//	return e.type === document.getElementById("SpTy" + i).innerText;
			//});
			var codeDS=disType.find(x => x.type === document.getElementById("SpTy" + i).innerText).code;
			if (document.getElementById("spSv" + i).innerText=="Any") {
				filterDS.push("any");
				if (minDs>0 && maxDs<100){
					filterDS.push(["all",[">=", ["get", "L" + codeDS], minDs],["<=", ["get", "L" + codeDS], maxDs]]);
					filterDS.push(["all",[">=", ["get", "M" + codeDS], minDs],["<=", ["get", "M" + codeDS], maxDs]]);
					filterDS.push(["all",[">=", ["get", "H" + codeDS], minDs],["<=", ["get", "H" + codeDS], maxDs]]);
				}
				else if (minDs>0){
					filterDS.push([">=", ["get", "L" + codeDS], minDs]);
					filterDS.push([">=", ["get", "M" + codeDS], minDs]);
					filterDS.push([">=", ["get", "H" + codeDS], minDs]);
				}
				else if (maxDs<100){
					filterDS.push(["<=", ["get", "L" + codeDS], maxDs]);
					filterDS.push(["<=", ["get", "M" + codeDS], maxDs]);
					filterDS.push(["<=", ["get", "H" + codeDS], maxDs]);
				}
				newFilter.push(filterDS);
			}
			else {
				var SvType=document.getElementById("spSv" + i).innerText.substring(0,1);
				if (minDs>0) {
					newFilter.push([">=", ["get", SvType + codeDS], minDs]);
				}
				if (maxDs>0) {
					newFilter.push(["<=", ["get", SvType + codeDS], maxDs]);
				}				
			}			
		}
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

function removeTR(idTR) {
	document.getElementById("tr" + idTR).style.display="none";
	applyFilter();
}
function addFTDis(){
	maxTR=maxTR+1;
	var strTR='<tr id="tr' + maxTR + '"><td><div class="btn-group">';
	strTR=strTR+'<button type="button" class="btn btn-info btn-sm dropdown-toggle" data-toggle="dropdown"><span data-bind="label" id="SpTy' + maxTR + '">Alligator Cracking</span>&nbsp;<span class="caret"></span></button>';
    strTR=strTR+'<ul class="dropdown-menu" role="menu">';
	for (var i=0; i<disType.length;i++) {
		strTR=strTR+'<li><a href="#">' + disType[i].type + '</a></li>';
	}
	strTR=strTR+'</ul></div></td><td><div class="btn-group">';
    strTR=strTR+'<button type="button" class="btn btn-info btn-sm dropdown-toggle" data-toggle="dropdown"><span data-bind="label" id="spSv' + maxTR + '">Low</span>&nbsp;<span class="caret"></span></button>';
    strTR=strTR+'<ul class="dropdown-menu" role="menu">';
    strTR=strTR+'<li><a href="#">All</a></li><li><a href="#">Any</a></li><li><a href="#">Low</a></li><li><a href="#">Medium</a></li><li><a href="#">High</a></li>';                                                      
    strTR=strTR+'</ul></div></td>';
	strTR=strTR+'<td><input type="text" class="ftDst" id="fmD' + maxTR + '" value=0 onchange="applyFilter();"> to <input class="ftDst" type="text" id="toD' + maxTR + '" value=100 onchange="applyFilter();"></td>';
	strTR=strTR+'<td><div onclick="removeTR(' + maxTR + ')"><i class="fa fa-close rmDis"></i></div></td></tr>';
	$('#tbDistress').append(strTR); 
}
function exportCSV() {
	var features = map.queryRenderedFeatures({ layers: ['segments'] });	
	var fileContent = "OID,SegmentName,FromStreet,ToStreet,Functional, PCI";
	for (var i=0; i<features.length; i++) {
		fileContent=fileContent +  '\r\n' + features[i].properties.OID + "," + features[i].properties.NM.replaceAll(",", " ") + "," + features[i].properties.FM.replaceAll(",", " ") + "," + features[i].properties.TO.replaceAll(",", " ") + "," + features[i].properties.FN + "," + features[i].properties.PCI
	}
	var bb = new Blob([fileContent ], { type: 'text/plain' });
	var a = document.createElement('a');
	a.download = 'download.csv';
	a.href = window.URL.createObjectURL(bb);
	a.click();
}
