import {shapes} from "./shapes.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let camera = {x: 0, y: 3, z: -10};
const cameraStart = {...camera};
const travelStep = .4;
let virtualWidth = canvas.width;
let virtualHeight = canvas.height;
let projectionScale = virtualHeight;

let mode = 1;
const rows = 200;
const cols = 320;
const pixelSize = 5;
const backgroundColor = "#050510";
const pixelGrid = Array.from({ length: cols }, () => Array(rows).fill(backgroundColor));
const depthBuffer = Array.from({ length: cols }, () => Array(rows).fill(Number.POSITIVE_INFINITY));

function clearRasterBuffer() {
    for (let x = 0; x < cols; x++) {
        pixelGrid[x].fill(backgroundColor);
        depthBuffer[x].fill(Number.POSITIVE_INFINITY);
    }
}

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
    const deltaX = u2 - u1;
    const deltaY = v2 - v1;
    let start = 0;
    let end = 1;

    for (const [p, q] of [
        [-deltaX, u1],
        [deltaX, cols - 1 - u1],
        [-deltaY, v1],
        [deltaY, rows - 1 - v1]
    ]) {
        if (p === 0) {
            if (q < 0) {
                return;
            }
            continue;
        }

        const ratio = q / p;
        if (p < 0) {
            start = Math.max(start, ratio);
        } else {
            end = Math.min(end, ratio);
        }
    }

    if (start > end) {
        return;
    }

    u1 += start * deltaX;
    v1 += start * deltaY;
    u2 -= (1 - end) * deltaX;
    v2 -= (1 - end) * deltaY;

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
            break;
        case 3:
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

    if (mode === 2 || mode === 3) {
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

function shadeColor(color, factor)
{
    const red = parseInt(color.slice(1, 3), 16);
    const green = parseInt(color.slice(3, 5), 16);
    const blue = parseInt(color.slice(5, 7), 16);
    const channels = [red, green, blue].map(channel => Math.min(255, Math.round(channel * factor)));

    return "#" + channels.map(value => value.toString(16).padStart(2, "0")).join("");
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

function barycentric(p0, p1, p2, p)
{
    const signedDoubleArea = (p1.y - p2.y) * (p0.x - p2.x) + (p2.x - p1.x) * (p0.y - p2.y);

    if (Math.abs(signedDoubleArea) < 1e-6) {
        return null;
    }

    const w0 = ((p1.y - p2.y) * (p.x - p2.x) + (p2.x - p1.x) * (p.y - p2.y)) / signedDoubleArea;
    const w1 = ((p2.y - p0.y) * (p.x - p2.x) + (p0.x - p2.x) * (p.y - p2.y)) / signedDoubleArea;
    const w2 = 1 - w0 - w1;

    return {w0, w1, w2};
}

function renderTriangle(worldA, worldB, worldC, color)
{
    const rasterProjectionScale = projectionScale * cols / virtualWidth;
    const projectedA = {x: (worldA.x / worldA.z) * rasterProjectionScale + cols / 2, y: rows / 2 - (worldA.y / worldA.z) * rasterProjectionScale, z: worldA.z};
    const projectedB = {x: (worldB.x / worldB.z) * rasterProjectionScale + cols / 2, y: rows / 2 - (worldB.y / worldB.z) * rasterProjectionScale, z: worldB.z};
    const projectedC = {x: (worldC.x / worldC.z) * rasterProjectionScale + cols / 2, y: rows / 2 - (worldC.y / worldC.z) * rasterProjectionScale, z: worldC.z};

    if (worldA.z <= 0.001 || worldB.z <= 0.001 || worldC.z <= 0.001) {
        return;
    }

    const minX = Math.max(0, Math.floor(Math.min(projectedA.x, projectedB.x, projectedC.x)));
    const maxX = Math.min(cols - 1, Math.ceil(Math.max(projectedA.x, projectedB.x, projectedC.x)));
    const minY = Math.max(0, Math.floor(Math.min(projectedA.y, projectedB.y, projectedC.y)));
    const maxY = Math.min(rows - 1, Math.ceil(Math.max(projectedA.y, projectedB.y, projectedC.y)));

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            const weights = barycentric(projectedA, projectedB, projectedC, {x: x + 0.5, y: y + 0.5});

            if (!weights || weights.w0 < 0 || weights.w1 < 0 || weights.w2 < 0) {
                continue;
            }

            const depth = weights.w0 * worldA.z + weights.w1 * worldB.z + weights.w2 * worldC.z;

            if (depth < depthBuffer[x][y]) {
                depthBuffer[x][y] = depth;
                pixelGrid[x][y] = color;
            }
        }
    }
}

function drawTrianglesAt(shape, position, scale, color)
{
    for (let faceIndex = 0; faceIndex < (shape.triangles || []).length; faceIndex++) {
        const face = shape.triangles[faceIndex];
        const transformed = face.map((index) => {
            const v = shape.vertices[index];
            return {
                x: v.x * scale + position.x,
                y: v.y * scale + position.y,
                z: v.z * scale + position.z
            };
        });

        const transformedRelative = transformed.map((vertex) => ({
            x: vertex.x - camera.x,
            y: vertex.y - camera.y,
            z: vertex.z - camera.z
        }));

        const faceColor = shadeColor(color, 0.88 + (Math.floor(faceIndex / 2) % 3) * 0.05);
        renderTriangle(transformedRelative[0], transformedRelative[1], transformedRelative[2], faceColor);
    }
}

function drawGrid()
{
    for (let v = 0; v < rows; v++) {
        for (let u = 0; u < cols; u++) {
            if (pixelGrid[u][v] !== backgroundColor) {
                ctx.fillStyle = pixelGrid[u][v];
                ctx.fillRect(u * pixelSize, v * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

function draw()
{
    if (mode === 2) {
        for (let u = 0; u < cols; u++) {
            pixelGrid[u].fill(backgroundColor);
        }
    }

    if (mode === 3) {
        clearRasterBuffer();
    }

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGround();

    if (mode === 3) {
        for (const shapeData of randShapes) {
            drawTrianglesAt(shapeData.shape, shapeData.position, shapeData.scale, shapeData.color);
        }

        drawGrid();
        return;
    }

    for (const shapeData of randShapes) {
        drawShapeAt(shapeData.shape, shapeData.position, shapeData.scale, shapeData.color);
    }

    if (mode === 2) {
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
    case "Digit1":
        mode = 1;
        resizeCanvas();
        break;
    case "Digit2":
        mode = 2;
        resizeCanvas();
        break;
    case "Digit3":
        mode = 3;
        resizeCanvas();
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
    canvas.width = cols * pixelSize;
    canvas.height = rows * pixelSize;

    virtualWidth = canvas.width;
    virtualHeight = canvas.height;
    projectionScale = canvas.height;
    draw();
}

window.addEventListener("resize", resizeCanvas);
generateShapes();
resizeCanvas();
