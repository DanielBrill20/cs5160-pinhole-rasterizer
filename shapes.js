const cubeVerts = [ 
    {x:  1,  y:  2,  z:  1},
    {x: -1,  y:  2,  z:  1},
    {x:  1,  y:  0,  z:  1},
    {x: -1,  y:  0,  z:  1},
    {x:  1,  y:  2,  z: -1},
    {x: -1,  y:  2,  z: -1},
    {x:  1,  y:  0,  z: -1},
    {x: -1,  y:  0,  z: -1}
];

const cubeEdges = [
    [0, 1],
    [0, 2],
    [0, 4],
    [2, 3],
    [1, 3],
    [2, 6],
    [4, 5],
    [4, 6],
    [1, 5],
    [6, 7],
    [5, 7],
    [3, 7],
];

const cubeTriangles = [
    [0, 2, 3],
    [0, 3, 1],
    [4, 5, 7],
    [4, 7, 6],
    [0, 4, 6],
    [0, 6, 2],
    [1, 3, 7],
    [1, 7, 5],
    [0, 1, 5],
    [0, 5, 4],
    [2, 6, 7],
    [2, 7, 3]
];

const pyramid4Verts = [
    {x: -1,  y:  0,  z: -1},
    {x: -1,  y:  0,  z:  1},
    {x:  1,  y:  0,  z:  1},
    {x:  1,  y:  0,  z: -1},
    {x:  0,  y:  2,  z:  0}
];

const pyramid4Edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4]
];

const pyramid4Triangles = [
    [0, 1, 4],
    [1, 2, 4],
    [2, 3, 4],
    [3, 0, 4],
    [0, 2, 1],
    [0, 3, 2]
];

const pyramid3Verts = [
    {x: -1,  y:  0,  z: -1},
    {x:  1,  y:  0,  z: -1},
    {x:  0,  y:  0,  z:  .732},
    {x:  0,  y:  2,  z:  0}
];

const pyramid3Edges = [
    [0, 1],
    [1, 2],
    [2, 0],
    [0, 3],
    [1, 3],
    [2, 3]
];

const pyramid3Triangles = [
    [0, 1, 3],
    [1, 2, 3],
    [2, 0, 3],
    [0, 1, 2]
];

const octahedronVerts = [
    {x:  0, y: 2, z:  0},
    {x:  1, y: 1, z:  0},
    {x:  0, y: 1, z:  1},
    {x: -1, y: 1, z:  0},
    {x:  0, y: 1, z: -1},
    {x:  0, y: 0, z:  0}
];

const octahedronEdges = [
    [0, 1], [0, 2], [0, 3], [0, 4],
    [1, 2], [2, 3], [3, 4], [4, 1],
    [5, 1], [5, 2], [5, 3], [5, 4]
];

const octahedronTriangles = [
    [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1],
    [5, 2, 1], [5, 3, 2], [5, 4, 3], [5, 1, 4]
];

const prismVerts = [
    {x: -1, y: 0, z: -1},
    {x:  1, y: 0, z: -1},
    {x:  0, y: 2, z: -1},
    {x: -1, y: 0, z:  1},
    {x:  1, y: 0, z:  1},
    {x:  0, y: 2, z:  1}
];

const prismEdges = [
    [0, 1], [1, 2], [2, 0],
    [3, 4], [4, 5], [5, 3],
    [0, 3], [1, 4], [2, 5]
];

const prismTriangles = [
    [0, 1, 2], [3, 5, 4],
    [0, 3, 4], [0, 4, 1],
    [1, 4, 5], [1, 5, 2],
    [2, 5, 3], [2, 3, 0]
];

export const shapes = {
    cube: {vertices: cubeVerts, edges: cubeEdges, triangles: cubeTriangles},
    pyramid4: {vertices: pyramid4Verts, edges: pyramid4Edges, triangles: pyramid4Triangles},
    pyramid3: {vertices: pyramid3Verts, edges: pyramid3Edges, triangles: pyramid3Triangles},
    octahedron: {vertices: octahedronVerts, edges: octahedronEdges, triangles: octahedronTriangles},
    prism: {vertices: prismVerts, edges: prismEdges, triangles: prismTriangles}
};
