// App for Driver tracking ////////////////////////////////////////////////////

var masterPassword = "123";
var masterKey = "Gtr85@!32dGt597!32$";

var fontSmall = "18px";
var fontMed = "30px";
var fontHeader = "50px";
var MARGIN_SMALL = 10;

var colorDimmed = "#858383";
var pageBgColor = "#000";
var startpageBgColor = "#000";
var linkColor = "#70d5ff";
var infoColor = "#fff070";

var appURL = "http://taxi232222.com/taxi/insert_db_carinfo.php";
var patchUrl = "http://taxi232222.com/taxi/patch/";

//var myTimer = 0;
var carID;
var carStatus = 5; // Curent car status. Set to "OffDuty" (5) on start
var myStorage = localStorage;
var buttonClicked = false;

var connectionStatus = {
    gps: {lat : "", lng : "", connected : false, reason : ""},
    data: {connected : false, type : ""}
};

var xhr = new tabris.XMLHttpRequest();
var patchAvail;
var watchID = null;
var helpPage;
var appAbout = require("./about.json");


//Check for new update patch. Run on app start
function checkUpdate(){
    var patch = new tabris.XMLHttpRequest();
    var s = patchUrl + "patch.json";
    patch.open("GET", s);
    patch.send();

    patch.onreadystatechange = function() {
        if(patch.readyState === patch.DONE) {
            if(patch.status === 200) {
              patchAvail = JSON.parse(patch.responseText);
              var comp = compare(appAbout.version, patchAvail.version);

              console.log(appAbout.version);
              console.log(patchAvail.version);

              if(comp < 0 ){
                var msg = "ნაპოვნია ახალი ვერსია - "+ patchAvail.version + ". გადმოვწეროთ?";
                //Dialogue box before update
                 navigator.notification.confirm(msg,
                     function(buttonIndex) {
                         if (buttonIndex == 1) {
                            appUpdate();
                             return true;
                         }
                     }, 'პროგრამის განახლება', ['დიახ','არა']
                 )//End of Dialogue
              }//End of comparison
            }
        }
    }//End of XLM
}

function appUpdate(){
  var s = patchUrl + "src.zip";
  tabris.app.installPatch(s, function(error, patch) {
    if (error) {
      // show error dialog
      console.log("error");
    } else {
      // confirm reload
      tabris.app.reload();
    }
  });
}


// On Ready //////////////////////////////////////////////////////////////
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
    //window.plugins.insomnia.keepAwake();
    // Data connection listeners
    document.addEventListener("offline", onDeviceOffline, false);
    document.addEventListener("online", onDeviceOnline, false);
}

// Check data connection on app startup. Listeners are not triggered on startup
function checkDataConnection(){
    if (navigator.connection.type == "Connection.NONE"){ onDeviceOffline() }
    else { onDeviceOnline() }
}

// StartPage UI /////////////////////////////////////////////////////////////
var startPage = tabris.create("Page", {
    title: "საწყისი გვერდი",
    background: startpageBgColor,
    topLevel: true
});

var settingsImg = new tabris.ImageView({
  image: "res/images/xhdpi/ic_settings.png",
  layoutData: {bottom : MARGIN_SMALL, right : MARGIN_SMALL}
}).appendTo(startPage).on("tap", function(){
  createSettingsPage().open();
});

var aboutImg = new tabris.ImageView({
  image: "res/images/xhdpi/ic_help.png",
  layoutData: {bottom : MARGIN_SMALL, right : MARGIN_SMALL + 55}
}).appendTo(startPage).on("tap", function(){
  helpPage = createHelpPage();
  helpPage.open();
});

var StartJob = tabris.create("Button", {
    id: "StartJob",
    left: 0,
    top : screenHeight(5),
    height : screenHeight(4),
    width :  screenWidth(1),
    background: "#2edc5f",
    alignment: "center",
    textColor : "#000",
    font : fontMed,
    text: "მუშაობის დაწყება"
}).appendTo(startPage).on("select", function(){startJobCheck();});

