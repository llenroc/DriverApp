var page = tabris.create("Page", {
    title: "Driver App",
    //image: "images/my-page.png",
    topLevel: true
});

var button = tabris.create("Button", {
  text: "Get LatLon",
  layoutData: {centerX: 0, top: 100}
}).appendTo(page);

var button_1 = tabris.create("Button", {
  text: "Some action",
  layoutData: {centerX: 0, top: 150}
}).appendTo(page);

var button_2 = tabris.create("Button", {
  text: "Some action",
  layoutData: {centerX: 0, top: 200}
}).appendTo(page);

var button_3 = tabris.create("Button", {
  text: "Some more action",
  layoutData: {centerX: 0, top: 250}
}).appendTo(page);


var label = tabris.create("TextView", {
  font: "12px",
  layoutData: {centerX: 0, top: [button, 50]}
}).appendTo(page);

button.on("select", function() {
	//page2.open();
	GPSLocation.getCurrentPosition(onSuccess, onError);
    //label.set("text", "Totally Rock!");
});

widget.on("swipe:left", function(widget, event) {
  page2.open();
});

//var ttt = 0;

//setInterval(function(){ ttt+=1; label.set("text", ttt.toString()) }, 1000);

page.open();

var page2 = tabris.create("Page", {
  title: "Hello, World! 222",
  topLevel: true
});


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

