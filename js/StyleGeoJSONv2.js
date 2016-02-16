 // This script demonstrates some simple things one can do with leaflet.js


var map = L.map('map').setView([40.71,-73.93], 11);

// set a tile layer to be CartoDB tiles 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

// add these tiles to our map
map.addLayer(CartoDBTiles);


// create global variables we can use for layer controls
var neighborhoodsGeoJSON;
var facilitiesGeoJSON;

// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function
//Adding facilities data

$.getJSON( "geojson/Facilities.geojson", function( data ) {
    var facilities = data; 
   //Attempting filter by attribute
   var pubLibrary = [{
        "type": "Feature",
        "properties": {
            "name": "Public Library - Branch",
            "show_on_map": true
        },
        "geometry": {
        "type": "Point",
        }
    }];

L.geoJson(pubLibrary, {
    filter: function (feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);

    // dots for library sites
    var pubLibraryPointToLayer = function (feature, latlng) {
        var pubLibraryMarker = L.circle(latlng, 50, {
            stroke: false,
            fillColor: '#08519c',
            fillOpacity: 1
        });

        return pubLibraryMarker;  
    }

    var pubLibraryClick = function (feature, layer) {
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Name:</strong> " + feature.properties.facname);   
    }

    facilitiesGeoJSON = L.geoJson(pubLibrary, {
        pointToLayer: pubLibraryPointToLayer,
        onEachFeature: pubLibraryClick
    }).addTo(map);


});


// let's add neighborhood data
$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var neighborhoods = data;

    console.log(neighborhoods);

    // neighborhood choropleth map
    // let's use $ in medHHInc to color the neighborhood map
    var medHHIncStyle = function (feature){
        var value = feature.properties.MedHouInco;
        var fillColor = null;
        if(value >= 0 && value <=25000){
            fillColor = "#edf8e9";
        }
        if(value >25000 && value <=50000){
            fillColor = "#c7e9c0";
        }
        if(value >50000 && value<=75000){
            fillColor = "#a1d99b";
        }
        if(value > 75000 && value <=100000){
            fillColor = "#74c476";
        }
        if(value > 100000 && value <=150000) { 
            fillColor = "#31a354";
        }
        if(value > 150000) { 
            fillColor = "#006d2c";
        }

        var style = {
            weight: 1,
            opacity: .1,
            color: 'white',
            fillOpacity: 0.75,
            fillColor: fillColor
        };

        return style;
    }

    var medHHIncClick = function (feature, layer) {
        var dollars = feature.properties.MedHouInco ;
        dollars = dollars.toFixed(0);
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br/><strong>Median Household Income:</strong> " + "$" + dollars);
    }

    neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
        style: medHHIncStyle,
        onEachFeature: medHHIncClick
    }).addTo(map);

    // create layer controls
    createLayerControls(); 

});


function createLayerControls(){

    // add in layer controls
    var baseMaps = {
        "CartoDB": CartoDBTiles,
    };

    var overlayMaps = {
        "Public Libraries": facilitiesGeoJSON,
        "Median Household Income": neighborhoodsGeoJSON
    };

    // add control
    L.control.layers(baseMaps, overlayMaps).addTo(map);

}




