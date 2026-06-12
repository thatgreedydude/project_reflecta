test("starter deck contains 30 cards", () => {
    const deck = createStarterDeck("playerA");

    expect(deck.length).toBe(30);
});