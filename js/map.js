
// Function to draw your map
var drawMap = function() {

// Create map and set view
var map = L.map('map').setView([30, -95], 4);

// Create a tile layer variable using the appropriate url
//var layer = L.tileLayer('https://api.mapbox.com/v4/lisally.cifrqbc090om0slm027fb7tuk/0/0/0.png?access_token=pk.eyJ1IjoibGlzYWxseSIsImEiOiJjaWZzZWs2M3oxOWw2b2VrcnRobzh4OGRiIn0.fkN85EVGVV_JCobEVLwrJQ').addTo(map);
	
var layer =	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

// Add the layer to your map
layer.addTo(map);

// Execute your function to get data
getData(map);

}

// Function for getting data
var getData = function(map) {

// Execute an AJAX request to get the data in data/response.js
$.getJSON('data/response.json', function(data) { 
	customBuild(data, map);
});

// $.getJSON('data/response.json', then(getData), console.log('sucessful'))

//jQuery.get( 'data/response.js' [, data ] [, success ] [, dataType ] )
//	$.getJSON(
//	  'data.response.js',
//	  then(getData),
//	  alert('success'),
//	  //dataType: dataType
//	});

// When your request is successful, call your customBuild function

}

// Loop through your data and add the appropriate layers and points
var customBuild = function(dataSet, map) {
// Be sure to add each layer to the map
	var male = new L.layerGroup([]);
	var female = new L.layerGroup([]);
	var unspecified = new L.layerGroup([]);

	var white = new L.layerGroup([]);
	var black = new L.layerGroup([]);
	var asian = new L.layerGroup([]);
	var indian = new L.layerGroup([]);
	var hawaiian = new L.layerGroup([]);
	var unknown = new L.layerGroup([]);


	dataSet.forEach(function(data) {
		var armedHit = 0;
		var armedKilled = 0;
		var unarmedHit = 0;
		var unarmedKilled = 0;

		if (data["Armed or Unarmed?"] == "Armed" && data["Hit or Killed?"] == "Hit") {
			armedHit++;
		} else if (data["Armed or Unarmed?"] == "Armed" && data["Hit or Killed?"] == "Killed") {
			armedKilled++;
		} else if (data["Armed or Unarmed?"] == "Unarmed" && data["Hit or Killed?"] == "Hit") {
			unarmedHit++;
		} else if (data["Armed or Unarmed?"] == "Unarmed" && data["Hit or Killed?"] == "Killed") {
			unarmedKilled++;
		} 


		var genderColor = "blue";
		if (data["Victim's Gender"] == "Female") {
				genderColor = "red";	
		} else if (data["Victim's Gender"] == "Unknown") {
				genderColor = "green";
		}

		var circle = new L.circleMarker([data["lat"], data["lng"]], {
			radius: 5,
			fillOpacity: 0.5,
			color: genderColor	
		});
		
		var source = "read more".link(data["Source Link"]);
		circle.bindPopup(data["Summary"] + " (" + source + ")");		

		if (data["Victim's Gender"] == "Male") {
			circle.addTo(male);
		} else if (data["Victim's Gender"] == "Female") {
			circle.addTo(female);
		} else {
			circle.addTo(unspecified)
		} 

		if (data["Race"] == "White") {
			circle.addTo(white);
		} else if (data["Race"] == "Black or African American") {
			circle.addTo(black);
		} else if (data["Race"] == "Asian") {
			circle.addTo(asian);
		} else if (data["Race"] == "American Indian or Alaska Native") {
			circle.addTo(indian);
		} else if (data["Race"] == "Native Hawaiian or Other Pacific Islander") {
			circle.addTo(hawaiian);
		} else {
			circle.addTo(unknown);				
		}

	});


// Once layers are on the map, add a leaflet controller that shows/hides layers
	var genderLayers = {
		"Male": male,
		"Female": female,
		"Unspecified": unspecified,
	}

	var raceLayers = {	
		"White": white, 
		"Black or African American": black, 
		"Asian": asian, 
		"American Indian or Alaska Native": indian, 
		"Native Hawaiian or Other Pacific Islander": hawaiian, 
		"Unknown": unknown

	}

	L.control.layers(null, genderLayers).addTo(map);
	L.control.layers(null, raceLayers).addTo(map);  
}
