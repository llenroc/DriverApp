//Variables
var touched = 0;
var scaleFactor = tabris.device.get("scaleFactor"); //get device scale
var myTimer = 0;

var carID;


// Object declarations ///////////////////////////////////////////////////


var mainPage = tabris.create("Page", {
    title: "მთავარი",
    background: "#000",
    //image: "images/my-page.png",
    topLevel: true
});


var settingsPage = tabris.create("Page", {
  title: "პარამეტრები",
    background: "#000",
  topLevel: true
}); 

var updatePage = tabris.create("Page", {
    title: "პროგრამის განახლება",
    background: "#000",
    topLevel: true
}); 

//tabris.create("Action", {
//  title: "Settings",
//  image: {src: "res/images/settings.png", scale: scaleFactor}
//}).on("select", function() {

//});


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
    textColor : "#fff",
  layoutData: {centerX: 0, top: [button_1, 10]}
}).appendTo(mainPage);

var label2 = tabris.create("TextView", {
  font: "12px",
    textColor : "#fff",
    text : "",
  layoutData: {centerX: 0, top: [label, 20]}
}).appendTo(mainPage);

var testLabel = tabris.create("TextView", {
  font: "25px",
    textColor : "#fff",
    text : "სტატუსი",
  layoutData: {centerX: 0, top: [label2, 20]}
}).appendTo(mainPage);



var carIDLabel = tabris.create("TextView",{
    font : "22px",
    textColor : "#fff",    
    background : "red",
    text : "მანქანა ნომერი #",
    layoutData : {left : 5, top : 5, height : 30 }
}).appendTo(mainPage);




tabris.create("TextView", {
    id: "carIDLabel",
    alignment: "left",
    textColor : "#fff",
    text: "მანქანის ნომერი:"
}).appendTo(settingsPage);

tabris.create("TextInput", {
    id: "CarID",
    textColor : "#fff",
    message: ""
}).appendTo(settingsPage);

tabris.create("TextView", {
    id: "pass",
    textColor : "#fff",
    text: "პაროლი:"
}).appendTo(settingsPage);

tabris.create("TextInput", {
    id: "passInput",
    textColor : "#fff",
    type: "password",
    message: ""
}).appendTo(settingsPage);


tabris.create("Button", {
  id: "done",
  text: "დამახსოვრება",
  background: "#8b0000",
  textColor: "white"
}).on("select", function() {
  populateMessage();
}).appendTo(settingsPage);


//Page styling /////////////

mainPage.apply({
  "#buttonFree": {layoutData: {left: 0, height : buttonHeight(), bottom : 0, width :  buttonWidth()}, background: "#2edc5f", alignment: "center", border : "#d02e2e"},
  "#buttonOnWay": {layoutData: {left: "#buttonFree -5", right : 0, baseline: "#buttonFree", height : buttonHeight(), width :  buttonWidth()}, background: "#dfb72d", alignment: "center"},
  "#buttonBusy": {layoutData: {left: 0, bottom: "#buttonFree -10", height : buttonHeight(), width :  buttonWidth()}, background: "#d02e2e", alignment: "center"},
  "#buttonOffduty": {layoutData: {left: "#buttonBusy -5", right : 0, baseline: "#buttonBusy", height : buttonHeight(), width :  buttonWidth()}, background: "#bababa", alignment: "center"}
});

settingsPage.apply({
  "#carIDLabel": {layoutData: {left: 10, top: 18, width: 120}},
  "#CarID": {layoutData: {left: "#carIDLabel 10", right: 10, baseline: "#carIDLabel"}},
  "#pass": {layoutData: {left: 10, top: "#CarID 18", width: 120}},
  "#passInput": {layoutData: {left: "#pass 10", right: 10, baseline: "#pass"}},
  "#done": {layoutData: {left: 10, right: 10, top: "#passInput 58"}}
});


//End of Page styling /////////////

function populateMessage() {

}
 

// End of object declarations ///////////////////////////////////////



//Event binding //////////////////


//Override native back button action
tabris.app.on("backnavigation", function(app, options) {
  //options.preventDefault = true;
  // do something else than closing the page
});



function buttonWidth(){    
    var screenWidth = window.screen.width;
    return Math.round(screenWidth / 2);    
}

function buttonHeight(){    
    var screenHeight = window.screen.height;
    return Math.round((screenHeight / 3)/2);  
}

tabris.device.on("change:orientation", function(device, orientation) {
  
    //Align button equaly on center depending on device screen width and orientation
    mainPage.apply({".statusBtns": {width: buttonWidth()}});
    mainPage.apply({".statusBtns": {height: buttonHeight()}});    
});



tabris.ui.find(".statusBtns").on("select", function() {
	
    testLabel.set("text", this.id)
    
});


// End of event binding /////////////////////////////////////////////


setInterval(function(){ 
    myTimer+=1; label2.set("text", myTimer.toString())
    //GPSLocation.getCurrentPosition(onSuccess, onError);
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

if (carID) {mainPage.open()}
else settingsPage.open();