//Variables
var touched = 0;
var scaleFactor = tabris.device.get("scaleFactor"); //get device scale
var myTimer = 0;
var screenWidth = window.screen.width;

var halfscr = Math.round(screenWidth / 2);


// Object declarations ///////////////////////////////////////////////////


var mainPage = tabris.create("Page", {
    title: "main page",
    background: "#fff",
    //image: "images/my-page.png",
    topLevel: true
});


//tabris.create("Action", {
//  title: "Settings",
//  image: {src: "res/images/settings.png", scale: scaleFactor}
//}).on("select", function() {

//});


window.plugins.imei.get(
  function(imei) {
    console.log("got imei: " + imei);
  },
  function() {
    console.log("error loading imei");
  }
);


tabris.create("Drawer").append(tabris.create("PageSelector"));


var button = tabris.create("Button", {
    id: "buttonFree",
    class : "statusBtns",
    text: "თავისუფალი"    
}).appendTo(mainPage);

var button_1 = tabris.create("Button", {
    id: "buttonOnWay",
    class : "statusBtns",
    text: "გზაში"
}).appendTo(mainPage);

var button_2 = tabris.create("Button", {
    id: "buttonBusy",
    class : "statusBtns",
    text: "დაკავებული"
}).appendTo(mainPage);

var button_3 = tabris.create("Button", {
    id: "buttonOffduty",
    class : "statusBtns",
    text: "შესვენება"
}).appendTo(mainPage);


mainPage.apply({
  "#buttonFree": {layoutData: {left: 0, height : 100, bottom : 0, width :  halfscr}, background: "#2edc5f", alignment: "center"},
  "#buttonOnWay": {layoutData: {left: "#buttonFree -5", right : 0, baseline: "#buttonFree", height : 100, width :  halfscr}, background: "#dfb72d", alignment: "center"},
  "#buttonBusy": {layoutData: {left: 0, bottom: "#buttonFree -10", height : 100, width :  halfscr}, background: "#d02e2e", alignment: "center"},
  "#buttonOffduty": {layoutData: {left: "#buttonBusy -5", right : 0, baseline: "#buttonBusy", height : 100, width :  halfscr}, background: "#bababa", alignment: "center"}
});



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
    text : "",
  layoutData: {centerX: 0, top: [label, 20]}
}).appendTo(mainPage);




var settingsPage = tabris.create("Page", {
  title: "Configuration",
    background: "#fff",
  topLevel: true
}); 

tabris.create("TextView", {
  id: "carIDLabel",
  alignment: "left",
  text: "Enter Car ID:"
}).appendTo(settingsPage);

tabris.create("TextInput", {
  id: "CarID",
  message: ""
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
  "#done": {layoutData: {left: 10, right: 10, top: "#passInput 58"}}
});


function populateMessage() {

}
 

// End of object declarations ///////////////////////////////////////

//Event binding


//Override native back button action
tabris.app.on("backnavigation", function(app, options) {
  //options.preventDefault = true;
  // do something else than closing the page
});



tabris.device.on("change:orientation", function(device, orientation) {
  
    //Align button equaly on center depending on device screen width and orientation
    screenWidth = window.screen.width;
    halfscr = Math.round(screenWidth / 2);    
    mainPage.apply({".statusBtns": {width: halfscr}});
    
});



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