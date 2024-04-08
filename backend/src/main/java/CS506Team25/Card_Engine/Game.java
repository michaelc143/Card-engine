package CS506Team25.Card_Engine;

import java.util.*;

public class Game {

    // The 2d array containing the 4 players' hands of 5 cards each
    ArrayList<ArrayList<Card>> playerHands;
    // The card that is turned up in the first round of bidding
    Card upCard;
    // An array of playerIDs that will be used to manage websockets
    int[] players;
    // The number of tricks each player has taken in the current round
    int[] trickCount;
    // The running score for each team, once someone reaches 10, they win the game
    int[] scores;
    // The team who called trump for the current round
    int callingTeam;
    // The player who leads for the current trick
    int startingPlayerIndex;
    // The player who dealt the current round
    int dealerIndex;
    // The cards that have been played in the current trick
    ArrayList<Card> currentTrick;
    // The whole Euchre deck of 28 cards
    ArrayList<Card> deck;
    // The suit named trump in the current round
    Card.Suit trump;
    // The suit led with in the current trick
    Card.Suit ledSuit;
    // Input for command-line interface which will be replaced with websockets
    Scanner input = new Scanner(System.in);

    /**
     * Creates a new game object
     * 
     * @param players used to pass in the websockets (may need to add another param
     *                for the game ID)
     * 
     */
    public Game(int[] players) {
        this.players = players;
    }

    /**
     * Runs a game of Euchre
     * 
     * @return the winning team (0 for players with indexes 0 and 2, 1 for players 1
     *         and 3)
     */
    public int runGame() {
        createDeck();
        // Set a random player to start
        startingPlayerIndex = (int) (Math.random() * 4);
        // Initalize the scores
        scores = new int[2];
        // Deal rounds until a team wins
        while (scores[0] < 10 && scores[1] < 10) {
            dealRound();
        }
        // Return the winning team
        if (scores[0] >= 10) {
            System.out.println("Team 0 wins");
            return 0;
        } else {
            System.out.println("Team 1 wins");
            return 1;
        }
    }

    /**
     * Initalizes the deck of cards that will be used for the game
     */
    public void createDeck() {
        deck = new ArrayList<Card>(28);
        for (Card.Suit suit : Card.Suit.values()) {
            for (Card.Rank rank : Card.Rank.values()) {
                deck.add(new Card(suit, rank));
            }
        }
    }

    /**
     * Handles an entire round of a Euchre game, from shuffling the deck to
     * assigning score
     */
    public void dealRound() {
        // Shuffle the deck, initalizing each player's hand and the up card
        shuffle();

        // display up card
        System.out.println(upCard.toString() + " is turned up");

        firstBiddingRound();

        // Give people the chance to choose any of the other 3 suits as trump, in the
        // same order
        if (trump == null) {
            secondBiddingRound();
        }

        // No trump was named, redeal
        if (trump == null) {
            System.out.println("No trump named, redealing");
            return;
        }

        // The person to the left of the dealer starts the first trick
        startingPlayerIndex = (dealerIndex + 1) % 4;

        // Play all 5 tricks in the round
        for (int i = 0; i < 5; i++) {
            // Play a trick, and the starting player of the next trick is the winner of the
            // current trick
            startingPlayerIndex = playTrick();
        }

        scoreRound();
        System.out.println("New scores: [" + scores[0] + ", " + scores[1] + "]");

        // Rotate the dealer to the left
        dealerIndex = (dealerIndex + 1) % 4;
    }

    /**
     * Handles the first round of bidding where players can choose whether to order
     * up/pick up the up card
     */
    public void firstBiddingRound() {
        // Give people the chance to order up the up card, starting with left of dealer
        // and moving clockwise

        for (int i = 1; i < 5; i++) {
            int playerIndex = (dealerIndex + i) % 4;

            // A player can only pick up or order up the card if they have one of that suit
            // in their hand
            boolean canPickUp = false;
            for (Card card : playerHands.get(playerIndex)) {
                if (card.getSuit().equals(upCard.getSuit())) {
                    canPickUp = true;
                    break;
                }
            }
            if (canPickUp) {
                // Use websocket to ask playerIndex if they wish to pick up the card
                System.out.println(
                        "Player " + playerIndex + ", would you like player " + dealerIndex + " to pick up "
                                + upCard.toString() + "? 'Yes' or 'No'");
                // Wait for response
                String response = input.nextLine();

                // Parse whether response is Yes or No
                if (response.equals("Yes")) {
                    trump = upCard.getSuit();

                    // Alert players that the trump has been named
                    System.out.println("Player " + playerIndex + " has named " + trump + " as trump");

                    // Set the calling team
                    callingTeam = playerIndex % 2;

                    // Dealer must pick up the card and choose a card to discard
                    playerHands.get(dealerIndex).add(upCard);
                    System.out.println("Player " + dealerIndex + ", discard one of your cards (respond with the index): "
                            + playerHands.get(dealerIndex).toString());
                    int discard = Integer.parseInt(input.nextLine());
                    playerHands.get(dealerIndex).remove(discard);
                    System.out.println("Your new hand: " + playerHands.get(dealerIndex));
                    break;
                }
            }else{
                System.out.println("Player " + playerIndex + ", you cannot pick up this card");
            }
            
        }
    }

