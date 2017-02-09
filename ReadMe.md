# autoCaster
Super lazy way to cast something to a Chromecast at a specified time interval.

## Installation
1. Run `npm install`
2. Modify the mdna source as outlined in the linked mdns source articles
3. Use the autoCast.service file to set this up as a long running process

## Configuration
```javascript
{
  "device_name": "SomeCast", // target device to send media to 
  
  "start_time_schedule" : "at 8:00 am every weekday", // when the media should be played
  "end_time_schedule"	: "at 6:00 pm every weekday", // when the media should stop being played
  
  // This is from the chromecast spec. I'm casting MPR, but change this to whatever
  "media": {
    "contentId": "http://nis.stream.publicradio.org/nis.mp3",
    "contentType": "video/mp4",
    "streamType": "BUFFERED",
    "metadata": {
      "type": 3,
      "metadataType": 0,
      "title": "MPR"
    }
  }
}
```

## Issues with mdns
- https://github.com/agnat/node_mdns/issues/130
- http://stackoverflow.com/questions/29589543/raspberry-pi-mdns-getaddrinfo-3008-error

## TODO 
- correctly configure mdns instead of the in source modification 
- For some reason if both jobs run at the same time, only one succeeds 
- Reformat
- Test
