import Game from './game';
import Piece from './piece';
import Animation from './animation';
import Player from './player';
import Character from './character';
import {default as Grid, Node} from './grid';
import FabricRenderer from './renderers/fabric';
import 'fabric'

window.$ = document.querySelector.bind(document);
window.$.create = document.createElement.bind(document);

const isEmptyNode = value => value.isNode && !value.isCharacter && !value.isFood;

const Food = () => Node({
  isFood: true,
  position: world.getRandomPosition(isEmptyNode)
}, 3);

const Snake = function Snake(object) {

  const snake = Object.assign(
    Character(object, 1),
    {
      isSnake: true
    }
  );

  const _tail = [snake.position];

  snake.on('death', reason => {
    console.error(`GAME OVER: Character1 is dead.... (${reason})`);
    game.stop();
  });

  const _update =  snake.update;
  snake.update = (snake, grid) => {
    console.log('Snake.update()', grid);

    _tail.unshift(snake.position);
    _update(snake, grid);

    const node = world.getNode(snake.position);

    if (!node || !node.isFood)
      return _tail.pop();

    world.add('food1', Food());
  };

  Object.defineProperty(snake, 'lastPosition', {
    configurable: true,
    enumerable: true,
    get: () => _tail[_tail.length - 1],
    set: newValue => {}
  });

  let _direction = snake.direction;

  Object.defineProperty(snake, 'direction', {
    configurable: true,
    enumerable: true,
    get: () => _direction,
    set: input => {
      const {UP, DOWN, LEFT, RIGHT} = Character.directions;

      switch(input) {
        case UP:
          if (_direction !== DOWN) {
            _direction = UP;
          }
          break;
        case DOWN:
          if (_direction !== UP) {
            _direction = DOWN;
          }
          break;
        case LEFT:
          if (_direction !== RIGHT) {
            _direction = LEFT;
          }
          break;
        case RIGHT:
          if (_direction !== LEFT) {
            _direction = RIGHT;
          }
          break;
      }

    }
  });

  return snake;
};



const world = Grid();
world.on('exit', piece => {

  if (piece.isCharacter)
    piece.die('Out of world');

});


const snake = Snake();
//const food = Food({position: world.getRandomNode().position});

world.add('food1', Food());
world.add('food2', Food());

const player1 = Player(snake);

const game = Game();

game.add('world', world.add('snake', snake));

//world.add('food', food);

window.addEventListener("load", (event) => {

  const output1 = $('#output1');
  const output2 = $('#output2');

  game.on('tick', stats => {
    output1.innerHTML = JSON.stringify(stats, null, 2);
  });

  game
    .view('canvas1', FabricRenderer($('#canvas1'), {}))
    .view('canvas2', FabricRenderer($('#canvas2'), {zoom: 0.75}))
    .start();

  $('#stop').addEventListener('click', event => game.stop());

  $('#start').addEventListener('click', event => game.start());

  $('#pause').addEventListener('click', event => game.pause());

});