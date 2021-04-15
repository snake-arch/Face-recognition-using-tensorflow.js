/////////////////////////////////////////////////////////////////////
(function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var video = document.getElementById('videoElement');
    /////////////////////////////////////////////////////////////////
    if (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia) {
              navigator.mediaDevices.getUserMedia({ video: true,
                    audio:false })
                .then(function (stream) {
                  video.srcObject = stream;
                })
                .catch(function (err) {
                  console.log("Something went wrong!");
                });
            }
    ///////////////////////////////////////////////////////////////
    video.addEventListener('play',function()
                          {
        draw(this, context,640,480);
    },false);
    ///////////////////////////////////////////////////////////////
    async function draw(video,context, width, height){
        context.drawImage(video,0,0,width,height);
        const model = await blazeface.load();
        const predictions = await model.estimateFaces(video, false);
        ///////////////////////////////////////////////////////////
          if (predictions.length > 0){
           console.log(predictions);
           for (let i = 0; i < predictions.length; i++) {
            const start = predictions[i].topLeft;
            const end = predictions[i].bottomRight;
            var probability = predictions[i].probability;
            const size = [end[0] - start[0], end[1] - start[1]];
            /////////////////////////////////////////////////////
            context.beginPath();
            context.lineWidth = "5";
            context.strokeStyle="blue";
            context.rect(start[0], start[1],size[0], size[1]);
            /////////////////////////////////////////////////////
            const landmarks = predictions[i].landmarks;
            const right_eye = landmarks[0];
            context.fillRect(right_eye[0],right_eye[1],8,8);
            const left_eye = landmarks[1];
            context.fillRect(left_eye[0],left_eye[1],8,8);
            const nose = landmarks[2];
            context.fillRect(nose[0],nose[1],8,8);
            const mouth = landmarks[3];
            context.fillRect(mouth[0],mouth[1],8,8);
            const right_ear = landmarks[4];
            context.fillRect(right_ear[0],right_ear[1],8,8);
            const left_ear = landmarks[5];
            context.fillRect(left_ear[0],left_ear[1],8,8);
            /////////////////////////////////////////////////////
            context.stroke();
            var prob = (probability[0]*100).toPrecision(5).toString();
            var text = "Confidence:"+prob+"%";
            context.font = "16pt Comic Sans MS";
            context.fillStyle = "#FF0000";
            context.fillText(text,start[0]+5,start[1]+20);
        }
            //////////////////////////////////////////////////////
           }
        setTimeout(draw,250,video,context,width,height);
        /////////////////////////////////////////////////////////
    }
})();
