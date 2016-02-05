//Variables
var touched = 0;
var myTimer = 0;

var carID;

var myStorage = localStorage;



document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){

    window.plugins.insomnia.keepAwake()
    
}



// Object declarations ///////////////////////////////////////////////////


//tabris.ui.set("background", "#2196F3");

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


var button_free = tabris.create("Composite", { id : "button_free", class: "statusBtns",}).appendTo(updatePage);
var button_free_sub1 = tabris.create("Composite", { id : "button_free_sub1"}).appendTo(button_free);
var button_free_sub2 = tabris.create("Composite", { id : "button_free_sub2", class : "sub2"}).appendTo(button_free_sub1);
var button_free_text = tabris.create("TextView", {
    text: "თავისუფალი",
    font: "bold 16px",
    textColor: "#fff",
    layoutData: {centerX: 0, centerY: 0}
}).appendTo(button_free_sub2);


var button_onway = tabris.create("Composite", { id : "button_onway", class: "statusBtns",}).appendTo(updatePage);
var button_onway_sub1 = tabris.create("Composite", { id : "button_onway_sub1"}).appendTo(button_onway);
var button_onway_sub2 = tabris.create("Composite", { id : "button_onway_sub2", class : "sub2"}).appendTo(button_onway_sub1);
var button_onway_text = tabris.create("TextView", {
    text: "გზაში",
    font: "bold 16px",
    textColor: "#fff",
    layoutData: {centerX: 0, centerY: 0}
}).appendTo(button_onway_sub2);


var button_busy = tabris.create("Composite", { id : "button_busy", class: "statusBtns",}).appendTo(updatePage);
var button_busy_sub1 = tabris.create("Composite", { id : "button_busy_sub1"}).appendTo(button_busy);
var button_busy_sub2 = tabris.create("Composite", { id : "button_busy_sub2", class : "sub2"}).appendTo(button_busy_sub1);
var button_busy_text = tabris.create("TextView", {
    text: "დაკავებული",
    font: "bold 16px",
    textColor: "#fff",
    layoutData: {centerX: 0, centerY: 0}
}).appendTo(button_busy_sub2);


var button_offduty = tabris.create("Composite", { id : "button_offduty", class: "statusBtns",}).appendTo(updatePage);
var button_offduty_sub1 = tabris.create("Composite", { id : "button_offduty_sub1"}).appendTo(button_offduty);
var button_offduty_sub2 = tabris.create("Composite", { id : "button_offduty_sub2", class : "sub2"}).appendTo(button_offduty_sub1);
var button_offduty_text = tabris.create("TextView", {
    text: "შესვენება",
    font: "bold 16px",
    textColor: "#fff",
    layoutData: {centerX: 0, centerY: 0}
}).appendTo(button_offduty_sub2);




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
    id : "carIDLabel",
    font : "50px",
    textColor : "#fff",    
    text : "",
    layoutData : {top : 5, centerX: 0}
}).appendTo(mainPage);




var carIDInputLabel = tabris.create("TextView", {
    id: "carIDInputLabel",
    textColor : "#fff",
    text: "მანქანის ნომერი:"
}).appendTo(settingsPage);

