import Renderer from './renderer';
import Updater from './updater';

export default function Piece(object = {}) {

  let _pieces = new Map();

  const add = (key, item) => {

    console.log('Piece.add()', key);

    if (!key || typeof key != 'string')
      throw new Error('"key" must be a string');

    if (typeof item == 'function')
      item = item(piece);

    if (!item || typeof item != 'object')
      throw new Error('"item" must be an object');

    if (!item.isPiece)
      item = Piece(item);

    if (_pieces.has(key))
      throw new Error('"'+key+'" already exists');

    _pieces.set(key, item);

    return piece;
  };

  const remove = _pieces.delete.bind(_pieces);
  const get = _pieces.get.bind(_pieces);
  const has = _pieces.has.bind(_pieces);
  const forEach = _pieces.forEach.bind(_pieces);
  const filter = callback => {
    const filtered = new Map();
    Array.from(_pieces.entries()).forEach(entry => {
      if (callback(entry[1], entry[0])) {
        filtered.set.apply(filtered, entry)
      }
    });

    return filtered;
  };

  const piece = Object.assign(object, {
    isPiece: true,
    add,
    get,
    forEach,
    has,
    filter,
    remove
  });


  Object.defineProperty(object, 'pieces', {
    configurable: false,
    enumerable: false,
    get: () => {
      return Array.from(_pieces.values())
    },
    set: input => {
      if (!(input instanceof Map))
        throw new Error('pieces must be a Map object');
      _pieces = input;
    }
  });
  Object.defineProperty(object, 'size', {
    configurable: false,
    enumerable: false,
    get: () => {
      return _pieces.size
    }
  });

  if (typeof piece.update == 'function')
    Updater(piece);

  if (typeof piece.render == 'function')
    Renderer(piece);


  return piece;
};

// import CollectionFactory from './collection';
//
//let nbPieces = 0;
//
//export default function Piece(game, object = {}) {
//
//  if (!game || !game.isGame)
//    throw new Error('"game" argument must be a Game instance');
//
//  if (typeof object != 'object')
//    throw new Error('"piece" argument must be an object');
//
//  //if (id && typeof id != 'string')
//  //  throw new Error('"id" argument must be a string');
//
//  nbPieces++;
//
//  const preSave = item => {
//
//    if (!item || typeof item != 'object')
//      throw new Error('Nothing to add');
//
//    if (item.render && typeof item.render == 'function') {
//
//      const parentIndex = game.renderers.indexOf(piece);
//
//      if (!~parentIndex)
//        throw new Error('Unknown renderer');
//
//      item.frequence = piece.frequence;
//      game.renderers.splice(parentIndex, 0, item)
//    }
//
//    //
//    //if (item.update && typeof item.update == 'function')
//    //  game.updater(item);
//    //
//    //if (item.report && typeof item.report == 'function')
//    //  game.reporter(item);
//
//    return item;
//  };
//
//
//  const piece = Object.assign(
//    object,
//    {
//      id: object.id || nbPieces,
//      isPiece: true
//      //parent: parent
//    },
//    CollectionFactory({preSave})()
//  );
//
//
//  if (!piece.renderer)
//    piece.renderer = item => game.renderer(item);
//
//  if (!piece.updater)
//    piece.updater = item => game.updater(item);
//
//  if (!piece.reporter)
//    piece.reporter = item => game.reporter(item);
//
//
//  return piece;
//};