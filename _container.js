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
if(process.argv[2] !== undefined) {
	var event = "";
	// docker run container-name '{"event": "message"}' 
	// ^ is the command to make this happen...
	// But when you override the CMD value from AWS console in your web browser, when running the ECS task,
	// the form input field seems to create problems with passing along the JSON string. The JSON.parse() 
	// here can't parse the message due various escaping issues. Converting to base64 seemed to work.
	// So both are supported to make life a little easier (until I can find a better solution).
	var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
	if(base64regex.test(process.argv[2])) {
		// If base64 encoded.
		try{
			event = new Buffer(process.argv[2], 'base64').toString('ascii');
			event = JSON.parse(event) || {};
			require("./index.js").handler(event, context);
		} catch(e) {
			console.log("Error parsing event message (tried to decode base64).", e);
		}
	} else {
		// Not base64 encoded.
		try{
			event = JSON.parse(process.argv[2]) || {};
			require("./index.js").handler(event, context);
		} catch(e) {
			console.log("Error parsing event message.", e);
		}
	}
} else {
	console.log("No event message passed.");
	process.exit();
}

// Just in case your Lambda doesn't catch some error. This ensures the container exits, freeing things up.
process.on('uncaughtException', function (err) {
  console.log(err, err.stack);
  process.exit(1);
});