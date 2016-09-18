import {noop} from './util';

const internals = {};



Node.assert = (input) => {
  if (!input || !input.isNode)
    throw new Error('Not a Node instance');

  return input;
};

internals.Matrix = function Matrix(width = 32, height = 32, init = 0) {
  console.log('new Matrix()');

  if (!width || !Number.isInteger(width))
    throw new Error('"width" must be a positive integer');

  if (!height || !Number.isInteger(height))
    throw new Error('"height" must be a positive integer');

  if (init !== void 0 && !Number.isInteger(init)) {
    if (typeof init != 'function')
      throw new Error('"initValue" parameter must be an integer or a function');


  }


  let _matrix;

  const initialize = position => {

    if (position) {
      _ensurePositionExists(position);
      _matrix[position.x][position.y].value = init;
      return;
    }

    _matrix = [];
    for (let x = 0; x < width; x++) {

      _matrix[x] = [];

      for (let y = 0; y < height; y++) {


        _matrix[x][y] = typeof init == 'function' ? init({x, y}) : init;

      }
    }
    //_matrix = new Array(width).fill(new Array(height).fill(typeof init != 'function'))
  };

  const _ensurePositionExists = ({x, y} = {}) => {

    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      console.log(1)
      throw new Error('"x" and "y" must both be integers');
    }

    if (x < 0 || y < 0 || x >= width || y >= height)
      throw new Error('Position does not exists ('+x+','+y+')');
  };

  const exists = position => {
    try {
      _ensurePositionExists(position);
      return true;
    } catch (err) {
      return false;
    }
  };

  const get = position => {

    if (!position)
      return getRandomPosition();

    try {

      _ensurePositionExists(position);

      return _matrix[position.x][position.y];

    } catch(err) {}

  };

  const set = (position, value) => {

    _ensurePositionExists(position);

    _matrix[position.x][position.y] = value;

  };

  const getRandomPosition = filter => {

    const position = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };

    const value = get(position);

    if (typeof filter != 'function') {
      return position;
    }

    return filter(value) ? position : getRandomPosition(filter);
  };

  initialize();

  const forEach = (callback) => {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const position = {x: j, y: i};
        callback(get(position), position)
      }
    }
  };

  const map = (callback) => {
    const mapped = [];

    for (let i = 0; i < height; i++) 
      for (let j = 0; j < width; j++)
        mapped.push(callback(get({x: j, y: i})));

    return mapped;
  };

  const toArray = () => map(noop);

  const matrix = {
    isMatrix: true,
    width,
    height,
    reset: initialize,
    exists,
    get,
    set,
    map,
    toArray,
    forEach,
    getRandomPosition
  };

  return matrix;
};

export default internals.Matrix;