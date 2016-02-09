// Variables /////////////////////////////////////////////////////////////

var masterPassword = "123";
var masterKey = "Gtr85@!32dGt597!32$";

var touched = 0;
var myTimer = 0;
var carID;
var myStorage = localStorage;

var fontSmall = "18px";
var fontHeader = "50px";

var colorDimmed = "#858383";

var appURL = "http://tirisconi.com/taxi/insert_db_carinfo.php";

// Curent car status. Set to "Free" (1) on start /////////////////////////
var carStatus = 1;

var connectionStatus = {
    gps: {lat : "", lng : "", connected : false, reason : ""},
    data: {connected : false, type : ""}
};

var xhr = new tabris.XMLHttpRequest();

// On Ready //////////////////////////////////////////////////////////////
document.addEventListener("deviceready", onDeviceReady, false);


function onDeviceReady(){
    window.plugins.insomnia.keepAwake();
    
    // Data connection listeners
    document.addEventListener("offline", onDeviceOffline, false);
    document.addEventListener("online", onDeviceOnline, false);
    
}


// Check data connection on app startup. Listeners are not triggered on startup
function checkDataConnection(){    
    if (navigator.connection.type == "Connection.NONE"){ onDeviceOffline() }
    else { onDeviceOnline() }    
}

// Object declarations ///////////////////////////////////////////////////

tabris.create("Drawer").append(tabris.create("PageSelector",{background : "#d1d1d1", layoutData: {left: 0, top: 0, right: 0, bottom: 0}}));

