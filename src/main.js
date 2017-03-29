import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import Canvas from './canvas';

const canvas = Canvas();

const reducers = combineReducers({
  canvas: canvas.reducer
});

const store = createStore(reducers, window.devToolsExtension && window.devToolsExtension());

const ConnectedFabricCanvas = connect(
  store => store.canvas,
  canvas.dispatch
)(canvas.component);

const App = () => (
  <Provider store={store}>
    <ConnectedFabricCanvas/>
  </Provider>
);

ReactDOM.render( <App/>, document.getElementById('app'));