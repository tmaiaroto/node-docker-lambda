// We won't have the same exact context object as AWS Lambda of course, but there will be some useful info here.
var pjson = require('./package.json');
var context = {
	// Not present in Lambda, we will make available the package.json to our context.
	package: pjson,
	// Not exactly the same thing, but close.
	functionName: pjson.name,
	functionVersion: pjson.version,
	memoryLimitInMB: 0,
	invokedFunctionArn: "",

	done: function(err, msg) { if(err){ console.log(msg); } process.exit(); },
	fail: function(err) { if(err){ console.log(err); } process.exit(); },
	succeed: function(msg) { if(msg){ console.log(msg); } process.exit(); },
	// Docker containers don't have a max execution time like Lambda, but we'll still provide this function for compatibility.
	getRemainingTimeInMillis: function() { return 0; }
};
// The event JSON is passed as a command line argument (for now, perhaps reading from a file or an HTTP listener may also be good ideas).
// node _container.js '{"foo": "bar"}'
// ^0   ^1            ^2
try{
	var event = JSON.parse(process.argv[2]) || {};
	require("./index.js").handler(event, context);
} catch(e) {
	console.log("Error parsing event message.", e);
}