'esversion: 6';
// Assignment 05 // Jonathan Bahlmann // 453 524

// add map
var start_latlng = [52.7, 4.3];
var map = L.map("mapdiv").setView(start_latlng, 10);

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
  //get JSON from DB
  $.getJSON('/users/routes', function(data) {
      console.log("localhost:3000/");
    routesArray = data;
    routeSelection();
  });
}

//use route array and layerGroup like in example solution @see https://github.com/streuselcake/jslab/blob/master/client/04-webgis/leaflet-polylinelayers/client.js
var routeLayer = L.layerGroup().addTo(map);
var routes = [];
//save markers aswell
var markers = [];

//save weather and additional information in these arrays
var weather = [];
var astro = [];
var places = [];


/**
  * this function handles the input (a featureCollection named gpstracks) and dynamically creates
  * the route selection bootstrap container
  * @author Jonathan Bahlmann
  */
function routeSelection() {
  console.log("routeSelection, l " + routesArray.length);
  //for each gps track do
  for (var i = 0; i < routesArray.length; i++) {
    //this is the track
    var track = routesArray[i].features[0].geometry.coordinates;
    //create coordinates array (in latlon order)
    var latlon = [];
    //go through points and change to latlon order
    for (var j = 0; j < track.length; j++) {
      var point = [];
      var lat = track[j][1];
      point.push(lat);
      var lon = track[j][0];
      point.push(lon);
      latlon.push(point);
    }
    //push this polyline to the global routes array
    var line = L.polyline(latlon, {color: "red", weight: 3});
    routes.push(line);
    //number for label
    var nr = i + 1;
    //create checkbox for each route
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    //attributes of checkbox
    checkbox.id = "route" + i;
    checkbox.name = "routes";
    checkbox.value = i;
    //create label for checkbox
    var label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.appendChild(document.createTextNode("route " + nr));

    //add event listener
    checkbox.addEventListener("change", this.eventListener);

    //create div so that route display is scalable
    var div = document.createElement("div");
    div.className = "col-sm-1";
    div.id = i;
    results.appendChild(div);
    document.getElementById(i).appendChild(checkbox);
    document.getElementById(i).appendChild(label);
  }
  //get weather for all routes, once
  getWeatherForAll();
}

/**
  * function triggered every time a checkbox is clicked
  * it handles the display / deletion of markers and information on the map
  * it also decides which information to showPlace
  * @author Jonathan Bahlmann
  */
function eventListener() {
  //when this is checked
  if(this.checked) {
    //add this route to routeLayer
    routes[this.value].addTo(routeLayer);
    map.fitBounds(routes[this.value].getBounds());

    //weather
    var marker = markers[this.value];
    marker.addTo(routeLayer);
    //calculate temperature
    var temp = weather[this.value].main.temp;
    temp = temp - 273.15;
    temp = Math.round(temp*10)/10;
    //create popup content
    var content = "<b>lat "+weather[this.value].coord.lat+", lon "+weather[this.value].coord.lon+"</b><br>"+
                  weather[this.value].weather[0].description+", "+temp+"°C<br>";
    //weather code is
    var code = weather[this.value].weather[0].id;
    //information display
    //when sky is clear or almost clear
    if(code == "800" || code == "801" || code == "802") {
      //show information about sunset/moonrise/moonset
      var newContent = "Some stargazing information:<br>The sun sets at "+astro[this.value].sunset+
                        "<br>Moonrise is at "+astro[this.value].moonrise+"<br>Moonset is at "+astro[this.value].moonset;
      content = content + newContent;
    }
    //when sky is not clear/bad weather
    else {
      //show nearest cafe
      var placeContent = "It's not that nice outside, here is the closest café:<br>"+
                          places[this.value].results.items[0].title+" ("+places[this.value].results.items[0].category.title+")."+
                          "<br>"+
                          "<button type='button' onclick='showPlace("+this.value+");'>show on map</button>";
      content = content + placeContent;
    }
    //bind popup to marker
    marker.bindPopup(content);

  //when this is unchecked
  } else {
    //remove route, marker from routeLayer
    routeLayer.removeLayer(routes[this.value]);
    routeLayer.removeLayer(markers[this.value]);
  }
}

