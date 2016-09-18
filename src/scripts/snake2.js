'use strict';

//import View from '../../lib/view';
//import Game from '../../lib/controllers/game';
import {EventEmitter} from 'events';


window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

//const Node = function (world) {
//
//  let position;
//
//  return {
//    isNode: true,
//    setPosition({x = 0,y = 0} = {}) {
//      return position = {x, y};
//    },
//    getPosition() {
//      return position;
//    }
//  }
//};

const Node = function(x, y, value) {
  const position = {
    "x" : x,
    "y" : y
  };

  return {
    isNode: true,
    position,
    value
  };
};

Node.types = {
  EMPTY: 0,
  SNAKE: 1,
  FOOD: 2
};
Node.assert = (input) => {
  if (!input || !input.isNode)
    throw new Error('Not a Node instance');

  return input;
};

const Grid = function (width = 32, height = 32, initValue = Node.types.EMPTY) {

  console.log('Creating world...');

  if (!Number.isInteger(initValue))
    throw new Error('"initValue" parameter must be an integer');

  const matrix = [];

  const initialize = () => {
    matrix.length = 0;
    for (let x = 0; x < width; x++) {

      matrix[x] = [];

      for (let y = 0; y < height; y++) {

        matrix[x][y] = Node(x, y, initValue);

      }
    }

  };

  const assertPositionExists = ({x, y} = {}) => {

    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      throw new Error('Invalid position: "x" and "y" must both be integers');
    }

    if (x < 0 || y < 0 || x > width || y > height) {
      throw new Error('Out of grid');
    }

  };

  const getNode = position => {

    if (!position)
      return getRandomNode();

    assertPositionExists(position);

    return matrix[position.x][position.y];
  };

  const setNode = (value, position) => {

    const node = getNode(position);

    return matrix[node.position.x][node.position.y].value = value;
  };

  const getRandomNode = filter => {

    const node = getNode({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    });

    if (typeof filter != 'function') {
      return node;
    }

    return filter(node) ? node : getRandomNode();
  };

  console.log('new Grid');
  initialize();
  return {
    isGrid: true,
    width,
    height,
    reset: initialize,
    getNode,
    setNode,
    getRandomNode
  }
};

Grid.assert = (input) => {
  if (!input || !input.isGrid)
    throw new Error('Not a Grid instance');

  return input;
};

const Snake = (node) => {

  let direction = Snake.directions.UP;
  const _queue = [];
  let head = null;

  const insert = function(node) {

    Node.assert(node);

    node.value = Node.types.SNAKE;
    //const node = ;
    _queue.unshift(node);
    head = _queue[0];
  };

  const remove = () => _queue.pop();

  const move = node => {

    insert(node);
    const tail = remove();
    tail.value = Node.types.EMPTY;
  };

  const grow = node => {

    insert(node);
    //const tail = remove();
    //tail.value = Node.types.EMPTY;
  };

  const changeDirection = newDirection => {
    direction = newDirection;
  };

  if (node) {
    insert(node);
  }

  const snake = {
    changeDirection,
    getDirection: () => direction,
    getHead: () => head,
    move,
    grow
  };

  return Object.assign(
    snake,
    EventEmitter.prototype
  );
};

Snake.directions = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

const Game = function (grid) {

  if (!grid)
    grid = Grid();

  const canvas = document.createElement('canvas');
  canvas.width = grid.width * 25;
  canvas.height = grid.height * 25;
  const ctx = canvas.getContext('2d');

  document.body.appendChild(canvas);

  let frame = 0;
  const keyState = {};
  let snake;

  document.addEventListener('keydown', event => {
    const keyCode = event.keyCode || event.which || event.charCode;

    const currentDirection = snake.getDirection();
    switch(keyCode){
      case 90:
        if (currentDirection !== Snake.directions.DOWN) {
          snake.changeDirection(Snake.directions.UP);
        }
        break;
      case 83:

        if (currentDirection !== Snake.directions.UP) {
          snake.changeDirection(Snake.directions.DOWN);
        }

        break;
      case 81:
        if (currentDirection !== Snake.directions.RIGHT) {
          snake.changeDirection(Snake.directions.LEFT);
        }

        break;
      case 68:
        if (currentDirection !== Snake.directions.LEFT) {
          snake.changeDirection(Snake.directions.RIGHT);
        }
        break;
    }

  });

  let isGameOver = false;

  const render = () => {
    const tileWidth = canvas.width / grid.width;
    const tileHeight = canvas.height / grid.height;

    for (let x = 0; x < grid.width; x++) {
      for (let y = 0; y < grid.height; y++) {

        switch (grid.getNode({x, y}).value) {
          case Node.types.EMPTY:
            ctx.fillStyle = '#fff';
            break;
          case Node.types.SNAKE:
            ctx.fillStyle = '#0ff';
            break;
          case Node.types.FOOD:
            ctx.fillStyle = '#f00';
            break;
        }

        ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight)

        //qq
      }
    }
  };

  const loop = function () {
    console.log('game.loop()', frame);

    try {
      update();
      render();
    } catch (err) {
      console.error(err)
    }

    if (isGameOver)
      return;

    frame = window.requestAnimationFrame(loop);
  };

  const update = () => {

    if (frame % 10 === 0) {
      //snake.move(grid);

      const newPosition = Object.assign({}, snake.getHead().position);
      const snakeDirection = snake.getDirection();
      console.log('snakeDirection', snakeDirection);
      switch (snakeDirection) {
        case Snake.directions.LEFT:
          newPosition.x--;
          break;
        case Snake.directions.UP:
          newPosition.y--;
          break;
        case Snake.directions.RIGHT:
          newPosition.x++;
          break;
        case Snake.directions.DOWN:
          newPosition.y++;
          break;
      }

      let newNode;
      try {
        newNode = grid.getNode(newPosition);
      } catch (err) {
        snake.emit('dead', err);
        //throw err;
        return;
      }

      if (newNode.value === Node.types.SNAKE) {
        snake.emit('dead', {message: 'Snake collision'});
        return;
      }

      if (newNode.value === Node.types.FOOD) {
        snake.grow(newNode);
        grid.setNode(Node.types.FOOD);
      }

      else
        snake.move(newNode);

    }
  };

  const start = () => {
    console.log('game.start()', frame);

    frame = 0;
    isGameOver = false;
    grid.reset();

    const snakePosition = {
      x: Math.floor(grid.height / 2),
      y: grid.width - 1
    };

    snake = Snake(grid.getNode(snakePosition));

    snake.on('dead', function (event) {
      console.error(`GAME OVER (${event.message})`, event.stack);
      isGameOver = true;
      //stop();
      restart();
    });

    grid.setNode(Node.types.FOOD);

    console.log(grid.getRandomNode());

    //grid.setNode(Node.types.SNAKE, snake.head);
    loop();
    return game;
  };

  const stop = () => {

    if (!frame)
      return;

    console.log('game.stop()', frame);

    window.cancelAnimationFrame(frame);
    frame = 0;
  };

  const restart = () => {
    stop();
    start();
  };

  const game = {
    start,
    restart,
    stop
  };

  return game;
};

window.addEventListener("load", function(event) {
  //console.log("Loading...");
  ////document.body.appendChild(canvas);
  //const world = new World(24, 24);
  //const game = new Game(world);
  //document.body.appendChild(game.view.canvas);
  //
  //game.start();
  Game().start();
});
