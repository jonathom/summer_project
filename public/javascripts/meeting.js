// jshint esversion: 6

//do two routes meet?

//get JSON from DB
$.getJSON('/users/routes', function(data) {
  routesJSON = data;
  var tableContent ='';
  $.each(data, function(index) {

//for each, do

  });

  $('#resultTable').html(tableContent);
});

/**
  * @desc Checks if two choosen routes are intersecting eachother
  * Uses turf.js https://turfjs.org/
  * @author Benjamin Rieke 408743
  */
function lineStringsIntersect() {
var firstLine = document.getElementById("outputRoute1").value;
var secondLine = document.getElementById("outputRoute2").value;
var l1 = JSON.parse(firstLine).features[0].geometry;
var l2 = JSON.parse(secondLine).features[0].geometry;


var intersects = turf.lineIntersect(l1, l2);
//console.log(intersects);

// for each intersection
for(let i = 0; intersects.features[i]; i++){
var meetingPoint = (intersects.features[i].geometry.coordinates);
console.log(meetingPoint);
// switch lat and long for display on leaflet
[meetingPoint[0], meetingPoint[1]] = [meetingPoint[1], meetingPoint[0]];

console.log(meetingPoint);

//And place them as a marker on the map
placeMarker(meetingPoint);

}
}

/**
* @desc Places a Marker on the map 
* @param coordi The coordinates
* @author Benjamin Rieke 408743
*/

function placeMarker(coordi){
  L.marker(coordi).addTo(map)
   .bindPopup("blub");
   console.log(coordi);

}
