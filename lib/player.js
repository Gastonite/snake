import Character from './character';
const internals = {};


export default internals.Player = function Player(character, {keyBindings = {UP: 90, DOWN: 83, LEFT: 81, RIGHT: 68}} = {}) {
  console.log('new Player');

  if (!character.isCharacter)
    throw new Error('Not a Character instance');

  document.addEventListener("keyup", (event) => {
    let currKey = event.keyCode || event.which || event.charCode;
    switch(currKey){
      case keyBindings.UP:
        character.direction = Character.directions.UP;
        break;
      case keyBindings.DOWN:
        character.direction = Character.directions.DOWN;
        break;
      case keyBindings.LEFT:
        character.direction = Character.directions.LEFT;
        break;
      case keyBindings.RIGHT:
        character.direction = Character.directions.RIGHT;
        break;
    }
  });
};