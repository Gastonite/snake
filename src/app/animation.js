import {EventEmitter} from 'events';

import Piece from './piece';
import Updater from './updater';
import Renderer from './renderer';
import './polyfills/requestAnimationFrame';

const Animation = function ({
  maxFps = 30,
  renderers = [],
  updaters = [],
  reporters = []
  } = {}) {

  let isGameOver;
  let pausedTime = 0;
  let frameCount = 0;
  let paused;
  let sinceStart;
  let played;
  let fps;
  let fpsInterval;
  let startTime;
  let now;
  let lastCycle;
  let elapsed;

  const _reporters = [];

  const _stats = {};

  const start = () => {

    pausedTime = 0;
    paused = null;
    isGameOver = false;
    fpsInterval = 1000 / maxFps;
    lastCycle = Date.now();
    startTime = lastCycle;

    _views.forEach(view => {

      animation.renderers.forEach((renderer, key) => {

        view.add(key, renderer);
      });
    });

    Object.defineProperty(animation, 'renderers', {
      configurable: true,
      enumerable: true,
      get: () => {
        return _views
      }
    });

    _loop();

    console.log('Animation start', startTime);

    return animation;
  };

  const stop = function () {
    console.log('Animation.stop()');
    isGameOver = true;
    return animation;
  };

  const pause = function () {

    if (!paused) {
      paused = Date.now();
      return;
    }

    pausedTime = pausedTime + (Date.now() - paused);
    paused = null;
    _loop()
  };

  const _loop = function () {

    if (isGameOver || paused) {
      return;
    }

    requestAnimationFrame(_loop);

    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - lastCycle;


    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {

      console.info('');
      animation.emit('tick', _stats);
      sinceStart = now - startTime;
      fps = Math.round((sinceStart / frameCount));
      played = sinceStart;

      Object.keys(_reporters).forEach((key) => {
        const reporter = _reporters[key];

        if ((frameCount % reporter.frequence) === 0) {

          _stats[key] = reporter.report(_stats);
        }
      });

      try {
        animation.update();
        animation.render();
      } catch (err) {
        console.error('Cannot finish loop:', err.stack);
      }



      ++frameCount;

      // Get ready for next frame by setting then=now, but...
      // Also, adjust for fpsInterval not being multiple of 16.67
      lastCycle = now - (elapsed % fpsInterval);
    }
  };


  const reporter = (reporters, key) => {

    const invalidReporter = msg => {
      throw new Error('Invalid reporter: '+msg);
    };

    if (typeof reporters != 'object')
      throw new Error('Must be an object');

    let val;
    Object.keys(reporters).forEach((key) => {
      val = reporters[key];

      if (typeof val == 'function')
        val = val(animation);

      if (typeof val != 'object')
        throw new Error('Must be an object');

      if (typeof val.report != 'function')
        invalidReporter('"reporter" must be a function or an object with a "report" method');

      if (val.frequence === void 0)
        val.frequence = 1;

      if (!Number.isInteger(val.frequence) || val.frequence < 1)
        invalidReporter('"frequence" must be an positive integer number.');

      _reporters[key] = val;
    });

  };

  const render = () => {
    console.log('render()');

    if (isGameOver || paused) {
      return;
    }

    animation.renderers.forEach(renderer => {

      if ((frameCount % renderer.frequence) === 0) {

        renderer.render(renderer.view, animation);

      }
    });
  };

  const update = () => {
    console.log('update()');

    if (isGameOver || paused) {
      return;
    }

    animation.updaters.forEach(updater => {

      if ((frameCount % updater.frequence) === 0) {

        updater.update(updater, animation);

      }
    });
  };


  const _views = new Map();
  const view = (key, renderer) => {
    console.log('view()');

    if (!key || typeof key != 'string')
      throw new Error('"key" must be a string');

    if (_views.has(key))
      throw new Error('That view already exists');

    _views.set(key, Renderer.assert(renderer));

    return animation;
  };

  const animation = Object.assign(
    {
      isAnimation: true,
      get now() {
        return now;
      },
      get elapsed() {
        return elapsed;
      },
      get lastCycle() {
        return lastCycle;
      },
      get fps() {
        return fps;
      },
      get frameCount() {
        return frameCount;
      },
      get played() {
        return (sinceStart - pausedTime) / 1000;
      },
      get paused() {
        return pausedTime / 1000;
      },

      //set state(input) {
      //  state = input;
      //},
      get startTime() {
        return startTime;
      },
      get sinceStart() {
        return sinceStart / 1000;
      },
      reporter,
      render,
      update,
      start,
      pause,
      view,
      stop
    },
    EventEmitter.prototype
  );

  Piece(animation);

  animation.render = render;
  animation.update = update;

  //if (renderers && renderers.length)
  //  animation.renderer.apply(null, renderers);
  //
  //if (updaters && updaters.length)
  //  animation.updater.apply(null, updaters);

  //if (pieces && pieces.length)
  //  _pieces.push.apply(_pieces, pieces);


  if (reporters)
    reporter(reporters);

  //
  //if (!state || state.length === void 0)
  //  throw new Error('"state" must be an iterable');

  return animation;
};

export default Animation;