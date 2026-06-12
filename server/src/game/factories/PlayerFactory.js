const {
  createStarterDeck
} = require("./DeckFactory");

const {
    STARTING_HP,
    STARTING_LIGHT
} = require("../constants/GameConfig");

function createZone() {
    return {
        cards: []
    };
}

function createPlayer(id) {
  return {
    id,

    hp: STARTING_HP,

    lightPocket: STARTING_LIGHT,

    deck: {
      cards: createStarterDeck(id)
    },
    hand: createZone(),
    graveZone: createZone(),
    safeZone: createZone(),
    warZone: createZone(),
  };
}

module.exports = {
  createPlayer
};