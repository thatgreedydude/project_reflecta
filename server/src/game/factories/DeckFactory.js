const {
  createPlaceholderCard
} = require("./CardFactory");

function createStarterDeck(ownerId) {
  const deck = [];

  for (let i = 0; i < 30; i++) {
    deck.push(
      createPlaceholderCard(ownerId)
    );
  }

  return deck;
}

module.exports = {
  createStarterDeck
};