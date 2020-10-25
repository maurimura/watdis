// let width = window.innerWidth;
// let height = window.innerHeight;

let streaming = false;

let video = null;
let canvas = null;

function startup() {
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");

    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
        })
        .catch((err) => {
            alert(err);
        });
    video.addEventListener(
        "canplay",
        (ev) => {
            if (!streaming) {
                canvas.setAttribute("width", video.videoWidth);
                canvas.setAttribute("height", video.videoHeight);
            }
        },
        false
    );

    video.addEventListener("loadeddata", () => {
        cocoSsd.load().then((model) => detectObjects(model, video));
    });
}

function drawPredictions(predictions) {
    canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '1em serif';

    predictions.forEach(({ bbox, class: type }) => {
        const [x, y, w, h] = bbox;
        ctx.fillText(type, x, y - 16);
        ctx.strokeRect(x, y, w, h);
    });
}

function detectObjects(model, video) {
    model.detect(video).then((predictions) => {
        drawPredictions(predictions);
        requestAnimationFrame(() => detectObjects(model, video));
    });
}

window.addEventListener("load", startup, false);
window.addEventListener("resize", () => {
    // height = windows.innerHeight;
    // width = window.innerWidth;
});
