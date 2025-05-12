/* Load items from Sheets, store in sessionStorage, or load from sessionStorage */
var dd_items = [];
var dd_scenes = [];
var scenesNav = [];
 // set variables
 var config_metadata = "{{ site.play | relative_url | default: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4-hSjZe4pN0R2-fzmNyc_yrE355W1RgOBmYJ4PF-Lsyo1bKpWVKgwYqGOxGnMvvV41__J66Yjyxa1/pub?output=csv' }}";

if (sessionStorage.getItem("dd_metadata_set")){
  var current_metadata = sessionStorage.getItem("dd_metadata_set");}
  // find current configured metadata
  var dd_metadata_set = sessionStorage.getItem("dd_metadata_set") ? sessionStorage.getItem("dd_metadata_set") : config_metadata;
  // display configured metadata
  document.getElementById("current-metadata-menu").innerHTML = dd_metadata_set != "" ? dd_metadata_set : "None!";
  

// function to process items from Sheets and store
function dd_items_init(results) {
  dd_items = results.data.filter(item => item["dataline"]);
  dd_scenes = $.unique(dd_items.map(function (d) {return d.actscene;}));
  sessionStorage.setItem("dd_items_store", JSON.stringify(dd_items));
  sessionStorage.setItem("dd_scenes_store", JSON.stringify(dd_scenes));
  sessionStorage.setItem("dd_title", dd_items[1].play);
  console.log(dd_items[1].play);
  pageInit(dd_items,dd_scenes);
  initial_scenes();
}
// Get the URL query string
const queryString = window.location.search;

// Parse the query string into an object
const urlParams = new URLSearchParams(queryString);

// Check if the "play" parameter exists and has a non-empty value
if (urlParams.has("play") && urlParams.get("play").trim().length > 0) {
  // Get the value of the "play" parameter
  var playParam = urlParams.get("play");

 /* use papaparse to get metadata from google sheets, then init page */
 Papa.parse(playParam, {
  download: true,
  header: true,
  complete: (results) => dd_items_init(results)
});
} 
else if (sessionStorage.getItem("dd_items_store")) {
  dd_items = JSON.parse(sessionStorage.getItem("dd_items_store"));
  pageInit(dd_items,dd_scenes);

} else if (current_metadata){ 
  /* use papaparse to get metadata from google sheets, then init page */

  Papa.parse(current_metadata, {
    download: true,
    header: true,
    complete: (results) => dd_items_init(results)
  });
} else { 
  /* use papaparse to get metadata from google sheets, then init page */
  Papa.parse("{{ site.play | relative_url | default: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4-hSjZe4pN0R2-fzmNyc_yrE355W1RgOBmYJ4PF-Lsyo1bKpWVKgwYqGOxGnMvvV41__J66Yjyxa1/pub?output=csv'}}", {
    download: true,
    header: true,
    complete: (results) => dd_items_init(results)
  });
}





function reset_dd_items(){
  
  sessionStorage.removeItem('dd_items_store');  
  location.reload(); 
};

//for initial loads



function initial_scenes(){
  for (var i = 0, len = dd_scenes.length; i < len; i++) {
    var ref_url = "{{ '/?scene=' | relative_url }}";
      var act = dd_scenes[i].split('.')[0];
      var scene = dd_scenes[i].split('.')[1];
      console.log(dd_scenes[i] + "-- Act" + act + " scene " + scene );
      var sceneClass = 'act' + act + 'scene' + scene;
      scenesNav += '<li class="dropdown-item"><a class="link-dark rounded " href="'+ ref_url +'act' + act + 'scene' + scene +'">Act ' + act + ', Scene ' + scene +'</a></li>'
      
  } 
  $("#scenesNavDropdown").html(scenesNav);}
