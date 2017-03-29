import React from 'react';
import ReactDOM from 'react-dom';
import { componentDidMount, shouldComponentUpdate, combine, createClass } from 'react-partial'
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { fabric } from 'fabric';


const initialState = {
  "objects": [
    {
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
    },
    {
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
    },
    {
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
    }
  ],
  "background": ""
};

const reducers = combineReducers({
  scene: (state = initialState, action) => {

    console.info('canvasReducer:', action);
    switch (action.type) {
      case "UPDATE_CANVAS":
        return state = _canvas.toObject();
      default:
        return state
    }
  }
});


const store = createStore(reducers, window.devToolsExtension && window.devToolsExtension());

let _canvas = new fabric.Canvas();

const _loadAndRender = (props) => {

  console.info('_loadAndRender()', props);

  _canvas.loadFromJSON(props.scene);

  _canvas.renderAll();

  // if there is any previously active object, we need to re-set it after rendering canvas
  const selected = props.selected;
  if (selected > -1)
    _canvas.setActiveObject(_canvas.getObjects()[props.selected]);

};

let _canvasElement;


const _initializeCanvas = (component) => {

  console.info('_initializeCanvas()', component);

  _canvas.initialize(_canvasElement, {
    height: 600,
    width: 600,
  });

  _loadAndRender(component.props); // initial call

  _canvas.on('mouse:up', () => {

    store.dispatch({
      type: 'UPDATE_CANVAS'
    });

    _loadAndRender(component.props);
  });
};

const Canvas = () => {

  return <canvas ref={component => (_canvasElement = component)} />
};

const FabricCanvas = createClass({
  componentDidMount: _initializeCanvas
})(Canvas);

const mapStateToProps = store => store;

const ConnectedFabricCanvas = connect(mapStateToProps)(FabricCanvas);

const App = () => (
  <Provider store={store}>
    <ConnectedFabricCanvas/>
  </Provider>
);

ReactDOM.render( <App/>, document.getElementById('app'));