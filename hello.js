var page = tabris.create("Page", {
  title: "Hello, World!",
  topLevel: true
});

var button = tabris.create("Button", {
  text: "Native Widgets",
  layoutData: {centerX: 0, top: 100}
}).appendTo(page);

var label = tabris.create("TextView", {
  font: "24px",
  layoutData: {centerX: 0, top: [button, 50]}
}).appendTo(page);

button.on("select", function() {
	page2.open();
    //label.set("text", "Totally Rock!");
});

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


