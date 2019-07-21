'esversion: 6';
// Assignment 07 // Jonathan Bahlmann // 453 524

//save created routeViews to reference them when deleted
var routesToDelete = [];
// add map
var start_latlng = [52.7, 4.3];

var map = L.map("mapdiv").setView(start_latlng, 6);

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors",
  id: "osm"
}).addTo(map);

// tutorial
// routes array to store JSON data
var routesArray = [];

// on DOM ready
$(document).ready(function() {
  readRoutes();
});

//read routes
function readRoutes() {
  var content = "";

  //get JSON from DB
  $.getJSON('/users/routes', function(data) {
    routesArray = data;
    $.each(data, function(index) {
      content += "<div id='"+index+"' class='col-sm-1'>";
      //create checkbox for each route
      var checkbox = "<input type='checkbox' id='route"+index+"' name='routes' onchange='displayRoute("+index+")'></checkbox>";
      var label = "<label for='route"+index+"'>route"+index+"</label>";

      content += checkbox;
      content += label;
      content += "</div>";
    });

    //insert created content
    $('#routesDisplay').html(content);
  });
}

/**
  * quick display routes function
  * handles the 'checked' Attribute of the checkboxes and shows/deletes the indexed route
  * @param index of route to show/deletes
  * @author Jonathan Bahlmann
  */
function displayRoute(index) {
  var id = "route";
  id += index;
  if(document.getElementById(id).checked) {
  var LatLon = turnLatLon(routesArray[index].features[0].geometry.coordinates);
  var line = L.polyline(LatLon, {color: "red", weight: 3});
  line.addTo(map);
  map.fitBounds(line.getBounds());
  //insert into 'memory' array
  routesToDelete[index] = line;
  }
  else {
    console.log("remove");
    map.removeLayer(routesToDelete[index]);
  }
}

/**
  * quick function to turn around the coordinates
  * @param array
  */
function turnLatLon(array) {
  var latlon = [];
  //go through points and change to latlon order
  for (var j = 0; j < array.length; j++) {
    var point = [];
    var lat = array[j][1];
    point.push(lat);
    var lon = array[j][0];
    point.push(lon);
    latlon.push(point);
  }
  return latlon;
}
