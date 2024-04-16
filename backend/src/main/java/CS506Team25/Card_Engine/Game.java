package CS506Team25.Card_Engine;

import java.util.*;

public class Game {
    // This game's ID in the database
    public int gameID;
    // The card that is turned up in the first round of bidding
    Card upCard;
    // An array players that holds info about hands
    public Player[] players;
    // The number of tricks each player has taken in the current round
    int[] trickCount;
    // The running score for each team, once someone reaches 10, they win the game
    public int[] scores;
    // The team who called trump for the current round
    public int callingTeam;
    // The player who leads for the current trick
    public int startingPlayerIndex;
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
    // The index of the player going alone, or -1 if nobody is going alone
    int lonerIndex;

    /**
     * Creates a new game object
     * 
     * @param players used to pass in the websockets (may need to add another param
     *                for the game ID)
     * 
     */
    public Game(int gameID, Player[] players) {
        this.gameID = gameID;
        this.players = players;
        //TODO: Implement bots instead of making fake players
        for (int seat = 0; seat < players.length; seat++) {
            if (players[seat] == null)
                players[seat] = new Player(-1, "BOT");
        }
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
            for (Card card : players[playerIndex].hand) {
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

                    chooseGoingAlone(playerIndex);

                    trump = upCard.getSuit();

                    // Alert players that the trump has been named
                    System.out.println("Player " + playerIndex + " has named " + trump + " as trump");

                    // Set the calling team
                    callingTeam = playerIndex % 2;

                    // Dealer must pick up the card and choose a card to discard
                    players[dealerIndex].hand.add(upCard);
                    System.out
                            .println("Player " + dealerIndex + ", discard one of your cards (respond with the index): "
                                    + players[dealerIndex].hand.toString());
                    int discard = Integer.parseInt(input.nextLine());
                    players[dealerIndex].hand.remove(discard);
                    System.out.println("Your new hand: " + players[dealerIndex].hand);
                    break;
                }
            } else {
                System.out.println("Player " + playerIndex + ", you cannot pick up/order up this card");
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

            // The player can name any suit they have in their hand except for the suit of
            // the rejected up card
            ArrayList<Card.Suit> options = new ArrayList<>();
            for (Card card : players[dealerIndex].hand) {
                if (!options.contains(card.getSuit())) {
                    options.add(card.getSuit());
                }
            }
            options.remove(upCard.getSuit());
            // Use websocket to ask playerIndex if they would like to name trump
            System.out
                    .println("Player " + playerIndex + ", would you like to name trump? Options are \"Pass\" or one of:"
                            + options.toString());

            // Wait for response
            String response = input.nextLine();

            // Parse response
            if (response.equals("Pass")) {
                continue;
            } else {
                // Set trump to what the player named, then end the loop
                try {
                    chooseGoingAlone(playerIndex);

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
     * Allows the player to choose whether they wish to go alone
     * @param playerIndex, the id of the player going alone
     */
    public void chooseGoingAlone(int playerIndex) {
        System.out.println("Player " + playerIndex + ", would you like to go alone? Options are 'Yes' or 'No'");
        String response = input.nextLine();
        if (response.equals("Yes")) {
            lonerIndex = playerIndex;
        }
        
        //This will probably need some way to be handled visually on the frontend
        System.out.println("Player " + (playerIndex+2)%4 + ", your partner has chosen to go alone, you cannot play this hand");
    }
    /**
     * Shuffles the deck, randomizing it and assigning cards to each player's hand
     * and the up card
     */
    public void shuffle() {
        Collections.shuffle(deck);

        // initalize hand-level data structures and variables
        trickCount = new int[2];
        lonerIndex = -1;
        trump = null;

        // Each of the 4 players gets 5 cards
        for (int i = 0; i < 4; i++) {
            ArrayList<Card> hand = new ArrayList<>(deck.subList(5 * i, 5 * (i + 1)));
            for (int seat = 0; seat < players.length; seat++) {
                players[seat].hand = hand;
            }

            // Use the websocket to send each player their hand
            System.out.print("Player " + i + "'s hand:");
            System.out.print(players[dealerIndex].hand.toString() + "\n");
        }

        // The 21st card (index 20) gets turned upwards
        upCard = deck.get(20);

    }

    /**
     * Plays a trick of a round of Euchre, allowing each player to play their cards
     * in order and determining who won the trick
     * 
     * @return the index of the player who won the trick
     */
    public int playTrick() {
        currentTrick = new ArrayList<Card>(4);
        //Clear the ledSuit
        ledSuit = null;
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
        if (playerIndex == (lonerIndex + 2) % 4) {
            // This player's partner is going alone, so the player cannot play any cards
            // this hand
            currentTrick.add(null);
            return;
        }
        ArrayList<Card> validCards;
        ArrayList<Card> hand = players[dealerIndex].hand;
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
        if (ledSuit == null) {
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
        int winningCardIndex;
        //If the first card 'played' was null, skip it
        if(currentTrick.get(0) == null){
            winningCardIndex = 1;
        }else{
            winningCardIndex = 0;
        }
        // The winner of the hand is:
        // a) the person who played the highest trump
        // Or b) the person who played the highest card of the led suit if no trump were
        // played

        // Check to see if any of the 3 other players can beat the leader
        for (int i = 1; i < 4; i++) {
            if(winningCardIndex == i){
                //Only happens if the first card 'played' was null
                continue;
            }
            // The only cards that can beat a card are a higher card of the led suit or a
            // trump
            Card card = currentTrick.get(i);
            if(card == null){
                //this 'card' was added as a result of a player being skipped due to their partner going alone, skip it
                continue;
            }
            if (card.getSuit(trump).equals(ledSuit) || card.isTrump(trump)) {
                if (card.getRanking(trump) > currentTrick.get(winningCardIndex).getRanking(trump)) {
                    winningCardIndex = i;
                }
            }
        }
        return winningCardIndex;
    }

    /**
     * Scores the round based on the values stored in callingTeam and trickCount, and updates the score array
     */
    public void scoreRound() {
        if (trickCount[callingTeam] < 3) {
            // Calling team got euchred, add 2 points to the other team
            scores[(callingTeam + 1)%2] += 2;
            System.out.println("Team " + callingTeam + " got euchred, opposing team gets 2 points");
        } else if (trickCount[callingTeam] < 5) {
            // Calling team took 3-4 tricks, and get 1 point
            scores[callingTeam] += 1;
            System.out.println("Team " + callingTeam + " took " + trickCount[callingTeam] + " tricks, and get 1 point");
        } else if(lonerIndex != -1){
            //Calling team took all tricks and went alone, and get 4 points
            scores[callingTeam] += 4;
            System.out.println("Team " + callingTeam + " went alone and took all tricks, and get 4 points");
        } else {
            // Calling team took all tricks, and get 2 points
            scores[callingTeam] += 2;
            System.out.println("Team " + callingTeam + " took all tricks, and get 2 points");
        }
    }
}