// End os startPage Page UI /////////////////////////////////////////////////////////////
function startJobCheck(){
  if (carID) {
    carIDLabel.set("text", "#" + carID);
    gpsReq();
    mainPage.open();
  }
  else {
    createSettingsPage().open();
  };
}

// Main Page UI /////////////////////////////////////////////////////////////
var mainPage = tabris.create("Page", {
    title: "მთავარი",
    background: pageBgColor,
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
    text: "გზაში",
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

    // Car ID holder widget
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

    // Data & Gps info row //////////////////////////////////////////////////////////////////////////////////////
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

    var GPSposLabel = tabris.create("TextView", {
        font: "12px",
        textColor : "#fff",
        text : "count",
        layoutData: {centerX: 0, top: "#compositeGPSData 10"}
    }).appendTo(mainPage);

    var feedbackLabel = tabris.create("TextView", {
      font: "25px",
      textColor : "#fff",
      text : "სტატუსი",
      layoutData: {centerX: 0, top: [GPSposLabel, 20]}
    }).appendTo(mainPage);

    mainPage.apply({
        "#b1": {layoutData: {left: 0, height : screenHeight(6), bottom : 0, width :  screenWidth(2)}, background: "#2edc5f", alignment: "center", textColor : "#fff", opacity: 0.5},
        "#b3": {layoutData: {left: "#b1 -5", baseline: "#b1", height : screenHeight(6), width :  screenWidth(2)}, background: "#dfb72d", alignment: "center", opacity: 0.5},
        "#b2": {layoutData: {left: 0, bottom: "#b1 -10", height : screenHeight(6), width :  screenWidth(2)}, background: "#d02e2e", alignment: "center", textColor : "#fff", opacity: 0.5},
        "#b4": {layoutData: {left: "#b2 -5", baseline: "#b2", height : screenHeight(6), width :  screenWidth(2)}, background: "#bababa", alignment: "center", opacity: 0.5},
    });

// End of Main Page UI ////////////////////////////////////////////////////////////////

function createSettingsPage() {

  var Page = new tabris.create("Page", {
      title: "პარამეტრები",
      background: pageBgColor
  });

  var carIDInputLabel = tabris.create("TextView", {
      id: "carIDInputLabel",
      textColor : "#fff",
      text: "მანქანის ნომერი:"
  }).appendTo(Page);

  var carIDInput = tabris.create("TextInput", {
      id: "CarID",
      textColor : "#fff",
      keyboard : "number",
  }).appendTo(Page);

  var carInputPassLabel = tabris.create("TextView", {
      id: "pass",
      textColor : "#fff",
      text: "პაროლი:"
  }).appendTo(Page);

  var carInputPass = tabris.create("TextInput", {
      id: "passInput",
      textColor : "#fff",
      type: "password",
  }).appendTo(Page);

  var submitBtn = tabris.create("Button", {
    id: "setId",
    text: "დამახსოვრება"
  }).appendTo(Page);

  var removeBtn = tabris.create("Button", {
    id: "clearId",
    text: "განულება"
  }).appendTo(Page);

  Page.apply({
      "#carIDInputLabel": {layoutData: {left: 10, top: 18, width: 150}},
      "#CarID": {layoutData: {left: "#carIDInputLabel 10", right: 10, baseline: "#carIDInputLabel"}, background : "#fff"},
      "#pass": {layoutData: {left: 10, top: "#CarID 18", width: 150}},
      "#passInput": {layoutData: {left: "#pass 10", right: 10, baseline: "#pass"}, background : "#fff"},
      "#setId": {layoutData: {left: 5, top: "#passInput 58", height : 60, width :  screenWidth(2)}, background: "#424242", textColor: "white"},
      "#clearId": {layoutData: {left: "#setId -5", height : 60, baseline : "#setId",width :  screenWidth(2)}, background: "#424242", textColor:"white"}
  });

  if (carID){carIDInput.set("text", carID)}

  //Input Car ID ///////////////////////////////////////////////////////////////////////////////////////////
  submitBtn.on("select", function(){

      if ((carInputPass.get("text") == masterPassword) && (carIDInput.get("text") != "")) {
          carInputPass.set("background", "white");
          carIDInput.set("background", "white");

          carID =  carIDInput.get("text");

          carIDLabel.set("text", "#" + carID);
          myStorage.setItem("CarID",carID);
          gpsReq();
          mainPage.open();
      }
      else{
          carInputPass.set("background", "red");
          carIDInput.set("background", "red");
      }
  });

  //Remove Car ID from localStorage and UI ///////////////////////////////////////////////////////////////
  removeBtn.on("select", function(){
      if ( carInputPass.get("text") == masterPassword) {
          myStorage.removeItem("CarID");
          carIDLabel.set("text", "#?");
          carID = "";
          carInputPass.set("background", "white");
      }
      else{ carInputPass.set("background", "red"); }

      carInputPass.set("text","");
  });

  return Page;
}

//Help, Abount page ////////////////////////////////////////////////////////////
function createHelpPage(){

    var Page = tabris.create("Page",{
        title: "დამხმარე გვერდი",
        background: pageBgColor,
    });

    var infoText = tabris.create("TextView", {
      textColor : "#fff",
      markupEnabled: true,
      text : "232222 ტაქსის ეკიპაჟისთვის <p/>" +
      "აპლიკაციის მუშაობისთვის საჭიროა GPS და ინტერნეტ კავშირი",
      layoutData: {
        left: MARGIN_SMALL,
        top: MARGIN_SMALL
      }
    }).appendTo(Page);

    var versionText = tabris.create("TextView", {
      textColor : infoColor,
      text : "აპლიკაციის ვერსია -",
      layoutData: {
        left: MARGIN_SMALL,
        top: [infoText, 15]
      }
    }).appendTo(Page);

    versionText.set("text", "აპლიკაციის ვერსია - " + appAbout.version);

    return Page;
}
// End of Help Page UI /////////////////////////////////////////////////////////////

// Update car status and Lat,Lng
function sendStatus(status, lat, lng, callback){
    var s = appURL + "?key=" + masterKey + "&carn=" + carID + "&status=" + status + "&lat=" + lat + "&lng=" + lng;
        xhr.open("GET", s);
        xhr.send();
        xhr.onreadystatechange = function() {
            if(xhr.readyState === xhr.DONE) {
                //console.log('xhr.DONE | Status: '+xhr.status.toString()+' - '+Math.floor(Date.now()/1000).toString());
                if(xhr.status === 200) {
                    var x = JSON.parse(xhr.responseText);
                    feedbackLabel.set("text", x.result);
                    callback(true);
                } else {
                    feedbackLabel.set("text", xhr.status);
                }
            }
            //To avoid multiple rapid clicks
            buttonClicked = false;
        }//xhr.onreadystatechange
    animateObject(feedbackLabel);
}

function animateObject(myObject){
    myObject.set("opacity", 1);
    myObject.animate({opacity: 0.0}, {delay: 0, duration: 2000, repeat: 0, reverse: false, easing: "ease-in-out"});
}

//Override native back button action
tabris.app.on("backnavigation", function(app, options) {
    if (tabris.ui.get("activePage") == mainPage) {
        options.preventDefault = true;
        navigator.notification.confirm(
            'გსურთ დაასრულოთ მუშაობა?',
            function(buttonIndex) {
                if (buttonIndex == 1) {
                    //If XMLHTTP request successful callback (status set to 5 = offDuty) then go to start page.
                    sendStatus(5,"","", function (result){
                        if (result){
                            startPage.open();
                            options.preventDefault = false;
                            tabris.ui.find(".statusBtns").set("opacity", 0.5);
                            tabris.ui.find(".statusBtns").set("font", "16px");
                            connectionStatus.gps.connected = false;
                            GPSLocation.clearWatch(watchID);
                        }
                    });
                }
            }, 'Exit', ['დიახ','არა']
        );
    }
});

// Calclulate widget dimentions according to device scree size ////////////////////////////////////////////////
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

});


