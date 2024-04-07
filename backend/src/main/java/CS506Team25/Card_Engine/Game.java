package CS506Team25.Card_Engine;

import java.util.*;

public class Game {

    List<List<Card>> playersHands;
    Card upCard;
    int currentPlayerIndex;
    // Round currentRound;
    int[] players;
    int[] trickCount;
    int callingTeam;
    int startingPlayerIndex;
    Card[] currentTrick;
    List<Card> deck;
    Card.Suit trump;
    Scanner input = new Scanner(System.in); // Replace with websockets

    public Game(int[] players) {
        this.players = players;
    }

    public void runGame() {
        createDeck();
        startingPlayerIndex = (int) (Math.random() * 4);
        dealRound();
    }

    public void createDeck() {
        deck = new ArrayList<Card>(28);
        for (Card.Suit suit : Card.Suit.values()) {
            for (Card.Rank rank : Card.Rank.values()) {
                deck.add(new Card(suit, rank));
            }
        }
    }

    public void dealRound() {
        // Shuffle the deck, initalizing each player's hand and the up card
        shuffle();

        // display up card
        System.out.println(upCard.toString() + " is turned up");

        firstRound();

        // Give people the chance to choose any of the other 3 suits as trump, in the same order
        if (trump == null) {
            secondRound();
        }

        //No trump was named, redeal
        if (trump == null){
            System.out.println("No trump named, redealing");
            return;
        }
        
        //Play all 5 tricks in the round
        for(int i = 0; i<5; i++){
            startingPlayerIndex = playTrick(); //Play a trick, and the starting player of the next trick is the winner of the current trick
        }
    }

    public void firstRound() {
        // Give people the chance to order up the up card, starting with right of dealer
        // and moving clockwise
        int dealerIndex = (startingPlayerIndex+3)%4;
        for (int i = 0; i < 4; i++) {
            int playerIndex = (startingPlayerIndex + i) % 4;

            // Use websocket to ask playerIndex if they wish to pick up the card
            System.out.println("Player " + playerIndex + ", would you like " + dealerIndex + " to pick up " + upCard.toString());

            // Wait for response
            String response = input.nextLine();

            // Parse whether response is Yes or No
            if (response.equals("Yes")) {
                trump = upCard.getSuit();

                // Alert players that the trump has been named
                System.out.println("Player " + playerIndex + " has named " + trump + " as trump");

                // Dealer must pick up the card and choose a card to discard
                playersHands.get(dealerIndex).add(upCard);
                System.out.println("Discard one of your cards (respond with the index): " + playersHands.get(dealerIndex).toString());
                int discard = input.nextInt();
                playersHands.get(dealerIndex).remove(discard);
                System.out.println("Your new hand: " + playersHands.get(dealerIndex));
                break;
            }
        }
    }

    public void secondRound() {
        // Remove the up card's suit from consideration
        ArrayList<Card.Suit> options = new ArrayList<>(Arrays.asList(Card.Suit.values()));
        options.remove(upCard.getSuit());
        for (int i = 0; i < 4; i++) {
            int playerIndex = (startingPlayerIndex + i) % 4;

            // Use websocket to ask playerIndex if they would like to name trump
            System.out.println("Player " + playerIndex + ", would you name trump? Options are \"Pass\" or one of:"
                    + options.toString());

            // Wait for response
            String response = input.nextLine();

            // Parse response
            if (response.equals("Pass")) {
                continue;
            } else {
                // Set trump to what the player named, then end the loop
                try {
                    trump = Card.Suit.valueOf(response);
                    // Alert players that trump has been named
                    System.out.println("Player " + playerIndex + " has named " + trump + " as trump");
                    break;
                } catch (IllegalArgumentException e) { // This should not be needed after moving to websockets
                    System.out.println("Invalid suit, passing");
                }
            }
        }
    }

    public void shuffle() {
        Collections.shuffle(deck);

        playersHands = new ArrayList<>(4);

        // Each of the 4 players gets 5 cards
        for (int i = 0; i < 4; i++) {
            playersHands.add(deck.subList(5 * i, 5 * (i + 1)));

            // Use the websocket to send each player their hand
            System.out.print("Player " + i + "'s hand:");
            System.out.print(playersHands.get(i).toString() + "\n");
        }

        // The 21st card (index 20) gets turned upwards
        upCard = deck.get(20);
        // Remove the old trump
        trump = null;
    }

    public int playTrick() {
        for (int i = 0; i < 4; i++) {
            playCard(i + startingPlayerIndex); // give each player the chance to play their cards
        }
        int winner = scoreHand(); // determine who wins the trick
        for (int i = 0; i < 4; i++) {
            currentTrick[i] = null; // clear out the current trick
        }
        return 0;
    }

    public void playCard(int playerIndex) {
        // find valid cards
        // send valid cards to frontend, player chooses a card
        // remove card
    }

    public int scoreHand() {
        // using the trump and card ranks, determine who played the highest-ranking card
        return 0;
    }
}
