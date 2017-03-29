// import './app/snake';

import React from 'react';
import ReactDOM from 'react-dom';
import { componentDidMount, shouldComponentUpdate, combine } from 'react-partial'
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { fabric } from 'fabric';


const initialState = {
  canvas: {
    "objects": [{
      "type": "circle",
      "originX": "center",
      "originY": "center",
      "left": 50,
      "top": 50,
      "width": 100,
      "height": 100,
      "fill": "#FF00FF",
      "stroke": null,
      "strokeWidth": 1,
      "strokeDashArray": null,
      "strokeLineCap": "butt",
      "strokeLineJoin": "miter",
      "strokeMiterLimit": 10,
      "scaleX": 1,
      "scaleY": 1,
      "angle": 0,
      "flipX": false,
      "flipY": false,
      "opacity": 1,
      "shadow": null,
      "visible": true,
      "clipTo": null,
      "backgroundColor": "",
      "fillRule": "nonzero",
      "globalCompositeOperation": "source-over",
      "transformMatrix": null,
      "radius": 50,
      "startAngle": 0,
      "endAngle": 6.283185307179586
    }, {
      "type": "rect",
      "originX": "center",
      "originY": "center",
      "left": 126,
      "top": 210,
      "width": 100,
      "height": 100,
      "fill": "#FF0000",
      "stroke": null,
      "strokeWidth": 1,
      "strokeDashArray": null,
      "strokeLineCap": "butt",
      "strokeLineJoin": "miter",
      "strokeMiterLimit": 10,
      "scaleX": 1,
      "scaleY": 1,
      "angle": 0,
      "flipX": false,
      "flipY": false,
      "opacity": 1,
      "shadow": null,
      "visible": true,
      "clipTo": null,
      "backgroundColor": "",
      "fillRule": "nonzero",
      "globalCompositeOperation": "source-over",
      "transformMatrix": null,
      "radius": 50,
      "startAngle": 0,
      "endAngle": 6.283185307179586
    }, {
      "type": "triangle",
      "originX": "center",
      "originY": "center",
      "left": 250,
      "top": 100,
      "width": 100,
      "height": 100,
      "fill": "#00F00F",
      "stroke": null,
      "strokeWidth": 1,
      "strokeDashArray": null,
      "strokeLineCap": "butt",
      "strokeLineJoin": "miter",
      "strokeMiterLimit": 10,
      "scaleX": 1,
      "scaleY": 1,
      "angle": 0,
      "flipX": false,
      "flipY": false,
      "opacity": 1,
      "shadow": null,
      "visible": true,
      "clipTo": null,
      "backgroundColor": "",
      "fillRule": "nonzero",
      "globalCompositeOperation": "source-over",
      "transformMatrix": null,
      "radius": 50,
      "startAngle": 0,
      "endAngle": 6.283185307179586
    }],
    "background": ""
  }
};

const canvasReducer = (state = initialState, action) => {

  console.info('canvasReducer()', state, action);


  switch (action.type) {
    case "OBJECTS_CANVAS_CHANGE":

      return Object.assign({}, state, {
        canvas: action.payload.canvas,
        selected: action.payload.selected
      });

    default:
      return state
  }
  // return state;
};


const store = createStore(combineReducers({
  canvas: canvasReducer
}), window.devToolsExtension && window.devToolsExtension());

const _canvas = new fabric.Canvas();

const _loadAndRender = props => {

  console.info('_loadAndRender()', props);

  _canvas.loadFromJSON(props.canvas.canvas);

  _canvas.renderAll();

  // if there is any previously active object, we need to re-set it after rendering canvas
  const selected = props.canvas.selected;

  if (selected > -1)
    _canvas.setActiveObject(_canvas.getObjects()[props.canvas.selected]);

};

const CanvasContainer = React.createClass({

  render: function() {

    _loadAndRender();

    return <canvas ref="objectsCanvas" />;
  }
});


// const Canvas = ;
// (
//   <div>
//     {/* send store and fabricInstance viac refs (maybe not the cleanest way, but I was not able to create global instance of fabric due to use of ES6 modules) */}
//     <CanvasContainer ref="canvasContainer" canvas={props.canvas} fabricInstance={canvas}/>
//   </div>
// );

const Canvas = props => {

  console.info('Canvas');

  _loadAndRender(props);

  return <canvas />;
};

const CanvasWrapper = combine(
  componentDidMount((self, props, state) => {

    console.info('canvasDidMount', self, props, state, _canvas);

    // we need to get canvas element by ref to initialize fabric
    const el = _canvas.lowerCanvasEl;

    _canvas.initialize(el, {
      height: 400,
      width: 400,
    });

    // initial call to load objects in store and render canvas
    _loadAndRender(props);

    _canvas.on('mouse:up', () => {

      store.dispatch({
        type: 'OBJECTS_CANVAS_CHANGE',
        payload: {
          // send complete fabric canvas object to store
          canvas: _canvas.toObject(),
          // also keep lastly active (selected) object
          selected: _canvas.getObjects().indexOf(_canvas.getActiveObject())
        }
      });

      _loadAndRender(props);
    });
  })
);

// console.error('canvasDidMount=', canvasDidMount, 'Canvas', Canvas)
// class which takes care about instantiating fabric and passing state to component with actual canvas
// const Canvas = React.createClass({
//   componentDidMount,
//   render:
// });

const ConnectedCanvas = connect(store => { //mapStateToProps
  return {
    canvas: store.canvas
  };
})(CanvasWrapper(Canvas));


const App = () => (
  <div>
    <Provider store={store}>
      <ConnectedCanvas/>
    </Provider>
  </div>
);


ReactDOM.render( <App/>, document.getElementById('app'));