//Variables
var touched = 0;
var myTimer = 0;
var carID;
var myStorage = localStorage;
var status = 1; //Curent car status. Set to "Free" (1) on start

//On Ready
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
    //window.plugins.insomnia.keepAwake()    
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


var label2 = tabris.create("TextView", {
  font: "12px",
    textColor : "#fff",
    text : "count",
  layoutData: {centerX: 0, top: "#compositeGPS 10"}
}).appendTo(mainPage);

var testLabel = tabris.create("TextView", {
  font: "25px",
    textColor : "#fff",
    text : "სტატუსი",
  layoutData: {centerX: 0, top: [label2, 20]}
}).appendTo(mainPage);


// Car ID holder widget /////////////////////////////////////////////////////////////////////////////
var compositeCarID = tabris.create("Composite", {
  	layoutData: {top: 0, width : screenWidth(1), height: screenHeight(9), centerX: 0},
	id : "compositeCarID",
 	background: "#777"
}).appendTo(mainPage);

var compositeCarIDInner = tabris.create("Composite", {
  	layoutData: {top: 0, left : 0, right : 0 , bottom: 1},
 	background: "#000"
}).appendTo(compositeCarID);

var carIDLabel = tabris.create("TextView",{
    id : "carIDLabel",
    font : "50px",
    textColor : "#fff",    
    text : "",
    layoutData : {top : 0, centerX: 0}
}).appendTo(compositeCarIDInner);



// Gps info row //////////////////////////////////////////////////////////////////////////////////////

var compositeGPS = tabris.create("Composite", {
  	layoutData: {top: compositeCarID, width : screenWidth(1), height: screenHeight(9), centerX: 0},
	id : "compositeGPS",
 	background: "blue"
}).appendTo(mainPage);

var gpsImage = tabris.create("ImageView", {
    layoutData: {top : 1, left : 5, centerY: 0},
    id: "gpsImage"
    //image: {src: "res/images/gps_fixed.png"},
}).appendTo(compositeGPS);


var GPSlabel = tabris.create("TextView",{
    id : "GPSlabel",
    font : "12px",
    textColor : "#fff",    
    text : "GPS Info",
    layoutData : {left : "#gpsImage 10", centerY :0 }
}).appendTo(compositeGPS);

// End of GPS info row ///////////////////////////////////////////////////////////////////////////////




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
    "#buttonFree": {layoutData: {left: 0, height : screenHeight(6), bottom : 0, width :  screenWidth(2)}, background: "#2edc5f", alignment: "center", textColor : "#fff"},
    "#buttonOnWay": {layoutData: {left: "#buttonFree -5", right : 0, baseline: "#buttonFree", height : screenHeight(6), width :  screenWidth(2)}, background: "#dfb72d", alignment: "center", opacity: 0.5},
    "#buttonBusy": {layoutData: {left: 0, bottom: "#buttonFree -10", height : screenHeight(6), width :  screenWidth(2)}, background: "#d02e2e", alignment: "center", textColor : "#fff", opacity: 0.5},
    "#buttonOffduty": {layoutData: {left: "#buttonBusy -5", right : 0, baseline: "#buttonBusy", height : screenHeight(6), width :  screenWidth(2)}, background: "#bababa", alignment: "center", opacity: 0.5},
});

settingsPage.apply({
  "#carIDInputLabel": {layoutData: {left: 10, top: 18, width: 150}},
  "#CarID": {layoutData: {left: "#carIDInputLabel 10", right: 10, baseline: "#carIDInputLabel"}, background : "#fff"},
  "#pass": {layoutData: {left: 10, top: "#CarID 18", width: 150}},
  "#passInput": {layoutData: {left: "#pass 10", right: 10, baseline: "#pass"}, background : "#fff"},
  "#setId": {layoutData: {left: 5, top: "#passInput 58", height : 60, width :  screenWidth(2)}, background: "#424242", textColor: "white"},
  "#clearId": {layoutData: {left: "#setId -5", height : 60, baseline : "#setId",width :  screenWidth(2)}, background: "#424242", textColor: "white"},   
});
//End of Page styling /////////////

 
// End of object declarations ///////////////////////////////////////



//Event binding /////////////////////////////////////////////////////

//Override native back button action
tabris.app.on("backnavigation", function(app, options) {
  //options.preventDefault = true;
  //do something else than closing the page
});


//Used to calclulate widget dimentiones according to device scree size
function screenWidth(x){
    var screenWidth = window.screen.width;
    return Math.round(screenWidth / x);	
}

function screenHeight(x){
    var screenHeight = window.screen.height;
    return Math.round(screenHeight / x);	
}


tabris.device.on("change:orientation", function(device, orientation) {

    //Align button equaly on center depending on device screen width and orientation
    mainPage.apply({".statusBtns": {width: screenWidth(2)}});
    mainPage.apply({".statusBtns": {height: screenHeight(6)}});
	
	compositeCarID.set("width", screenWidth(1));
	compositeCarID.set("height", screenHeight(9));
	
	submitBtn.set("width", screenWidth(2));
	removeBtn.set("width", screenWidth(2));   
});


tabris.ui.find(".statusBtns").on("touchstart", function(widget) {	
    testLabel.set("text", this.id);    
    tabris.ui.find(".statusBtns").set("opacity", 0.5);
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
    GPSLocation.getCurrentPosition(onSuccess, onError, { timeout: 100 }); // increase timeout
}, 1000);


// onSuccess Callback. This method accepts a Position object, which contains the current GPS coordinates
var onSuccess = function(position) {
	
        GPSlabel.set("text", position.coords.latitude+' - '+position.coords.longitude); 
        gpsImage.set("image", {src: "res/images/gps_fixed.png"});   

};

// onError Callback receives a PositionError object
function onError(error) {
	
    /////////////////////
    // Code 2 - GPS off
    // Code 3 - Timeout    
    /////////////////////
    
    if (code == 2){    
        GPSlabel.set("text", error.code+' - '+error.message);
        gpsImage.set("image", {src: "res/images/gps_off.png"});        
    }
    else {
        GPSlabel.set("text", error.code+' - '+error.message);
        gpsImage.set("image", {src: "res/images/gps_not_fixed.png"});        
    }

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