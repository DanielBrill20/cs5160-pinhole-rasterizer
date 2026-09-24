import {shapes} from "./shapes.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let camera = {x: 0, y: 3, z: -10};
const cameraStart = {...camera};
let projectionScale = canvas.height;
const travelStep = .4;

function drawLine(x1, y1, x2, y2, color)
{
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawEdge(vert1, vert2, color) {
    const nearZ = 0.001;

    if (vert1.z < nearZ && vert2.z < nearZ) {
        return;
    }

    if (vert1.z < nearZ || vert2.z < nearZ) {
        let t = (nearZ - vert1.z) / (vert2.z - vert1.z);

        let intersection = {
            x: vert1.x + t * (vert2.x - vert1.x),
            y: vert1.y + t * (vert2.y - vert1.y),
            z: nearZ
        };

        if (vert1.z < nearZ) {
            vert1 = intersection;
        } else {
            vert2 = intersection;
        }
    }

    let u1 = (vert1.x / vert1.z) * projectionScale + canvas.width/2;
    let v1 = canvas.height/2 - (vert1.y / vert1.z) * projectionScale;
    let u2 = (vert2.x / vert2.z) * projectionScale + canvas.width/2;
    let v2 = canvas.height/2 - (vert2.y / vert2.z) * projectionScale;

    drawLine(u1, v1, u2, v2, color);
}

function drawShape(vertices, edges, color)
{
    let relativeVerts = [];

    for(let vert = 0; vert < vertices.length; vert++) {
        relativeVerts.push({
            x: vertices[vert].x - camera.x,
            y: vertices[vert].y - camera.y,
            z: vertices[vert].z - camera.z
        });
    }

    for(let edge = 0; edge < edges.length; edge++) {
        let vert1 = relativeVerts[edges[edge][0]];
        let vert2 = relativeVerts[edges[edge][1]];
        drawEdge(vert1, vert2, color);
    }
}

function drawShapeAt(shape, position, scale, color)
{
    let newVerts = [];
    for (let v = 0; v < shape.vertices.length; v++) {
        newVerts.push({
            x: shape.vertices[v].x * scale + position.x,
            y: shape.vertices[v].y * scale + position.y,
            z: shape.vertices[v].z * scale + position.z
        });
    }

    drawShape(newVerts, shape.edges, color);
}

function drawGround()
{
    for (let x = -100; x < 100; x++) {
        const vert1 = {x: x - camera.x, y: -camera.y, z: -100 - camera.z};
        const vert2 = {x: x - camera.x, y: -camera.y, z: 100 - camera.z};
        drawEdge(vert1, vert2, "#0DBD36");

        const vert3 = {x: -100 - camera.x, y: -camera.y, z: x - camera.z};
        const vert4 = {x: 100 - camera.x, y: -camera.y, z: x - camera.z};
        drawEdge(vert3, vert4, "#0DBD36");
    }
}

function draw()
{
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGround();

    drawShapeAt(shapes.cube, {x: 0, y: 0, z: 0}, 2, "#FF0000");
    drawShapeAt(shapes.cube, {x: -10, y: 0, z: 50}, 1, "#FF0000");
    drawShapeAt(shapes.pyramid4, {x: 5, y: 0, z: 30}, 3, "#FF0000");
}

document.addEventListener("keydown", (event) => {
    event.preventDefault();

    switch (event.code) {
    case "ArrowUp":
        camera.z += travelStep;
        draw();
        break;
    case "ArrowDown":
        camera.z -= travelStep;
        draw();
        break;
    case "ArrowLeft":
        camera.x -= travelStep;
        draw();
        break;
    case "ArrowRight":
        camera.x += travelStep;
        draw();
        break;
    case "KeyR":
        camera = {...cameraStart};
        draw();
        break;
    default:
        return; 
    }
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    projectionScale = canvas.height;
    draw();
}


window.addEventListener("resize", resizeCanvas);
resizeCanvas();
