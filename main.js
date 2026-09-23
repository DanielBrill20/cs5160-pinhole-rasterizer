import {shapes} from "./shapes.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let camera = {x: 0, y: 0, z: -10};

function drawLine(x1, y1, x2, y2)
{
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawShape(vertices, edges)
{
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let projectedV = [];

    for(let v = 0; v < vertices.length; v++) {
        let relativePos = {};
        relativePos.x = vertices[v].x - camera.x;
        relativePos.y = vertices[v].y - camera.y;
        relativePos.z = vertices[v].z - camera.z;

        let canvasPos = {};
        canvasPos.u = relativePos.x/relativePos.z;
        canvasPos.v = relativePos.y/relativePos.z;

        canvasPos.u = canvasPos.u * canvas.width + canvas.width/2;
        canvasPos.v = canvasPos.v * canvas.height + canvas.height/2;

        projectedV.push(canvasPos);
    }

    for(let e = 0; e < edges.length; e++){
        
        let e1 = edges[e][0];
        let u1 = projectedV[e1].u;
        let v1 = canvas.height - projectedV[e1].v;

        let e2 = edges[e][1];
        let u2 = projectedV[e2].u;
        let v2 = canvas.height - projectedV[e2].v;

        drawLine(u1, v1, u2, v2);
    }
}

function drawShapeAt(shape, position, scale)
{
    let newV = [];
    for (let v = 0; v < shape.vertices.length; v++) {
        let newPos = {};
        newPos.x = shape.vertices[v].x * scale + position.x;
        newPos.y = shape.vertices[v].y * scale + position.y;
        newPos.z = shape.vertices[v].z * scale + position.z;
        newV.push(newPos);
    }

    drawShape(newV, shape.edges);
}

function draw()
{
    drawShapeAt(shapes.cube, {x: 0, y: 0, z: 0}, 2);
}

document.addEventListener("keydown", (event) => {
    event.preventDefault();

    switch (event.code) {
    case "ArrowUp":
        camera.z++;
        draw();
        break;
    case "ArrowDown":
        camera.z--;
        draw();
        break;
    case "ArrowLeft":
        camera.x--;
        draw();
        break;
    case "ArrowRight":
        camera.x++;
        draw();
        break;
    case "KeyR":
        camera = {x: 0, y: 0, z: -10};
        draw();
        break;
    default:
        return; 
    }
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}


window.addEventListener("resize", resizeCanvas);
resizeCanvas();
