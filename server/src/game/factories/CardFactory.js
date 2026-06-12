const crypto = require("crypto");

function createPlaceholderCard(ownerId) {
  return {
    id: crypto.randomUUID(),
    name: "David the First",

    cost: 1,

    base_attack: 1,
    base_armor: 1,
    current_attack: 1,
    current_armor: 1,

    aspects: ["Null"],
    attributes: [],

    ownerId
  };
}

module.exports = {
  createPlaceholderCard
};