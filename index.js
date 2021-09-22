let v = document.getElementById("smell");
let hls = new Hls();
hls.loadSource(
    "https://stream.mux.com/vOQejqGpT7lUc7YrdIkxMfNSqFAbSK8N.m3u8"
);
hls.attachMedia(v);

v.ontimeupdate = (e) => {
//   console.log(v.currenttime);
};

v.addEventListener('play', function() {
    // Jump to close to the... event.
    // v.currentTime = 12;
	setupTextTracks();
});

function playVideo() {
    v.play();
}

// I'm sorry.
let writer = new WritableStream();
let encoder = new TextEncoder();
let decoder = new TextDecoder();
let connected = false;

// Sets up the hidden text tracks that we use to trigger
function setupTextTracks() {
    for (let i = 0; i < v.textTracks.length; i++) {
        let t = v.textTracks[i];
        if (t.label === "smell-o-vision") {

            // Hidden is supposed to cause events, but not render, however HLS.js doesn't 
            // really support this today, so this project runs a patched HLS.js
            // See also: https://github.com/video-dev/hls.js/issues/4032
            t.mode = "hidden";

            t.oncuechange = (e) => {
                if (e.target.activeCues.length > 0) {

                    // Raw cue
                    console.log(e.target.activeCues[0].text);

                    // Parse the cue as JSON 🤞
                    let smell = JSON.parse(e.target.activeCues[0].text);
                    console.log(smell);

                    // If we're connected to the Smellmaster 5000™️
                    if (connected) {
                        write("A");
                        setTimeout(function(){ 
                            // write("B")
                        }, 3000);
                    } 
                    // Fallback to an alert for now
                    else {
                        alert(smell.scent);
                    }
                }
            }
        }
        // It would be nice to be able to run both captions _and_ "hidden" tracks, but
        // again, this isn't really possible in HLS.js as it stands today.
        // Again, see also: https://github.com/video-dev/hls.js/issues/4032
        else {
            // t.mode = "showing";
        }
      }
}

// Serial code badly adapted from a great example here:
// https://dev.to/unjavascripter/the-amazing-powers-of-the-web-web-serial-api-3ilc
async function connectToSmellmaster() {
    console.log("Connecting to the Smellmaster 5000™️...");
    if ('serial' in navigator) {
        try {
          const port = await navigator.serial.requestPort();
          await port.open({ baudRate: 9600 });
          writer = port.writable.getWriter();
          connected = true;
          console.log("Connected.")
        }
        catch (err) {
          console.error('There was an error opening the serial port:', err);
        }
      }
      else {
        console.error('The Web serial API doesn\'t seem to be enabled in your browser.');
      }
}

// Write some data to the serial port
async function write(data) {
    console.log("Writing to Serial port: " + data);
    const dataArrayBuffer = encoder.encode(data);
    return await writer.write(dataArrayBuffer);
  }