tabris.ui.find(".statusBtns").on("select", function(widget) {
    //check if carID is set and GPS and data connection is available, before attempting to send car status
    if ((carID !="") && (connectionStatus.data.connected == true) && (!buttonClicked)){

        tabris.ui.find(".statusBtns").set("opacity", 0.5);
        tabris.ui.find(".statusBtns").set("font", "16px");

        this.set("opacity", 1);
        this.set("font", "bold 16px");

        carStatus = this.get("id");

        //Extract substring for status. eg "b2" >> "2"
        var status = carStatus.substring(1, 2);
        buttonClicked = true;
        sendStatus(status,"","",function (result){});
    }
});

var lastCoordTime = 0;
var GPSsendTimeOut = 10;

// GPS position fetch loop ////////////////////////////////////////////////////////////////////////////
function gpsReq(){
	//watchID = GPSLocation.watchPosition(onSuccess, onError, {maximumAge: 5000, timeout: 5000});
}

// onSuccess Callback. This method accepts a Position object, which contains the current GPS coordinates
var onSuccess = function(position){

  console.log("gps still on");

	var currentTime = Math.floor(Date.now() / 1000);

    connectionStatus.gps.lat = position.coords.latitude;
    connectionStatus.gps.lng = position.coords.longitude;
    connectionStatus.gps.heading = position.coords.heading;
    connectionStatus.gps.connected = true;

	if(currentTime - lastCoordTime > GPSsendTimeOut){
		lastCoordTime = currentTime;
		sendStatus("", connectionStatus.gps.lat, connectionStatus.gps.lng, function(result){});
	}

	  GPSlabel.set("textColor", "#2edc5f");
    GPSlabel.set("text", "GPS კავშირი : OK");
    GPSposLabel.set("text", connectionStatus.gps.lat + " | " + connectionStatus.gps.lng);
};

