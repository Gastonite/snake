import {noop} from './util';

const internals = {};

internals.isUpdater = piece => piece.isUpdater;


export default internals.Updater = function Updater(object) {

  if (!object || typeof object != 'object')
    throw new Error('A updater must be an object');

  if (typeof object.update != 'function')
    object.update = noop;

  const _frequence = (object.frequence && Number.isInteger(object.frequence))
    ? object.frequence
    : 1;

  const _updatePieces = piece => piece.updaters.forEach(updater => {
    _updatePieces(updater);
    updater.update(updater, piece);
  });

  const _update = object.update;
  const update = (updater, parent) => {
    //console.log('updateProxy', parent)
    _updatePieces(updater);
    _update(updater, parent);
  };

  const updater = Object.assign(
    object,
    {
      isUpdater: true,
      update
    }
  );

  Object.defineProperty(updater, 'updaters', {
    configurable: true,
    enumerable: true,
    get: () => updater.pieces.filter((piece, key) => {
      return piece.isUpdater;
    }),
    set: newValue => {}
  });

  Object.defineProperty(updater, 'frequence', {
    configurable: true,
    enumerable: true,
    get: () => _frequence,
    set: newValue => {}
  });

  return updater;
};


internals.Updater.assert = input => {
  if (!input || !input.isUpdater)
    throw new Error('Not a Updater instance');

  return input;
};