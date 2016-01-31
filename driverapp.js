//Variables
var touched = 0;
var scaleFactor = tabris.device.get("scaleFactor"); //get device scale
var myTimer = 0;


// Object declarations ///////////////////////////////////////////////////


var mainPage = tabris.create("Page", {
    title: "main page",
    background: "#fff",
    //image: "images/my-page.png",
    topLevel: true
});

tabris.create("Action", {
  title: "Settings",
  image: {src: "res/images/settings.png", scale: scaleFactor}
}).on("select", function() {
  openSettings();
});


tabris.create("Drawer").append(tabris.create("PageSelector"));


var button = tabris.create("Button", {
  text: "Get LatLon",
    background: "#fff",
  layoutData: {centerX: 0, top: 100}
}).appendTo(mainPage);

var button_1 = tabris.create("Button", {
  text: "Some action",
  layoutData: {centerX: 0, top: 150}
}).appendTo(mainPage);




tabris.create("ImageView", {
  layoutData: {centerX: 0, centerY: 0, top: [label2,10]},
  image: {src: "res/images/car.png"},
  highlightOnTouch: true
}).on("tap", function() {
  touched++;
  mainPage.set("title", "touched " + touched + " times");
}).appendTo(mainPage);


var label = tabris.create("TextView", {
  font: "12px",
  layoutData: {centerX: 0, top: [button_1, 50]}
}).appendTo(mainPage);

var label2 = tabris.create("TextView", {
  font: "12px",
    text : scaleFactor,
  layoutData: {centerX: 0, top: [label, 50]}
}).appendTo(mainPage);


var settingsPage = tabris.create("Page", {
  title: "Hello, World! 222",
  topLevel: true
});

// End of object declarations ///////////////////////////////////////

//Event binding

button.on("select", function() {
	GPSLocation.getCurrentPosition(onSuccess, onError);
});


// End of event binding /////////////////////////////////////////////


setInterval(function(){ myTimer+=1; label2.set("text", myTimer.toString()) }, 1000);


function openSettings(){
    
    settingsPage.open();
    
}

// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
var onSuccess = function(position) {
	label.set("text", position.coords.latitude+' - '+position.coords.longitude);
};

// onError Callback receives a PositionError object
//
function onError(error) {
	label.set("text", error.code+' - '+error.message);
}

mainPage.open();