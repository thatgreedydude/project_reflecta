const {
  createGame
} = require("./game/factories/GameFactory");

const game = createGame();

console.dir(game, {
  depth: null
});