var mainPage = tabris.create("Page", {
    title: "მთავარი",
    background: "#000",
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

var button = tabris.create("Button", {
    id: "b1",
    class : "statusBtns",
    text: "თავისუფალი"    
}).appendTo(mainPage);

var button_1 = tabris.create("Button", {
    id: "b3",
    class : "statusBtns",
    text: "გზაში"
}).appendTo(mainPage);

var button_2 = tabris.create("Button", {
    id: "b2",
    class : "statusBtns",
    text: "დაკავებული"
}).appendTo(mainPage);

var button_3 = tabris.create("Button", {
    id: "b4",
    class : "statusBtns",
    text: "შესვენება"
}).appendTo(mainPage);


var label2 = tabris.create("TextView", {
  font: "12px",
    textColor : "#fff",
    text : "count",
  layoutData: {centerX: 0, top: "#compositeGPSData 10"}
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
  	layoutData: {top: 1, left : 1, right : 1 , bottom: 1},
 	background: "#262626"
}).appendTo(compositeCarID);

var carIDLabel = tabris.create("TextView",{
    id : "carIDLabel",
    font : fontHeader,
    textColor : "#fff",    
    text : "#",
    layoutData : {top : 0, centerX: 0}
}).appendTo(compositeCarIDInner);

// End of Car ID holder widget ///////////////////////////////////////////////////////////////////////


// Data & Gps info row //////////////////////////////////////////////////////////////////////////////////////

//var gpsImage = tabris.create("ImageView", {
//    layoutData: {top : 1, left : 5, centerY: 0},
//    image : { src : "res/images/gps_not_fixed.png"},
//    id: "gpsImage"
//}).appendTo(compositeGPS);


var compositeGPSData = tabris.create("Composite", {
  	layoutData: {top: [compositeCarID, -1], width : screenWidth(1), height: screenHeight(8), centerX: 0},
	id : "compositeGPSData",
 	background: "#777"
}).appendTo(mainPage);

var compositeGPSDataInner = tabris.create("Composite", {
  	layoutData: {top: 1, left : 1, right : 1 , bottom: 1},
 	background: "#262626"
}).appendTo(compositeGPSData);

var GPSlabel = tabris.create("TextView",{
    id : "GPSlabel",
    font : fontSmall,
    textColor : colorDimmed,    
    text : "GPS კავშირი",
    layoutData : {left : 10, top: [compositeCarID,10] }
}).appendTo(compositeGPSData);

var dataLabel = tabris.create("TextView",{
    id : "dataLabel",
    font : fontSmall,
    textColor : colorDimmed,    
    text : "ინტერნეტ კავშირი",
    layoutData : {left : 10, top : [GPSlabel,5] }
}).appendTo(compositeGPSData);

// End of Data & GPS connection info ///////////////////////////////////////////////////////////////////////


var carIDInputLabel = tabris.create("TextView", {
    id: "carIDInputLabel",
    textColor : "#fff",
    text: "მანქანის ნომერი:"
}).appendTo(settingsPage);

var carIDInput = tabris.create("TextInput", {
    id: "CarID",
    textColor : "#fff",
    keyboard : "number",
}).appendTo(settingsPage);

var carInputPassLabel = tabris.create("TextView", {
    id: "pass",
    textColor : "#fff",
    text: "პაროლი:"
}).appendTo(settingsPage);

var carInputPass = tabris.create("TextInput", {
    id: "passInput",
    textColor : "#fff",
    type: "password",
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
    "#b1": {layoutData: {left: 0, height : screenHeight(6), bottom : 0, width :  screenWidth(2)}, background: "#2edc5f", alignment: "center", textColor : "#fff"},
    "#b3": {layoutData: {left: "#b1 -5", right : 0, baseline: "#b1", height : screenHeight(6), width :  screenWidth(2)}, background: "#dfb72d", alignment: "center", opacity: 0.5},
    "#b2": {layoutData: {left: 0, bottom: "#b1 -10", height : screenHeight(6), width :  screenWidth(2)}, background: "#d02e2e", alignment: "center", textColor : "#fff", opacity: 0.5},
    "#b4": {layoutData: {left: "#b2 -5", right : 0, baseline: "#b2", height : screenHeight(6), width :  screenWidth(2)}, background: "#bababa", alignment: "center", opacity: 0.5},
});

settingsPage.apply({
    "#carIDInputLabel": {layoutData: {left: 10, top: 18, width: 150}},
    "#CarID": {layoutData: {left: "#carIDInputLabel 10", right: 10, baseline: "#carIDInputLabel"}, background : "#fff"},
    "#pass": {layoutData: {left: 10, top: "#CarID 18", width: 150}},
    "#passInput": {layoutData: {left: "#pass 10", right: 10, baseline: "#pass"}, background : "#fff"},
    "#setId": {layoutData: {left: 5, top: "#passInput 58", height : 60, width :  screenWidth(2)}, background: "#424242", textColor: "white"},
    "#clearId": {layoutData: {left: "#setId -5", height : 60, baseline : "#setId",width :  screenWidth(2)}, background: "#424242", textColor: "white"},   
});

// End of Page styling /////////////////////////////////////////////////////////////////////////////////////////

 
// End of object declarations //////////////////////////////////////////////////////////////////////////////////


// Event binding ///////////////////////////////////////////////////////////////////////////////////////////////

function sendStatus(status, lat, lng){
    
    var status = status;
    var lat = lat;
    var lng = lng;
    
    
    var s = appURL + "?key=" + masterKey + "&carn=" + carID + "&status=" + status + "&lat=" + lat + "&lng=" + lng ; 
    
        xhr.open("GET", s);
        xhr.send();
    
        xhr.onreadystatechange = function() {
            
            if(xhr.readyState === xhr.DONE) {
                
                if(xhr.status === 200) {
                    var x = JSON.parse(xhr.responseText);
                    testLabel.set("text", x.key);    

                } else {
                    testLabel.set("text", xhr.status);                
                }         
            }   
            
        }//xhr.onreadystatechange    

    animateObject(testLabel); 

}


function animateObject (myObject){
    
    myObject.set("opacity", 1);            
    myObject.animate(
        { opacity: 0.0 }, 
        {   delay: 0,
            duration: 2000,
            repeat: 0,
            reverse: false,
            easing: "ease-in-out"
        }
    )    
}


//Override native back button action
tabris.app.on("backnavigation", function(app, options) {
    //options.preventDefault = true;
    //do something else than closing the page
});


// Calclulate widget dimentiones according to device scree size ////////////////////////////////////////////////
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
    
	compositeGPSData.set("width", screenWidth(1));
	compositeGPSData.set("height", screenHeight(8));    
	
	submitBtn.set("width", screenWidth(2));
	removeBtn.set("width", screenWidth(2));   
});