    /**
     * Handles the second round of bidding where players can name any suit except
     * for the rejected up card's suit as trump
     */
    public void secondBiddingRound() {
        
        for (int i = 1; i < 5; i++) {
            int playerIndex = (dealerIndex + i) % 4;
            
            // The player can name any suit they have in their hand except for the suit of the rejected up card
            ArrayList<Card.Suit> options = new ArrayList<>();
            for (Card card : playerHands.get(playerIndex)) {
                if(!options.contains(card.getSuit())){
                    options.add(card.getSuit());
                }
            }
            options.remove(upCard.getSuit());
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

                    // Set the calling team
                    callingTeam = playerIndex % 2;

                    break;
                } catch (IllegalArgumentException e) { // This should not be needed after moving to websockets
                    System.out.println("Invalid suit, passing");
                }
            }
        }
    }

    /**
     * Shuffles the deck, randomizing it and assigning cards to each player's hand
     * and the up card
     */
    public void shuffle() {
        Collections.shuffle(deck);

        // initalize hand-level data structures
        playerHands = new ArrayList<>(4);
        trickCount = new int[2];

        // Each of the 4 players gets 5 cards
        for (int i = 0; i < 4; i++) {
            ArrayList<Card> hand = new ArrayList<>(deck.subList(5 * i, 5 * (i + 1)));
            playerHands.add(hand);

            // Use the websocket to send each player their hand
            System.out.print("Player " + i + "'s hand:");
            System.out.print(playerHands.get(i).toString() + "\n");
        }

        // The 21st card (index 20) gets turned upwards
        upCard = deck.get(20);
        // Remove the old trump
        trump = null;
    }

    /**
     * Plays a trick of a round of Euchre, allowing each player to play their cards
     * in order and determining who won the trick
     * 
     * @return the index of the player who won the trick
     */
    public int playTrick() {
        currentTrick = new ArrayList<Card>(4);
        for (int i = 0; i < 4; i++) {
            // give each player the chance to play their cards
            playCard((i + startingPlayerIndex) % 4);
        }
        // determine who wins the trick
        int winnerIndex = (startingPlayerIndex + scoreHand()) % 4;

        // Add a trick won to the winning team
        trickCount[winnerIndex % 2]++;

        // Alert users who won the trick
        System.out.println(
                "Player " + winnerIndex + " won with " + currentTrick.get((4 + winnerIndex - startingPlayerIndex) % 4));
        return winnerIndex; // return the index of the player who won the trick
    }

    /**
     * Allows a player to play a valid card
     * 
     * @param playerIndex the player who will play the card
     */
    public void playCard(int playerIndex) {
        ArrayList<Card> validCards;
        ArrayList<Card> hand = playerHands.get(playerIndex);
        // The first player can play any card
        if (playerIndex == startingPlayerIndex) {
            validCards = hand;
        } else {
            // Players after the first must follow suit if possible
            validCards = getValidCards(hand);
        }
        // send valid cards to frontend
        System.out.println(
                "Player " + playerIndex + ", play one of these cards (respond with index): " + validCards.toString());

        // Let the player choose their card
        Card playedCard = validCards.get(Integer.parseInt(input.nextLine()));

        // If the player led, update the ledSuit to enforce following suit
        if (playerIndex == startingPlayerIndex) {
            ledSuit = playedCard.getSuit(trump);
        }
        // remove played card from hand
        hand.remove(playedCard);
        System.out.println("You played " + playedCard.toString() + ". Your new hand is: " + hand.toString());
        currentTrick.add(playedCard);
    }

    /**
     * Helper method to determine which cards in a hand can be played
     * 
     * @param hand the hand of cards to select from
     * @return the subset of cards which are eligible to be played
     */
    private ArrayList<Card> getValidCards(ArrayList<Card> hand) {

        // Check to see if the player can follow suit
        boolean canFollowSuit = false;
        for (Card card : hand) {
            if (card.getSuit(trump).equals(ledSuit)) {
                canFollowSuit = true;
                break;
            }
        }

        // If the player cannot follow suit, all cards are valid
        if (!canFollowSuit) {
            return hand;
        }

        // If the player has cards of the led suit, they must play one of them
        ArrayList<Card> validCards = new ArrayList<>();
        for (Card card : hand) {
            if (card.getSuit(trump).equals(ledSuit)) {
                validCards.add(card);
            }
        }
        return validCards;
    }

    /**
     * Determines which of the 4 cards played in a trick wins
     * 
     * @return the index of the winning card (in play order) in the trick
     */
    public int scoreHand() {
        // using the trump and card ranks, determine who played the highest-ranking card
        int winningCardIndex = 0;
        // The winner of the hand is:
        // a) the person who played the highest trump
        // Or b) the person who played the highest card of the led suit if no trump were
        // played

        // Check to see if any of the 3 other players can beat the leader
        for (int i = 1; i < 4; i++) {
            // The only cards that can beat a card are a higher card of the led suit or a
            // trump
            Card card = currentTrick.get(i);
            if (card.getSuit(trump).equals(ledSuit) || card.isTrump(trump)) {
                if (card.getRanking(trump) > currentTrick.get(winningCardIndex).getRanking(trump)) {
                    winningCardIndex = i;
                }
            }
        }
        return winningCardIndex;
    }

    /**
     * Scores the round based on the values stored in callingTeam and trickCount
     */
    public void scoreRound() {
        if (trickCount[callingTeam] < 3) {
            // Calling team got euchred, add 2 points to the other team
            scores[(callingTeam + 1)] += 2;
            System.out.println("Team " + callingTeam + " got euchred, opposing team gets 2 points");
        } else if (trickCount[callingTeam] < 5) {
            // Calling team took 3-4 tricks, and get 1 point
            scores[callingTeam] += 1;
            System.out.println("Team " + callingTeam + " took " + trickCount[callingTeam] + " tricks, and get 1 point");
        } else {
            // Calling team took all tricks, and get 2 points
            scores[callingTeam] += 2;
            System.out.println("Team " + callingTeam + " took all tricks, and get 2 points");
        }
    }
}
