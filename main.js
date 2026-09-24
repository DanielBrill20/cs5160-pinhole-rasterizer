import {shapes} from "./shapes.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let camera = {x: 0, y: 3, z: -10};
const cameraStart = {...camera};
const travelStep = .4;
let virtualWidth = canvas.width;
let virtualHeight = canvas.height;
let projectionScale = virtualHeight;

let mode = 2;
const rows = 200;
const cols = 320;
const pixelSize = 5;
const backgroundColor = "#050510";
const pixelGrid = Array.from({ length: cols }, () => Array(rows).fill(backgroundColor));

function drawPerfectLine(u1, v1, u2, v2, color)
{
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(u1, v1);
    ctx.lineTo(u2, v2);
    ctx.stroke();
}

function drawPixelatedLine(u1, v1, u2, v2, color)
{
    u1 = Math.round(u1);
    v1 = Math.round(v1);
    u2 = Math.round(u2);
    v2 = Math.round(v2);

    let dx = Math.abs(u2 - u1);
    let dy = Math.abs(v2 - v1);
    let sx = u1 < u2 ? 1 : -1;
    let sy = v1 < v2 ? 1 : -1;
    let err = dx - dy;
    let x = u1;
    let y = v1;

    while (true) {
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            pixelGrid[x][y] = color;
        }

        if (x === u2 && y === v2) {
            break;
        }

        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
    }
}

function drawLine(u1, v1, u2, v2, color)
{
    switch (mode) {
        case 1:
            drawPerfectLine(u1, v1, u2, v2, color);
            break;
        case 2:
            drawPixelatedLine(u1, v1, u2, v2, color);
            break;
        default:
            break;
    }
}

function drawEdge(vert1, vert2, color) {
    const nearZ = 0.001;

    if (vert1.z < nearZ && vert2.z < nearZ) {
        return;
    }

    if (vert1.z < nearZ || vert2.z < nearZ) {
        const denominator = vert2.z - vert1.z;

        if (Math.abs(denominator) < 1e-9) {
            return;
        }

        let t = (nearZ - vert1.z) / denominator;

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

    const u1 = (vert1.x / vert1.z) * projectionScale + virtualWidth/2;
    const v1 = virtualHeight/2 - (vert1.y / vert1.z) * projectionScale;
    const u2 = (vert2.x / vert2.z) * projectionScale + virtualWidth/2;
    const v2 = virtualHeight/2 - (vert2.y / vert2.z) * projectionScale;

    if (mode === 2) {
        const gridX1 = (u1 / virtualWidth) * cols;
        const gridY1 = (v1 / virtualHeight) * rows;
        const gridX2 = (u2 / virtualWidth) * cols;
        const gridY2 = (v2 / virtualHeight) * rows;

        drawLine(gridX1, gridY1, gridX2, gridY2, color);
        return;
    }

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
    let spacing = (mode == 1) ? 1 : 10;
    for (let x = -100; x < 100; x += spacing) {
        const vert1 = {x: x - camera.x, y: -camera.y, z: -100 - camera.z};
        const vert2 = {x: x - camera.x, y: -camera.y, z: 100 - camera.z};
        drawEdge(vert1, vert2, "#0DBD36");

        const vert3 = {x: -100 - camera.x, y: -camera.y, z: x - camera.z};
        const vert4 = {x: 100 - camera.x, y: -camera.y, z: x - camera.z};
        drawEdge(vert3, vert4, "#0DBD36");
    }
}

let randShapes = [];

function randomBetween(min, max)
{
    return min + Math.random() * (max - min);
}

function randomColor()
{
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return "#" + [r, g, b].map(value => value.toString(16).padStart(2, "0")).join("");
}

function generateShapes()
{
    randShapes = [];
    const shapeTypes = Object.values(shapes);

    for (let i = 0; i < 50; i++) {
        const selectedShape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

        randShapes.push({
            shape: selectedShape,
            position: {
                x: randomBetween(-100, 100),
                y: 0,
                z: randomBetween(-100, 100)
            },
            scale: randomBetween(0.5, 10),
            color: randomColor()
        });
    }
}

function drawGrid()
{
    for (let v = 0; v < rows; v++) {
        for (let u = 0; u < cols; u++) {
            if (pixelGrid[u][v] != backgroundColor) {
                ctx.fillStyle = pixelGrid[u][v];
                ctx.fillRect(u * pixelSize, v * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

function draw()
{
    if (mode == 2) {
        for (let u = 0; u < cols; u++) {
            pixelGrid[u].fill(backgroundColor);
        }
    }
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGround();

    for (const shapeData of randShapes) {
        drawShapeAt(shapeData.shape, shapeData.position, shapeData.scale, shapeData.color);
    }

    if (mode == 2) {
        drawGrid();
    }
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
    case "KeyM":
        mode = mode == 1 ? 2 : 1;
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
    if (mode === 2) {
        canvas.width = cols * pixelSize;
        canvas.height = rows * pixelSize;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    virtualWidth = canvas.width;
    virtualHeight = canvas.height;
    projectionScale = canvas.height;
    draw();
}


window.addEventListener("resize", resizeCanvas);
generateShapes();
resizeCanvas();
