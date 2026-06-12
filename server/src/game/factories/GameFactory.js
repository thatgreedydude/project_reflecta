const crypto = require("crypto");

const Phase =
  require("../models/Phase");

const {
  createPlayer
} = require("./PlayerFactory");

function createGame() {
  return {
    gameId: crypto.randomUUID(),

    playerA: createPlayer("playerA"),
    playerB: createPlayer("playerB"),

    currentPlayer: "playerA",

    currentPhase: Phase.DAWN,

    turnNumber: 1,

    winner: null
  };
}

module.exports = {
  createGame
};