
import Animation from './animation';
import Piece from './piece';

const fps = game => {
  let last = Date.now();
  let lastFrame = 0;

  return {
    frequence: 10,
    report: stats => {

      const nbFrames = game.frameCount - lastFrame;

      const elapsed = (game.now - last) / 1000;

      last = game.now;
      lastFrame = game.frameCount;

      return Math.round((nbFrames / elapsed) * 1000) / 1000;
    }
  };
};

//const nbObjects = game => ({
//  frequence: 10,
//  report: stats => {
//    console.log(1)
//    return game.state.getObjects().length;
//  }
//});

const renderers = game => ({
  frequence: 10,
  report: stats => game.renderers
});

const updaters = game => ({
  frequence: 10,
  report: stats => game.updaters
});


const Game = function Game({maxFps = 4, pieces = [], players = []} = {}) {



  let game = Object.assign(
    Animation({
      maxFps,
      reporters: {
        //renderers,
        //updaters,
        fps
        //nbObjects
      }
    }),
    {
      isGame: true
    }
  );



  //game = Piece(game);



  return game;
};


export default Game;