// onError Callback receives a PositionError object
// Code 2 - GPS off, Code 3 - Timeout
function onError(error){
    console.log("gps still on");
    if (error.code == 2){
        connectionStatus.gps.lat = "--";
        connectionStatus.gps.lng = "--";
        connectionStatus.gps.connected = false;
        connectionStatus.gps.reason = error.code + " | " +error.message;

        GPSlabel.set("textColor", "#d02e2e");
        GPSlabel.set("text", "GPS კავშირი : გამორთული");
        //GPSposLabel.set("text", connectionStatus.gps.reason + " --- " + myTimer);
    }
    else {
        connectionStatus.gps.lat = "--";
        connectionStatus.gps.lng = "--";
        connectionStatus.gps.connected = false;
        connectionStatus.gps.reason = error.code + " | " +error.message;

        GPSlabel.set("textColor", "#dfb72d");
        GPSlabel.set("text", "GPS კავშირი: სიგნალის ძიება");
        //GPSposLabel.set("text", connectionStatus.gps.reason + " --- " + myTimer);
    }
}

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

//Version comparison
function compare(a, b) {
    if (a === b) { return 0; }
    var a_components = a.split(".");
    var b_components = b.split(".");
    var len = Math.min(a_components.length, b_components.length);
    // loop while the components are equal
    for (var i = 0; i < len; i++) {
        // A bigger than B
        if (parseInt(a_components[i]) > parseInt(b_components[i])) {
            return 1;
        }
        // B bigger than A
        if (parseInt(a_components[i]) < parseInt(b_components[i])) {
            return -1;
        }
    }
    // If one's a prefix of the other, the longer one is greater.
    if (a_components.length > b_components.length) {
        return 1;
    }
    if (a_components.length < b_components.length) {
        return -1;
    }
    // Otherwise they are the same.
    return 0;
}

checkDataConnection(); // Check  data connection
carID = localStorage.getItem("CarID");
startPage.open();
checkUpdate();
