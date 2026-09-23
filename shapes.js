const cubeV = [ 
    {x:  1,  y:  1,  z:  1},
    {x: -1,  y:  1,  z:  1},
    {x:  1,  y: -1,  z:  1},
    {x: -1,  y: -1,  z:  1},
    {x:  1,  y:  1,  z: -1},
    {x: -1,  y:  1,  z: -1},
    {x:  1,  y: -1,  z: -1},
    {x: -1,  y: -1,  z: -1}
];

const cubeE = [
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

const pyramid4V = [
    {x: -1,  y: -1,  z: -1},
    {x: -1,  y: -1,  z:  1},
    {x:  1,  y: -1,  z:  1},
    {x:  1,  y: -1,  z: -1},
    {x:  0,  y:  1,  z:  0}
];

const pyramid4E = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4]
];

const pyramid3V = [
    {x: -1,  y: -1,  z: -1},
    {x:  1,  y: -1,  z: -1},
    {x: 0,  y: -1,  z:  .732},
    {x:  0,  y:  1,  z:  0}
];

const pyramid3E = [
    [0, 1],
    [1, 2],
    [2, 0],
    [0, 3],
    [1, 3],
    [2, 3]
];

export const shapes = {
    cube: {vertices: cubeV, edges: cubeE},
    pyramid4: {vertices: pyramid4V, edges: pyramid4E},
    pyramid3: {vertices: pyramid3V, edges: pyramid3E}
};
