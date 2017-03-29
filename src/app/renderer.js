import {noop} from './util';
const internals = {};


export default internals.Renderer = function Renderer(object) {

  if (typeof object.render != 'function')
    object.render = noop;

  const _frequence = (object.frequence && Number.isInteger(object.frequence))
    ? object.frequence
    : 1;

  object.view = object.view || {};

  const _render = object.render;
  const render = (view, parent) => {

    renderer.renderers.forEach(piece => piece.render(piece.view, renderer));
    _render(view, parent);
  };

  const renderer = Object.assign(
    object,
    {
      isRenderer: true,
      render
    }
  );

  Object.defineProperty(renderer, 'renderers', {
    configurable: true,
    enumerable: true,
    get: () => renderer.filter(piece => piece.isRenderer),
    set: newValue => {}
  });

  Object.defineProperty(renderer, 'frequence', {
    configurable: true,
    enumerable: true,
    get: () => _frequence,
    set: newValue => {}
  });

  return renderer;
};


internals.Renderer.assert = input => {
  if (!input || !input.isRenderer)
    throw new Error('Not a Renderer instance');

  return input;
};