/**
  * this function handles the onclick event of the popup content
  * it display a markers and binds a opup to said marker to show nearest café
  * @author Jonathan Bahlmann
  * @param i index to lookup in places-data-table
  */
function showPlace(i) {
  //make marker
  var lat = places[i].results.items[0].position[0];
  var lon = places[i].results.items[0].position[1];
  var marker = L.marker([lat, lon]).addTo(map);
  var content = places[i].results.items[0].title;
  marker.bindPopup(content).openPopup();
}

/**
  * this function get's the weather from openweathermap for all routes
  * this is done by an iteration through the routes-array
  * @author Jonathan Bahlmann
  */
function getWeatherForAll() {
  for(var i = 0; i < routes.length; i++) {
    //get weather at middle of track
    var middle = routes[i]._latlngs.length / 2;
    middle = Math.round(middle);
    middle  = routes[i]._latlngs[middle];
    //call request, pass index i so the request stays connected to the route
    xhrGetWeather(middle.lat, middle.lng, saveWeather, i);
  }
}

/**
  * this function handles the xhr request to openweathermap
  * @author Joanthan Bahlmann
  * @param lat Latitude
  * @param lon Longitude
  * @param cFunc callback function for successful request
  * @param i index passed down into cFunc
  */
function xhrGetWeather(lat, lon, cFunc, i) {
  var url = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid="+OWMTOKEN;
  var xhttp = new XMLHttpRequest();
  //when ready
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      cFunc(this, i);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

/**
  * this function handles the xhttp response from OWMTOKEN
  * it saves the weather into a table, creates a marker at the found weather position
  * also the additional information xhr requests are called from here, depending on the weather code
  * @author Jonathan Bahlmann
  * @param xhttp xhttp responseText
  * @param i index to save the responseText at the right place in table
  */
function saveWeather(xhttp, i) {
  //parse resonse
  weatherXML = JSON.parse(xhttp.responseText);
  //save weather in table
  weather[i] = weatherXML;
  var lat = weatherXML.coord.lat;
  var lon = weatherXML.coord.lon;
  //create marker and write into markers table
  var marker = L.marker([lat, lon]);
  markers[i] = marker;

  //call additional information accordingly
  var code = weather[i].weather[0].id;
  if(code == 800 || code == 801 || code == 802) {
    xhrGetAstronomy(lat, lon, astroResponse, i);
  } else {
    xhrGetPlace(lat, lon, savePlace, i);
  }
}

/**
  * this function sends an xhr request to IPGeolocation api
  * to get information on sunset, moonrise etc.
  * @author Jonathan Bahlmann
  * @param lat Latitude
  * @param lon Longitude
  * @param cFunc callback function for successful request
  * @param i index passed down into cFunc
  */
function xhrGetAstronomy(lat, lon, cFunc, i) {
  var url = "https://api.ipgeolocation.io/astronomy?apiKey="+IPTOKEN+"&lat="+lat+"&long="+lon;
  var xhttp = new XMLHttpRequest();
  //when ready
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      cFunc(this, i);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

/**
  * this function handles the ipgeolocation xhttp responseText
  * @author Jonathan Bahlmann
  * @param xhttp xhr responseText
  * @param i index for table entry
  */
function astroResponse(xhttp, i) {
  //parse answer
  var answer = JSON.parse(xhttp.responseText);
  //write answer into table
  astro[i] = answer;
}

/**
  * this function send a xhr request to here api
  * to get the nearest café
  * @author Jonathan Bahlmann
  * @param lat Latitude
  * @param lon Longitude
  * @param cFunc callback function for successful request
  * @param i index passed down into cFunc
  */
function xhrGetPlace(lat, lon, cFunc, i) {
  var url = "https://places.cit.api.here.com/places/v1/discover/around?app_id="+HEREAPPID+"&app_code="+HEREAPPCODE+"&at="+lat+","+lon+"&cat=coffee-tea&pretty";
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      cFunc(this, i);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

/**
  * this function handles the xhr response of here api
  * @author Jonathan Bahlmann
  * @param xhttp xhr responseText
  * @param i index for table entry
  */
function savePlace(xhttp, i) {
  //parse answer
  var answer = JSON.parse(xhttp.responseText);
  //write answer into table
  places[i] = answer;
}
