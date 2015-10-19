// Function to draw map
var drawMap = function() {

	// Creates map and sets view
	var map = L.map('map').setView([40, -100], 5);

	// Creates a tile layer variable using the appropriate url
	var layer = L.tileLayer('https://api.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibGlzYWxseSIsImEiOiJjaWZzZWs2M3oxOWw2b2VrcnRobzh4OGRiIn0.fkN85EVGVV_JCobEVLwrJQ').addTo(map);

	// Adds the layer to map
	layer.addTo(map);

	// Executes function to get data
	getData(map);

}

// Function for getting data
var getData = function(map) {
	$.ajax({
		url: "data/response.json",
		type: "get",
		success: function(data) {
			customBuild(data, map);
		},
		dataType: "json"	
	});	
}

// Add layers to map with markers
var customBuild = function(data, map) {
	
	// Layer groups for gender
	var male = new L.layerGroup([]);
	var female = new L.layerGroup([]);
	var unspecified = new L.layerGroup([]);	

	// Layer groups for race
	var white = new L.layerGroup([]);
	var black = new L.layerGroup([]);
	var asian = new L.layerGroup([]);
	var indian = new L.layerGroup([]);
	var hawaiian = new L.layerGroup([]);
	var unknown = new L.layerGroup([]);	

	// Variables to keep count of data for table in index.html
	var armedHit = 0;
	var armedKilled = 0;
	var unarmedHit = 0;
	var unarmedKilled = 0;	

	// Loops through data once to create layers, markers, etc.
	for (var i = 0; i < data.length; i++) {
		var gender = data[i]["Victim's Gender"];
		var race = data[i].Race;
		var outcome = data[i]["Hit or Killed?"];
		var armed = data[i]["Armed or Unarmed?"];

		// Calculates data for table in index.html
		if (armed == "Armed") {
			if (outcome == "Hit") {
				armedHit++;
			} else {
				armedKilled++;
			}
		} else {
			if (outcome == "Hit") {
				unarmedHit++;
			} else {
				unarmedKilled++;
			}
		}

		// Sets circle marker radius and opacity based on victim's death outcome
		var killRadius = 5;
		var killOpacity = 0.3;
		if (outcome == "Hit") {
			killRadius = 2.5;
			killOpacity = 1;
		}

		// Sets circle marker color based on victim's gender
		var genderColor = "blue"; 
		if (gender == "Female") {
			genderColor = "red";
		} else if (gender == "Unknown") {
			genderColor = "green";
		}			

		// Creates circle markers with victim's latitude, longitude, radius, opacity, and color
		var circle = new L.circleMarker([data[i].lat, data[i].lng], {
			radius: killRadius,
			fillOpacity: killOpacity,
			color: genderColor
		});

		// Adds summary and source of victim's incident to circle marker
		circle.bindPopup(data[i].Summary + " (" + "read more".link(data[i]["Source Link"]) + ")");

		// Adds layers to genderLayers
		if (gender == "Male") {
			circle.addTo(male);
		} else if (gender == "Female") {
			circle.addTo(female);
		} else {
			circle.addTo(unspecified);
		}

		// Adds layers to raceLayers
		if (race == "White") {
			circle.addTo(white);
		} else if (race == "Black or African American") {
			circle.addTo(black);
		} else if (race == "Asian") {
			circle.addTo(asian);
		} else if (race == "American Indian or Alaska Native") {
			circle.addTo(indian);
		} else if (race == "Native Hawaiian or Other Pacific Islander") {
			circle.addTo(hawaiian);
		} else {
			circle.addTo(unknown);				
		}
	}

	// Sets appropriate layers for genderLayers
	var genderLayers = {
		"Male": male,
		"Female": female,
		"Unspecified": unspecified
	}

	// Sets appropriate layers for raceLayers
	var raceLayers = {
		"Unknown": unknown,		
		"White": white, 
		"Black or African American": black, 
		"Asian": asian, 
		"American Indian or Alaska Native": indian, 
		"Native Hawaiian or Other Pacific Islander": hawaiian
	}	

	// Controls visibility of available layers
	L.control.layers(null, genderLayers).addTo(map);
	L.control.layers(null, raceLayers).addTo(map);  

	// Inputs data to table in index.html
	document.getElementById("top-left").innerHTML = armedHit;
	document.getElementById("top-right").innerHTML = armedKilled;
	document.getElementById("bottom-left").innerHTML = unarmedHit;
	document.getElementById("bottom-right").innerHTML = unarmedKilled;
}	