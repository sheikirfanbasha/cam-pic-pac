/* Change the w,h values as per your camera resolution */
var w = 640;
var h = 400;
var cnv;
var takeSnap,exportVid;
var video;
var trailSnaps = [];
var trails = 4;

function handleSnapshot(){
	var snap = video.get();
	var vidCtx = video.canvas.getContext('2d');
	var s = vidCtx.getImageData(0, 0, w, h);
	gif.addFrame(s, {
        delay: 1,
        copy: true
    });
	if(trailSnaps.length >= trails){
		trailSnaps.shift();
		trailSnaps.push(snap);
	}else{
		trailSnaps.push(snap);
	}
}

function setup(){
	cnv = createCanvas(w, h);
	background(50);
	video = createCapture(VIDEO);
	video.size(w, h);
	video.hide();
	takeSnap = createButton("snap");
	takeSnap.mouseClicked(function(){
		handleSnapshot();
	});
	exportVid = createButton("export");
	exportVid.mouseClicked(function(){
		try{
			gif.render();
		}catch(error){
			console.log(error);
			gif.abort();
			gif.render();
		}
	});
	resetBtn = createButton("reset");
	resetBtn.mouseClicked(function(){
		trailSnaps = [];
		gif.abort();
	});
	setupGIF();
}

function percentToVal(percent){
	return ((percent/100) * 255);
}

function draw(){
	if(trailSnaps.length > 0){
		for(var i = 0; i < trailSnaps.length; i++){
			image(trailSnaps[i], 0, 0);
			tint(255, percentToVal((i + 1) * 10));
		}
	}
	image(video.get(),0, 0);
}

function setupGIF() {
    gif = new GIF({
        workers: 5,
        quality: 20,
        width: w,
        height: h,
        workerScript: "./js/lib/gif/gif.worker.js"
    });
    gif.on('finished', function(blob) {
        var a = $("<a style='display: none;'/>");
        var url = window.URL.createObjectURL(blob);
        a.attr("href", url);
        a.attr("download", name);
        $("body").append(a);
        a[0].click();
        window.URL.revokeObjectURL(url);
        a.remove();
        window.open(URL.createObjectURL(blob));
    });
}