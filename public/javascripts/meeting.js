// jshint esversion: 6/

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
  * Uses turf.js
  * @see https://turfjs.org/
  * @author Benjamin Rieke 408743
  */
function lineStringsIntersect() {
var firstLine = document.getElementById("outputRoute1").value;
var secondLine = document.getElementById("outputRoute2").value;
var l1 = JSON.parse(firstLine).features[0].geometry;
var l2 = JSON.parse(secondLine).features[0].geometry;
var firstName = JSON.parse(firstLine).username;
var firstType = JSON.parse(firstLine).routeType;
var secondName = JSON.parse(secondLine).username;
var secondType = JSON.parse(secondLine).routeType;



console.log(firstName);
console.log(firstType);


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
placeMarker(meetingPoint, firstName, firstType, secondName, secondType);


}
}

function checkEntcounter(vFirstName, vFirstType, vSecondName, vSecondtype){

  if(vFirstName == vSecondName && vFirstType == vSecondtype){
       markerList = "You encounterd yourself. Congrats!";
       console.log(markerList);
       return markerList;

  }

}


/**
* @desc Places a Marker on the map
* @param coordi The coordinates
* @author Benjamin Rieke 408743"<table>
*/
function placeMarker(coordi, vFirstName, vFirstType, vSecondName, vSecondtype){
var markerList = '';
//If you have two planned routes that intersect
if(vFirstName == vSecondName && vFirstType == vSecondtype && vFirstType == 'planned'){
     markerList = "You already planned parts of this route. Congrats!";
}
//If you have two routes. One that is planned and the other is already completed
if(vFirstName == vSecondName && vFirstType == 'planned' && vFirstType != vSecondtype){
markerList = "You will encounter yourself. Congrats!";
console.log(markerList);
}

//If you have two routes. One that is already completed and the other is planned
if(vFirstName == vSecondName && vFirstType == 'completed' && vFirstType != vSecondtype){
markerList = "You´ve already been here. Congrats!";
console.log(markerList);
}

// If your planned route intersects with somebody elses
if(vFirstName != vSecondName && vFirstType == 'planned' && vFirstType == vSecondtype){
markerList = "You might encounter " +  vSecondName+ " Say Hello!";
console.log(markerList);
}

// If your planned route intersects with somebody elses
if(vFirstName != vSecondName && vFirstType == 'planned' && vFirstType !=vSecondtype){
markerList = vSecondName+" was already here!";
console.log(markerList);
}

// If your completed route intersected with somebody elses
if(vFirstName != vSecondName && vFirstType == 'completed' && vFirstType ==vSecondtype){
markerList = "Your route intersected with " +  vSecondName+" Write him a message!";
console.log(markerList);
}

// If your route intersected with somebody elses who has not completed it

if(vFirstName != vSecondName && vFirstType == 'completed' && vFirstType !=vSecondtype){
markerList = "Your completed route might be intersected by " +  vSecondName+". Tell him if you liked it!";
console.log(markerList);
}

//If an animal was on parts of your planned route

if(vFirstType == 'planned' && vSecondtype == 'animal'){
markerList = "You will follow the paths of " +  vSecondName+"! An Animal!" ;
console.log(markerList);
}

// If you were on the same path as an animal

if(vFirstType == 'completed' && vSecondtype == 'animal'){
markerList = "You walked on the same paths as " +  vSecondName+"! An Animal! How wonderful!" ;
console.log(markerList);
}

L.marker(coordi).addTo(map)
 .bindPopup(markerList);
 console.log(coordi);
//  var markerList =
//"<table><tr><td>Name of the route</td><td>Type of the route</td></tr><tr><td>" + vFirstName +"</td><td>" +vFirstType +" </td></tr><tr><td>"+ vSecondName +"</td><td>"+ vSecondtype+ "</td></tr> </table>"


}
