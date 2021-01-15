window.onload = showMap;
var link = "../static/data/countries.geojson";
var attacks = sharky.shark_attacks;
console.log(attacks[0].year)
var test = [
  { country: 'Philippines', count: 123, goal: 'yes' },
  { country: 'USA', count: 123, goal: 'yes' },
  { country: 'Australia', count: 142, goal: 'yes' }
];


var test2 = [1,2,4,5,5] 
//console.log(link);
//get list of year in shark attacks json
var lookup = {};
var year_list = [];
for (var count in attacks) {
  var attack_year = attacks[count].year;

  if (!(attack_year in lookup)) {
    lookup[attack_year] = 1;
    year_list.push(attack_year);
  }
}

year_list.push("All");
year_list = year_list.sort(function(a, b){return a-b});
// set era to drop down
var era = [
          "All Time","Ancient (6000 BCE - 650 CE)","Post-Classical (500 - 1500)", "Early Modern 1500 - 1750", 
          "Late Modern (1750 - 1945)", "Contemporary (1945 - Present)"
]
select_era = d3.select("#selEra");
for (const [key,value] of  Object.entries(era)){
  select_era.append("option").text(value).attr("value", value);
  };


function showMap(){
//Clear map
  var clearbody = document.getElementById("map_container");   
  while(clearbody.hasChildNodes())
  {
      clearbody.removeChild(clearbody.firstChild);
  };
  document.getElementById('map_container').innerHTML = "<div id='map'></div>";
//set year to drop down base on era
var attacks = sharky.shark_attacks;
var era_years;
var acient = [];
var post_class = [];
var early_mod = [];
var late_mod = [];
var cont = [];

for (year_era in year_list){
    if (year_list[year_era] <650){
      acient.push(year_list[year_era]);
    }
    else if(year_list[year_era] < 1500){
      post_class.push(year_list[year_era]);
    }
    else if(year_list[year_era] < 1750){
      early_mod.push(year_list[year_era]);
    }
    else if(year_list[year_era] < 1945 ){
      late_mod.push(year_list[year_era]);
    }
    else if(year_list[year_era] > 1945){
      cont.push(year_list[year_era]);
    }
} 
var active_year_list = [];
console.log(active_year_list);
var sel = document.getElementById('selEra');
var selvar = sel.options[sel.selectedIndex].value;

console.log(selvar);
if (selvar.includes("Ancient")){
  console.log("test");
  active_year_list = acient;
}
else if (selvar.includes("Post-Classical")){
  active_year_list = post_class;
}
else if (selvar.includes("Early Modern")){
  active_year_list = early_mod;
}
else if (selvar.includes("Late Modern")){
  active_year_list = late_mod;
}
else if (selvar.includes("Contemporary")){
  active_year_list = cont;
}
else{
  active_year_list = year_list;
}

d3.json(link, function(data) {

  var geo2 = data;
  var geo = data.features;
 // console.log(geo2);
  arrayList = [], obj_c_processed = [];
  var counts = 0;
  var totalcount =0;
// Recreate geojson to merge the shark attacks json
for (var i in geo) {
  var obj = {
        
        "type":"Feature",
        "properties":geo[i].properties.ADMIN,
        "geometry":{
            "type":geo[i].geometry.type,
            "coordinates":geo[i].geometry.coordinates
        },
};
// fix match geojson and shark attacks json
for (var j in attacks) {
  if (attacks[j].country.toLowerCase() == "usa"){
      var country_name = "united states of america";
  }else{
      var country_name = attacks[j].country.toLowerCase()
  }
  if (country_name == geo[i].properties.ADMIN.toLowerCase() && active_year_list.includes(attacks[j].year)) {
      obj.count = ++counts;
      totalcount = ++totalcount;
      //console.log(counts);
      // obj.count = test[j].count;
      obj_c_processed[attacks[j].country] = true;
  }
}
//console.log(active_year_list);
obj.count = obj.count || 0;
arrayList.push(obj);
var counts = 0;
}
var myGeoJSON = {};
myGeoJSON.type = "FeatureCollection";
myGeoJSON.features = arrayList;
//console.log(myGeoJSON.features[1].count);
var show_attacks = []
for (var o in myGeoJSON.features){
  if (myGeoJSON.features[o].count != 0){
    show_attacks.push(myGeoJSON.features[o].count+" cases in "+myGeoJSON.features[o].properties);
  }
}
//console.log(show_attacks);
var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
show_attacks.sort(collator.compare);
show_attacks.reverse()
show_attacks = show_attacks.slice(0,10)
// clear the old data content to make room for the new searched content
var clearbody2 = document.getElementById("sample-metadata");   
while(clearbody2.hasChildNodes())
{
    clearbody2.removeChild(clearbody2.firstChild);
};
//Add total count of attacks 
var demo_body = d3.select("#sample-metadata");
for(var show in show_attacks){
demo_body.append("li").text(show_attacks[show]);
}




//-----------------------------------------------


// Creating map object
var myMap = L.map("map", {
  center: [0, 0],
  zoom: 2
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v10.html?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 2,
  minZoom: 2,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Use this link to get the geojson data.
var link = "assets/data/countries.geojson";

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseOpacity(count) {
  return count > 500 ? '#800026' :
  count > 200  ? '#BD0026' :
  count > 100  ? '#E31A1C' :
  count > 50   ? '#FD8D3C' :
  count > 10   ? '#FED976' :
             '#FFEDA0';
}

 // Creating a geoJSON layer with the retrieved data
  L.geoJson(myGeoJSON, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: chooseOpacity(feature.count),
        fillOpacity: 0.8,
        weight: 1
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) { 
          layer = event.target;
          layer.setStyle({
            weight: 5,
            color: "red",
            dashArray: '',
            fillOpacity: 0.8
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({        
            weight: 2,
            color: "white",
            dashArray: '',
            fillOpacity: 0.8
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          myMap.fitBounds(event.target.getBounds());
        }
      });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h2>" + feature.properties+ "</h2> <hr> <h4>" + "Number of Cases: "+feature.count + "</h4>");

    }
  }).addTo(myMap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 50, 100, 200, 500],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseOpacity(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);


});


}