var carIDInput = tabris.create("TextInput", {
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


var submitBtn = tabris.create("Button", {
  id: "setId",
  text: "დამახსოვრება"
}).appendTo(settingsPage);

var removeBtn = tabris.create("Button", {
  id: "clearId",
  text: "განულება"
}).appendTo(settingsPage);


//Page styling /////////////

mainPage.apply({
    "#buttonFree": {layoutData: {left: 0, height : buttonHeight(), bottom : 0, width :  buttonWidth()}, background: "#2edc5f", alignment: "center", textColor : "#fff"},
    "#buttonOnWay": {layoutData: {left: "#buttonFree -5", right : 0, baseline: "#buttonFree", height : buttonHeight(), width :  buttonWidth()}, background: "#dfb72d", alignment: "center", opacity: 0.4},
    "#buttonBusy": {layoutData: {left: 0, bottom: "#buttonFree -10", height : buttonHeight(), width :  buttonWidth()}, background: "#d02e2e", alignment: "center", textColor : "#fff", opacity: 0.4},
    "#buttonOffduty": {layoutData: {left: "#buttonBusy -5", right : 0, baseline: "#buttonBusy", height : buttonHeight(), width :  buttonWidth()}, background: "#bababa", alignment: "center", opacity: 0.4},
});

settingsPage.apply({
  "#carIDInputLabel": {layoutData: {left: 10, top: 18, width: 150}},
  "#CarID": {layoutData: {left: "#carIDInputLabel 10", right: 10, baseline: "#carIDInputLabel"}, background : "#fff"},
  "#pass": {layoutData: {left: 10, top: "#CarID 18", width: 150}},
  "#passInput": {layoutData: {left: "#pass 10", right: 10, baseline: "#pass"}, background : "#fff"},
  "#setId": {layoutData: {left: 5, top: "#passInput 58", height : 60, width :  buttonWidth()}, background: "#424242", textColor: "white"},
  "#clearId": {layoutData: {left: buttonWidth(), height : 60,  baseline: "#setId", width :  buttonWidth()}, background: "#424242", textColor: "white"},   
});


updatePage.apply({
    "#button_free": {layoutData: {left: 0, height : buttonHeight(), bottom : 0, width :  buttonWidth()}, background: "#2edc5f", alignment: "center"},
    "#button_free_sub1": { layoutData: {left: "#button_free 3", top: "#button_free 3", bottom: "#button_free 3", right: "#button_free 3"}, background: "#000"},
    "#button_free_sub2": {layoutData: {left: "#button_free_sub1 3", top: "#button_free_sub1 3", bottom: "#button_free_sub1 3", right: "#button_free_sub1 3"}, background: "#2edc5f"},    
    
    "#button_onway": {layoutData: {left: "#button_free", right : 0, bottom : 0, height : buttonHeight(), width :  buttonWidth()}, background: "#dfb72d", alignment: "center"},
    "#button_onway_sub1": { layoutData: {left: "#button_onway 3", top: "#button_onway 3", bottom: "#button_onway 3", right: "#button_onway 3"}, background: "#000"},
    "#button_onway_sub2": {layoutData: {left: "#button_onway_sub1 3", top: "#button_onway_sub1 3", bottom: "#button_onway_sub1 3", right: "#button_onway_sub1 3"}, background: "#dfb72d", opacity: 0.6},   
    
    "#button_busy": {layoutData: {left: 0, bottom: "#button_free", height : buttonHeight(), width :  buttonWidth()}, background: "#d02e2e", alignment: "center", textColor : "#fff"},
    "#button_busy_sub1": { layoutData: {left: "#button_busy 3", top: "#button_busy 3", bottom: "#button_busy 3", right: "#button_busy 3"}, background: "#000"},
    "#button_busy_sub2": {layoutData: {left: "#button_busy_sub1 3", top: "#button_busy_sub1 3", bottom: "#button_busy_sub1 3", right: "#button_busy_sub1 3"}, background: "#d02e2e", opacity: 0.6},     
    
    "#button_offduty": {layoutData: {left: "#button_busy", right : 0, bottom: "#button_onway", height : buttonHeight(), width :  buttonWidth()}, background: "#bababa", alignment: "center"},
    "#button_offduty_sub1": { layoutData: {left: "#button_offduty 3", top: "#button_offduty 3", bottom: "#button_offduty 3", right: "#button_offduty 3"}, background: "#000"},
    "#button_offduty_sub2": {layoutData: {left: "#button_offduty_sub1 3", top: "#button_offduty_sub1 3", bottom: "#button_offduty_sub1 3", right: "#button_offduty_sub1 3"}, background: "#bababa", opacity: 0.6},     
    
    
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
    
    updatePage.apply({".statusBtns": {width: buttonWidth()}});
    updatePage.apply({".statusBtns": {height: buttonHeight()}});      
    
});



updatePage.find(".sub2").on("touchstart", function(widget) {	
    //testLabel.set("text", this.id);
    
    
    tabris.ui.find(".sub2")._parent.set("background", tabris.ui.find(".sub2").get("background"));
     
    
    this._parent.set("background", "#000");  
    
    tabris.ui.find(".sub2").set("opacity", 0.6);
    this.set("opacity", 1);
    
});


submitBtn.on("select", function(){    
    myStorage.setItem("CarID",carIDInput.get("text"));
    carIDLabel.set("text", "#" + carIDInput.get("text"))
    carIDInput.set("text", "");
    mainPage.open();
});

removeBtn.on("select", function(){    
    //carIDInput.set("text", localStorage.getItem("CarID"));
    myStorage.removeItem("CarID");
    carIDLabel.set("text", "#?");
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

carID = localStorage.getItem("CarID");

if (carID) {
    
    carIDLabel.set("text", "#" + carID);
    mainPage.open();

}
else {

    carIDLabel.set("text", "#?");
    settingsPage.open()

};