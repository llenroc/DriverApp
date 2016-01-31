var page = tabris.create("Page", {
    title: "main page",
    background: "#fff",
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


var touched = 0;
tabris.create("ImageView", {
  layoutData: {centerX: 0, centerY: 0, top [label2,10]},
  image: {src: "res/images/car.png"},
  highlightOnTouch: true
}).on("tap", function() {
  touched++;
  page.set("title", "touched " + touched + " times");
}).appendTo(page);





var scaleFactor = tabris.device.get("scaleFactor");

var label = tabris.create("TextView", {
  font: "12px",
  layoutData: {centerX: 0, top: [button_1, 50]}
}).appendTo(page);

var label2 = tabris.create("TextView", {
  font: "12px",
    text : scaleFactor,
  layoutData: {centerX: 0, top: [label, 50]}
}).appendTo(page);


button.on("select", function() {
	GPSLocation.getCurrentPosition(onSuccess, onError);
});

page.on("swipe:left", function(widget, event) {
  page2.open();
});

//var ttt = 0;

//setInterval(function(){ ttt+=1; label.set("text", ttt.toString()) }, 1000);

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

page.open();