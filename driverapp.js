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

});


tabris.create("Drawer").append(tabris.create("PageSelector"));


var button = tabris.create("Button", {
  text: "Get LatLon",
    background: "#fff",
  layoutData: {centerX: 0, top: 100}
}).appendTo(mainPage);

var button_1 = tabris.create("Button", {
  text: "Some action",
  layoutData: {centerX: 0, top: [button, 5]}
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
  layoutData: {centerX: 0, top: [button_1, 10]}
}).appendTo(mainPage);

var label2 = tabris.create("TextView", {
  font: "12px",
    text : scaleFactor,
  layoutData: {centerX: 0, top: [label, 20]}
}).appendTo(mainPage);


var settingsPage = tabris.create("Page", {
  title: "Configuretion",
    background: "blue",
  topLevel: true
}); 

tabris.create("TextView", {
  id: "carIDLabel",
  alignment: "left",
  text: "Enter Car ID:"
}).appendTo(settingsPage);

tabris.create("TextInput", {
  id: "CarID",
  message: "
}).appendTo(settingsPage);

tabris.create("TextView", {
  id: "pass",
  text: "Enter Password:"
}).appendTo(settingsPage);

tabris.create("TextInput", {
  id: "passInput",
  type: "password",
  message: ""
}).appendTo(settingsPage);


tabris.create("Button", {
  id: "done",
  text: "Change Car ID",
  background: "#8b0000",
  textColor: "white"
}).on("select", function() {
  populateMessage();
}).appendTo(settingsPage);


settingsPage.apply({
  "#carIDLabel": {layoutData: {left: 10, top: 18, width: 120}},
  "#CarID": {layoutData: {left: "#carIDLabel 10", right: 10, baseline: "#carIDLabel"}},
  "#pass": {layoutData: {left: 10, top: "#CarID 18", width: 120}},
  "#passInput": {layoutData: {left: "#pass 10", right: 10, baseline: "#pass"}},
  "#done": {layoutData: {left: 10, right: 10, top: "#passInput 18"}}
});


function populateMessage() {

}
 

// End of object declarations ///////////////////////////////////////

//Event binding

button.on("select", function() {
	GPSLocation.getCurrentPosition(onSuccess, onError);
});


// End of event binding /////////////////////////////////////////////


setInterval(function(){ 
    myTimer+=1; label2.set("text", myTimer.toString())
    GPSLocation.getCurrentPosition(onSuccess, onError);
}, 1000);



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