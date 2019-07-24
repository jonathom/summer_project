
/**
* @desc Loads the routes and informations for a chosen study and animal
* @author Benjamin Rieke 408743
*/

function loadStudy(){

  // jshint esversion: 6
  var jsonUrl = "https://www.movebank.org/movebank/service/json-auth";
  var study_id = document.getElementById('idInput').value; // !! add the Movebank ID for your study, available in the Study Details
  var individual_local_identifiers = [document.getElementById('individualInput').value]; // !! add the exact Animal IDs for the animals in the study that you want to show on the map
  var sensor = document.getElementById("sensorType")  .elements["sensorType"].value;
// Check if a study and a animal id has been chosen
  if(study_id == '' && individual_local_identifiers == ''){
    alert("Please enter a Study and a Animal Id. For more Informations see: https://www.movebank.org/")
    return;
  }
  else
$.getJSON(jsonUrl + "?callback=?", {
    study_id: study_id,
    individual_local_identifiers: individual_local_identifiers,
    //max_events_per_individual : '100',
    // timestamp_start: timestamp_start,
    // timestamp_end: timestamp_end,
    sensor_type: sensor
// !! change if needed to specify the sensor type to display; options are gps, argos-doppler-shift, solar-geolocator, radio-transmitter, bird-ring, natural-mark
}, function (data0) {
    data = data0;
    document.getElementById("JSONresponse").value = JSON.stringify(data0);
    // check if the response from the sever is working according to the chosen sensor
    if (JSON.stringify(data0) == '{"individuals":[]}') {
      alert("Please try another Sensor-Type")
      return;
    }
    else
    console.log(data0.individuals[0].locations[0].location_lat);
    coordinates = [];
    for(let i = 0; i < data0.individuals[0].locations.length; i++) {
      let point = [];
      let lat = data0.individuals[0].locations[i].location_lat;
      let lon = data0.individuals[0].locations[i].location_long;
      point.push(lon);
      point.push(lat);
      coordinates.push(point);
    }
    console.log(coordinates.length);
    document.getElementById("GeoJson").value = JSON.stringify(toGeoJson(coordinates));
    document.getElementById("routeUsername").value = data0.individuals[0].individual_local_identifier;
    document.getElementById("routeDesc").value = data0.individuals[0].individual_taxon_canonical_name + ", study_id: " + data0.individuals[0].study_id;
    document.getElementById("routeType").value = "animal";
    //time
    var timestamp = new Date(data0.individuals[0].locations[0].timestamp);
    let year = timestamp.getFullYear();
    let month = '' + (timestamp.getMonth() + 1);
    if(month.length < 2) { month = '0' + month; }
    let day = '' + timestamp.getDate();
    if(day.length < 2) { day = '0' + day; }
    timestamp = day+'-'+month+'-'+year;
    console.log(timestamp);
    document.getElementById("routeDate").value = timestamp;
    document.getElementById("routeName").value = data0.individuals[0].individual_taxon_canonical_name + " at " + timestamp;

});

}



/**
* @desc Simple Jquery function for the button animation
* @author Benjamin Rieke 408743
*/

$(document).ready(function() {
  $('.btn').on('click', function() {
    var $this = $(this);
    var loadingText = 'Loading animal routes...';
    if ($(this).html() !== loadingText) {
      $this.data('original-text', $(this).html());
      $this.html(loadingText);
    }
    setTimeout(function() {
      $this.html($this.data('original-text'));
    }, 2000);
  });
})


/**
  * converts an array of coordinates into a LineString in GeoJSON format
  * done by using this source:
  * @see https://github.com/perliedman/leaflet-routing-machine/blob/344ff09c8bb94d4e42fa583286d95396d8227c65/src/L.Routing.js
  */
function toGeoJson(coordinates) {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      },
    ]
  };
}

function buttonAddAnimal() {
    event.preventDefault();

    var newRoute = document.getElementById("GeoJson").value;
    var addAttr = JSON.parse(newRoute);
    addAttr.name = document.getElementById("routeName").value;
    addAttr.routeType = document.getElementById("routeType").value;
    addAttr.username = document.getElementById("routeUsername").value;
    addAttr.date = document.getElementById("routeDate").value;
    addAttr.desc = document.getElementById("routeDesc").value;
    var newRouteString = JSON.stringify(addAttr);

    //post
    $.ajax({
      type: 'POST',
      data: newRouteString,
      url: '/users/addroute',
      contentType:"application/json"
    }).done(function(response) {
      console.dir(response);
      //successful
      if(response.error === 0) {
        alert('route added: ' + response.msg);
      }
      else {
        alert('Error: ' + response.msg);
      }
    });
}
