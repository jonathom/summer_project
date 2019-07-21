//make map
var start_latlng = [51.9, 7.6];

var map = L.map("mapdiv").setView(start_latlng, 10);

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors",
  id: "osm"
}).addTo(map);

//enable drawing on map
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  draw: {
    //we only want to draw polygons
    polygon: true,
    marker: false,
    circle: false,
    rectangle: false,
    circlemarker: false,
    polyline: false
  },
  edit: {
    featureGroup: drawnItems
  }
});
//add to map
map.addControl(drawControl);

map.on("draw:created", function(e) {
  //one polygon at a time
  drawnItems.eachLayer(function(layer) {
    drawnItems.removeLayer(layer);
  });
  //add to feature group
  var type = e.layerType,
    layer = e.layer;
  drawnItems.addLayer(layer);
  var drawnPolygon = drawnItems.toGeoJSON();
  drawnPolygon = JSON.stringify(drawnPolygon.features[0]);
  //save to local storage
  localStorage.setItem("storagePolygon",drawnPolygon);
  document.getElementById("drawnFeature").value = drawnPolygon;
});
map.on("draw:edited", function(e) {
  var drawnPolygon = drawnItems.toGeoJSON();
  document.getElementById("drawnFeature").value = JSON.stringify(drawnPolygon.features[0]);

});
map.on("draw:deleted", function(e) {
  var drawnPolygon = drawnItems.toGeoJSON();
  if (drawnItems.getLayers().length == 0) {
    document.getElementById("drawnFeature").value = "";
  } else {
    document.getElementById("drawnFeature").value = JSON.stringify(drawnPolygon.features[0]);
  }
});
