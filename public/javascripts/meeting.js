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
