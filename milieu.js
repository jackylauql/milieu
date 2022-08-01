const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let deck_of_cards = [];

const suits = ["spades", "diamond", "club", "heart"];
const map_cards = {
  0: "Ace",
  1: "2",
  2: "3",
  3: "4",
  4: "5",
  5: "6",
  6: "7",
  7: "8",
  8: "9",
  9: "10",
  10: "Jack",
  11: "Queen",
  12: "King",
};
const suits_value = {
  spades: 4,
  heart: 3,
  club: 2,
  diamond: 1,
};

for (let i = 0; i < 13; i++) {
  for (const suit of suits) {
    deck_of_cards.push({
      value: i,
      suit,
    });
    deck_of_cards.push({
      value: i,
      suit,
    });
  }
}

const checkHigher = (card, highest) => {
  return (
    card.value > highest.value ||
    (card.value === highest.value &&
      suits_value[card.suit] > suits_value[highest.suit])
  );
};

const promptNumberOfPlayers = () => {
  rl.question("Please enter the number of players: ", (number) => {
    if (isNaN(number)) {
      console.log("Please enter a valid number");
      promptNumberOfPlayers();
      return;
    }
    const number_of_players = Number(number);
    if (number_of_players < 4) {
      console.log("Please enter at least 4 players");
      promptNumberOfPlayers();
      return;
    }
    playGame(number_of_players);
  });
};

const playGame = async (number_of_players) => {
  let highest_card;
  let winner;
  let tie;
  const cards = {};
  const scores = {};
  for (let n = 1; n < number_of_players + 1; n++) {
    const player = `Player${n}`;
    scores[player] = 0;
  }

  const drawCard = (current_player, total_players) => {
    // reached the end of current round
    if (current_player == total_players) {
      endRound();
      return;
    }
    console.log(`--Player${current_player}'s Turn!--`);
    rl.question("Skip Draw? (default is no) ", (input) => {
      if (input === "y") {
        // player skipped draw
        console.log(`Player${current_player} skipped draw!\n`);
        drawCard(current_player + 1, total_players);
      } else {
        // player draws card
        let rand = Math.round(Math.random() * deck_of_cards.length - 1);
        const card = deck_of_cards.splice(rand, 1)[0];
        const player = `Player${current_player}`;
        cards[player] = card;
        console.log(
          `Player${current_player} drew a ${map_cards[card.value]} of ${
            card.suit
          }!\n`
        );
        if (
          highest_card &&
          highest_card.value === card.value &&
          highest_card.suit === card.suit
        ) {
          tie = player;
        }
        if (!highest_card || checkHigher(card, highest_card)) {
          winner = player;
          highest_card = card;
          tie = null;
        }
        if (deck_of_cards.length === 0) {
          // end round if no cards left
          console.log("No cards left!");
          endRound();
        } else {
          drawCard(current_player + 1, total_players);
        }
      }
    });
  };

  const startRound = () => {
    highest_card = null;
    winner = null;
    tie = null;
    drawCard(1, number_of_players + 1);
  };

  const endRound = () => {
    if (!highest_card) {
      console.log("No winners because no one drew a card!");
      startRound();
    }
    if (tie) {
      console.log(
        `There are no winners this round! ${winner} and ${tie} tied with the highest value of ${highest_card.value} of ${highest_card.suit}`
      );
    } else {
      console.log(
        `-----${winner} won this round with a ${
          map_cards[highest_card.value]
        } of ${highest_card.suit}-----`
      );
      scores[winner] += 1;
    }
    if (deck_of_cards.length > 0) startRound();
    else endGame();
  };

  const endGame = () => {
    const sorting_scores = [];
    for (const key in scores) {
      sorting_scores.push([key, scores[key]]);
    }
    sorting_scores.sort(function (a, b) {
      return b[1] - a[1];
    });
    let score_table = "";
    const winners = [];
    sorting_scores.forEach((score) => {
      score_table += `${score[0]}: ${score[1]}\n`;
      if (score[1] === sorting_scores[0][1]) {
        winners.push(score);
      }
    });
    console.log(score_table);
    if (winners.length > 1) {
      console.log(
        `\n -------Congratulations to ${winners.map(
          (winner) => `${winner[0]} `
        )}who won the game with a score of ${sorting_scores[0][1]}!!!-------`
      );
    } else {
      console.log(
        `\n-------Congratulations to ${sorting_scores[0][0]} who won the game with a score of ${sorting_scores[0][1]}!!!-------`
      );
    }
    rl.close();
  };

  startRound();
};

promptNumberOfPlayers();
