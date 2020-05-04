var audioDir = "/audio/";
var audioSelect = "test1.mp3";
var audioSelect = audioDir.concat(audioSelect);

var audioObject = document.getElementById("pubAudio");
audioObject.setAttribute("src", audioSelect);