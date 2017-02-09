var Client                = require('castv2-client').Client;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;
var mdns                  = require('mdns');
var later				  = require('later');

// Load configuration 
var fs = require('fs');
var configFileLocation = process.argv[2]  || 'configuration.json'
console.log("Using configuration file ", configFileLocation)
var configuration = JSON.parse(fs.readFileSync(configFileLocation, 'utf8'));
// TODO validate this dude ^^

// configure the schedules 
later.date.localTime();

console.log("Start time schedule is: ", configuration.start_time_schedule)
console.log("End time schedule is: ", configuration.end_time_schedule)

var start_schedule = later.parse.text(configuration.start_time_schedule)
var end_schedule = later.parse.text(configuration.end_time_schedule)

// schedule the shit
later.setInterval(eventuallyTakeActionOnAChromecast(loadTheMedia, configuration),start_schedule)
later.setInterval(eventuallyTakeActionOnAChromecast(stopTheMedia, configuration),end_schedule)

function eventuallyTakeActionOnAChromecast(action, configuration){
	return () => {
		console.log('Taking some action');
		var browser = mdns.createBrowser(mdns.tcp('googlecast'));
		
		browser.on('serviceUp', function(service) {
		  if (service.txtRecord && service.txtRecord.fn === configuration.device_name){
			action(service.addresses[0], configuration);
		  }
		  browser.stop();
		});
		browser.start();
	}
}

function loadTheMedia(host, configuration) {
  connectToTheChromecast(host, function(client) {
    console.log('connected, launching app ...');

    client.launch(DefaultMediaReceiver, function(err, player) {
      player.load(configuration.media, { autoplay: true }, function(err, status) {
        console.log('media loaded playerState=%s', status.playerState)
        // disconnect cause who cares?
        client.close();
      });
      
      player.on('status', function(status) {
        console.log('status broadcast playerState=%s', status.playerState);
      });
    });
  });
}

function connectToTheChromecast(host, action){
	var client = new Client();

  client.connect(host, () => {action(client)} );

  client.on('error', function(err) {
    console.log('Error: %s', err.message);
    client.close();
  });
}

function stopTheMedia(host, configuration) {
	connectToTheChromecast(host, function(client) {
		console.log('connected, stopping app ...');

		client.launch(DefaultMediaReceiver, function(err, player) {
			player.stop(function(status) {
				console.log("Done!",status);
			});
			player.on('status', function(status) {
				console.log('status broadcast playerState=%s', status.playerState);
			  });
		});
	})
}