tabris.ui.find(".statusBtns").on("select", function(widget) {    
    
    //check if carID is set and GPS and data connection is available, before attempting to send car status
    if ((carID !="") && (connectionStatus.gps.connected === true) && (connectionStatus.data.connected === true) ){    
        
        tabris.ui.find(".statusBtns").set("opacity", 0.5);
        tabris.ui.find(".statusBtns").set("font", "16px");
    
        this.set("opacity", 1);
        this.set("font", "bold 16px");
    
        carStatus = this.get("id");
    
        //Extract substring for status. eg "b2" >> "2"
        var status = carStatus.substring(1, 2);
        sendStatus(status,"","");
    
    }
});


submitBtn.on("select", function(){    
    
    if ((carInputPass.get("text") == masterPassword) && (carIDInput.get("text") != "")) {
        carInputPass.set("background", "white");
        carIDInput.set("background", "white");
        
        myStorage.setItem("CarID",carIDInput.get("text"));
        carIDLabel.set("text", "#" + carIDInput.get("text"))
        carID =  carIDInput.get("text");
        
        mainPage.open();
    }
    else{
        carInputPass.set("background", "red");
        carIDInput.set("background", "red");        
    }
    
    carIDInput.set("text" , ""); 
    carInputPass.set("text" , "");
    
});

removeBtn.on("select", function(){    
    myStorage.removeItem("CarID");
    carIDLabel.set("text", "#?");
});

// End of event binding /////////////////////////////////////////////////////////////////////////////////////


setInterval(function(){ 
    //GPSLocation.getCurrentPosition(onSuccess, onError, { timeout: 1000 }); // increase timeout

    // For tests /////////////////////////
    myTimer+=1; 
    label2.set("text", myTimer.toString())
    //////////////////////////////////////
    
}, 5000);


function onDeviceOffline(){    
    connectionStatus.data.connected = false;
    dataLabel.set("text", "ინტერნეტ კავშირი: გამორთული");
    dataLabel.set("textColor", "#d02e2e");
}

function onDeviceOnline(){    
    connectionStatus.data.connected = true;
    dataLabel.set("text", "ინტერნეტ კავშირი: OK");
    dataLabel.set("textColor", "#2edc5f");    
}


// onSuccess Callback. This method accepts a Position object, which contains the current GPS coordinates
var onSuccess = function(position){
        connectionStatus.gps.lat = position.coords.latitude;
        connectionStatus.gps.lng = position.coords.longitude;
        connectionStatus.gps.connected = true;
	
        GPSlabel.set("textColor", "#2edc5f");
        GPSlabel.set("text", "GPS კავშირი : OK"); 
        
    label2.set("text", connectionStatus.gps.lat + " | " +connectionStatus.gps.lng);
    GPSLocation.getCurrentPosition(onSuccess, onError, { timeout: 5000 });
};

// onError Callback receives a PositionError object ////////////////////////////////////////////////////////

function onError(error){
	
    /////////////////////// Code 2 - GPS off, Code 3 - Timeout  /////////////////////
    
    if (error.code == 2){    
        connectionStatus.gps.lat = "--";
        connectionStatus.gps.lng = "--";
        connectionStatus.gps.connected = false;
        connectionStatus.gps.reason = error.code + " | " +error.message;

        GPSlabel.set("textColor", "#d02e2e");
        GPSlabel.set("text", "GPS კავშირი : გამორთული");
        
        label2.set("text", connectionStatus.gps.lat + " | " +connectionStatus.gps.lng);
    }
    else {
        connectionStatus.gps.lat = "--";
        connectionStatus.gps.lng = "--";
        connectionStatus.gps.connected = false;
        connectionStatus.gps.reason = error.code + " | " +error.message;        

        GPSlabel.set("textColor", "#dfb72d");
        GPSlabel.set("text", "GPS კავშირი: სიგნალის ძიება");
        
        label2.set("text", connectionStatus.gps.reason);
    }
    GPSLocation.getCurrentPosition(onSuccess, onError, { timeout: 5000 });
}


// Check initial data connection    
checkDataConnection();
GPSLocation.getCurrentPosition(onSuccess, onError, { timeout: 5000 }); 


carID = localStorage.getItem("CarID");

if (carID) { carIDLabel.set("text", "#" + carID); mainPage.open();}
else { carIDLabel.set("text", "#?"); settingsPage.open()};