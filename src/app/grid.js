import {EventEmitter} from 'events';
import Piece from './piece';
import Matrix from './matrix';

const internals = {};

internals.displayNode = node => {

  if (node.isSnake)
    return '1';

  if (node.isFood)
    return '2';

  return '';
};

export const Position = function Position({x, y} = {}) {

  let _x;
  let _y;

  const position = {
    isPosition: true,
    set x(newValue) {

      if (!Number.isInteger(x))
        throw new Error('"x" must be an integer');

      _x = newValue;
    },
    get x() {
      return _x;
    },
    set y(newValue) {

      if (!Number.isInteger(y))
        throw new Error('"y" must be an integer');

      _y = newValue;
    },
    get y() {
      return _y;
    }
  };

  position.x = x;
  position.y = y;

  return position;
};

export const Node = function Node(object, value = 0) {

  let _position = Position({x: 0, y: 0});

  const getPosition = () => {
    return _position;
  };

  const setPosition = (newValue) => {

    if (!newValue.isPosition)
      newValue = Position(newValue);

    _position = newValue
  };

  if (!object || typeof object != 'object')
    throw new Error('A node must be an object');

  if (object.position)
    setPosition(object.position);

  const node = Object.assign(object, {
    isNode: true,
    value
  });

  Object.defineProperty(node, 'position', {
    configurable: true,
    get: getPosition,
    set: setPosition
  });

  return node;
};

Node.assert = input => {
  if (!input || !input.isNode)
    throw new Error('Not a Node instance');

  return input;
};

export default function Grid({
  height = 1000,
  width = 1000,
  rows = 10,
  columns = 10,
  debug = true
  } = {}) {
  console.log('new Grid()', 'height='+height, 'width='+width);

  const update = (grid, parent) => {
    console.log('Grid.update()', grid, parent);

    grid.updaters.forEach(updater => {

      //console.log('piece', updater);
      const position = updater.position;
      if (position) {

        const node = getNode(position);

        if (!node) {

          grid.emit('exit', updater);

        }

        if (node && node !== updater)
          setNode(updater);

        const lastPosition = updater.lastPosition;
        if (lastPosition) {
          //console.log('last='+lastPosition.x+':'+lastPosition.y);
          //console.log('curr='+position.x+':'+position.y);

          if (!node) {
            updater.position = lastPosition;
            //setNode(updater);

            return;
          }

          setNode(Node({position: lastPosition}));

          //console.log('isNode', lastNode === piece);
          //_matrix.get(current).value = 42;

          //
          //if (last)
          //  _matrix.get(last).value = 0;

        }
      }

    })
  };

  const render = view => {
    console.log('Grid.render()');

    if (!_textLabels)
      return;

    _matrix.forEach((node, position) => {
      const text = _textLabels.get(position);

      //console.log(node.position, text)
      text.setText(internals.displayNode(node));

    });

  };

  const _matrix = Matrix(rows, columns, position => {
    return Node({position})
  });

  const getNode = _matrix.get;
  const setNode = node => {
    Node.assert(node);

    _matrix.set(node.position, node)
  };

  const getRandomPosition = _matrix.getRandomPosition;

  const getRandomNode = () => {
    const position = _matrix.getRandomPosition.apply(null, arguments);
    return getNode(position);
  };


  const _forEach = _matrix.forEach;

  const cellWidth = width / columns;
  const cellHeight = height / rows;
  const lineOptions = {
    stroke: '#666',
    selectable: false,
    originX: 'center',
    originY: 'center'
  };
  let _textLabels;

  const view = new fabric.Group([], {
    height: height,
    width: width,
    originX: 'center',
    originY: 'center'
  });

  if (debug) {
    for (let i = 0; i <= columns; i++)
      view.add(new fabric.Line([i * cellWidth, 0, i * cellWidth, height], lineOptions));

    for (let i = 0; i <= rows; i++)
      view.add(new fabric.Line([0, i * cellHeight, width, i * cellHeight], lineOptions));

    if (_matrix) {
      console.log('rows='+rows, 'columns='+columns, 'height='+height, 'width='+width);

      _textLabels = Matrix(rows, columns, position => new fabric.Text('', {
        width: 100,
        height: 100,
        top: (position.y * cellHeight) + (cellHeight / 2),
        left: (position.x * cellWidth) + (cellWidth / 2),
        fontSize: 40,
        fill: '#000',
        strokeWidth: 1,
        originX: 'center',
        originY: 'center'
      }));

      //const _textLabels = _matrix.map(_makeTextLabel);

      view.add(new fabric.Group(_textLabels.toArray()));
    }
  }

  const grid = Object.assign(
    {
      isGrid: true,
      view,
      update,
      render,
      getNode,
      columns,
      rows,
      getRandomNode,
      getRandomPosition,
      cellWidth,
      cellHeight
    },
    EventEmitter.prototype
  );

  Piece(grid);

  const _add = grid.add;
  grid.add = (key, value) => {
    if (!value.isNode)
      throw new Error('a grid only accepts Node instances');
    _add(key, value);

    _matrix.set(value.position, value);
    return grid;
  };

  return grid;
};