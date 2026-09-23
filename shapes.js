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

export const shapes = {
    cube: {vertices: cubeVerts, edges: cubeEdges},
    pyramid4: {vertices: pyramid4Verts, edges: pyramid4Edges},
    pyramid3: {vertices: pyramid3Verts, edges: pyramid3Edges}
};
