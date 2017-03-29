import React from 'react';
import { fabric } from 'fabric';

import { componentDidMount, shouldComponentUpdate, combine, createClass } from 'react-partial'

const Canvas = () => {

  const _initialState = {
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

  const _canvas = new fabric.Canvas();
  let _canvasElement;

  const _render = (props) => {

    console.info('_loadAndRender()', props);

    _canvas.loadFromJSON(props);

    _canvas.renderAll();

    // if there is any previously active object, we need to re-set it after rendering canvas
    const selected = props.selected;
    if (selected > -1)
      _canvas.setActiveObject(_canvas.getObjects()[props.selected]);

  };

  const _initialize = (component, props, state) => {

    console.info('_initializeCanvas()', props, state);

    _canvas.initialize(_canvasElement, {
      height: 600,
      width: 600,
    });

    _render(component.props); // initial call

    _canvas.on('mouse:up', () => {


      props.selectObject();
      props.updateCanvas();
      // store.dispatch({
      //   type: 'UPDATE_CANVAS',
      //   payload: _canvas.toObject()
      // });

      _render(component.props);
    });
  };

  const reducer = (state = _initialState, action) => {

    console.info('canvasReducer:', state,  action);
    switch (action.type) {
      case "SELECT_OBJECT":
        return {...state, selected: action.payload};
      case "UPDATE_CANVAS":
        return {...state, objects: action.payload};
      default:
        return state
    }
  };

  const dispatch = {
    selectObject: (a,b,c) => ({
      type: 'SELECT_OBJECT',
      payload: _canvas.getObjects().indexOf(_canvas.getActiveObject())
    }),
    updateCanvas: (a,b,c) => ({
      type: 'UPDATE_CANVAS',
      payload: _canvas.toObject().objects
    })
  };

  const component = createClass({
    componentDidMount: _initialize
  })(() => <canvas ref={component => (_canvasElement = component)} />);;

  return {
    reducer,
    component,
    dispatch
  };
};

export default Canvas;