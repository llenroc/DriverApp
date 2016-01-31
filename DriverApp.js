var page = tabris.create("Page", {
  title: "Driver App",
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

var ttt = 0;

//setInterval(function(){ ttt+=1; label.set("text", ttt.toString()) }, 1000);

page.open();

var page2 = tabris.create("Page", {
  title: "Hello, World! 222",
  topLevel: true
});

var button2 = tabris.create("Button", {
  text: "Native Widgets 222",
  layoutData: {centerX: 0, top: 100}
}).appendTo(page2);

var label2 = tabris.create("TextView", {
  font: "24px",
  layoutData: {centerX: 0, top: [button, 50]}
}).appendTo(page2);

button2.on("select", function() {
  label2.set("text", "Totally Rock! 222");
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

