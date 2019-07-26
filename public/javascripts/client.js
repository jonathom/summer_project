// jshint esversion: 6
// Assignment 07 // Jonathan Bahlmann // 453 524

//save created routeViews to reference them when deleted


var routesToDelete = [];
// add map
var start_latlng = [51, 10.4];

var map = L.map("mapdiv").setView(start_latlng, 6);

var osm = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors",
  id: "osm"
}).addTo(map);

// tutorial
// routes array to store JSON data
var routesJSON = [];

// on DOM ready
$(document).ready(function() {
  readRoutes();

});

//Changes the table accoridng to the chosen type
$('#routesSelect').on('change', function(e){
  readRoutesSelect(this.value);
});

/**
  *@desc  function gets the routes from the database
  * and creates a table according to each entry
  *@param changer has a value from a select form
  *and changes the output of the table
  *@author Benjamin Rieke
  */
  function readRoutesSelect(changer) {

  //get JSON from DB
  $.getJSON('/users/routes', function(data) {
    routesJSON = data;
    var tableContent ='';
    $.each(data, function(index) {
    if (routesJSON[index].features[0].geometry.type  == "LineString" && routesJSON[index].routeType == changer  ) {
      tableContent += '<tr>';
      var checkbox = "<input type='checkbox' id='route"+index+"' name='routes' onchange='displayRoute("+index+")'></checkbox>";
      tableContent += '<td>' + checkbox + '</td>';
      tableContent += '<td>' + this.name + '</td>';
      tableContent += '<td>' + this.routeType + '</td>';
      tableContent += '<td>' + this.username + '</td>';
      tableContent += '<td>' + this.date + '</td>';
      tableContent += '</tr>';
}
if (changer == "Type") {
  readRoutes();
}

    });

    $('#resultTable').html(tableContent);
  });
}

/**
  *@desc  function gets the routes from the database
  * and creates a table according to each entry
  *@author Jonathan Bahlmann
  */
  function readRoutes() {

  //get JSON from DB
  $.getJSON('/users/routes', function(data) {
    routesJSON = data;
    var tableContent ='';
    $.each(data, function(index) {
    if (routesJSON[index].features[0].geometry.type  == "LineString"  ) {
      tableContent += '<tr>';
      var checkbox = "<input type='checkbox' id='route"+index+"' name='routes' onchange='displayRoute("+index+")'></checkbox>";
      tableContent += '<td>' + checkbox + '</td>';
      tableContent += '<td>' + this.name + '</td>';
      tableContent += '<td>' + this.routeType + '</td>';
      tableContent += '<td>' + this.username + '</td>';
      tableContent += '<td>' + this.date + '</td>';
      tableContent += '</tr>';
}

    });


    $('#resultTable').html(tableContent);
  });
}

/**
  *@desc  function gets the routes from the database
  * and creates a table according to each entry
  *@author Jonathan Bahlmann
  */

function displayRoute(index) {
  console.log("displayRoute "+index);
  var id = "route";
  id += index;
  if(document.getElementById(id).checked) {
    //put into routeInQuestion textarea
    document.getElementById("routeInQuestion").value = JSON.stringify(routesJSON[index]);
    document.getElementById("p1").innerHTML = "You chose:   " + JSON.stringify(routesJSON[index].name);


    var LatLon = turnLatLon(routesJSON[index].features[0].geometry.coordinates);
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
  * @desc quick function to turn around the coordinates
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
