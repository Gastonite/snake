import {EventEmitter} from 'events';
import {Node, Position} from './grid';

const internals = {};

export default internals.Character = function Character({position} = {}, value = 1) {

  console.log('new Character');

  let _direction = internals.Character.directions.RIGHT;
  let _lastPosition = {x: 0, y: 0};

  const view = new fabric.Rect({
    width: 25,
    height: 25,
    left: 25,
    top: 25,
    fill: 'green',
    originX: 'center',
    originY: 'center'
  });

  const getLastPosition = () => {
    return _lastPosition;
  };

  const setLastPosition = (newValue) => {

    if (!newValue.isPosition)
      newValue = Position(newValue);

    _lastPosition = newValue
  };

  const update = (character, grid) => {
    console.log('Character.update()', grid);

    let current = character.position;
    let last = character.lastPosition;
    let direction = character.direction;

    character.lastPosition = current;
    character.position = {
      x: current.x + direction.x,
      y: current.y + direction.y
    };

    //character.emit('move', character.position, character.lastPosition)
  };

  const render = (view, parent) => {
    console.log('Character.render()', parent);

    const {x, y} = character.position;
    view.set({
      top: (y * parent.cellHeight) + 25,
      left: (x * parent.cellWidth) + 25,
      angle: view.get('angle') + 10
    })

  };

  const die = reason => {
    character.emit('death', reason);
  };

  const character =  Object.assign(
    {
      isCharacter: true,
      frequence: 10,
      view,
      die,
      render,
      update,
      set direction(newValue) {
        _direction = newValue;
      },
      get direction() {
        return _direction;
      }
    },
    EventEmitter.prototype
  );

  Node(character, value);

  if (position)
  character.position = position;

  Object.defineProperty(character, 'lastPosition', {
    configurable: true,
    enumerable: true,
    get: getLastPosition,
    set: setLastPosition
  });

  return character;
};

internals.Character.directions = {
  UP: {x: 0, y : -1},
  DOWN: {x: 0, y : 1},
  LEFT: {x: -1, y : 0},
  RIGHT: {x: 1, y : 0}
};