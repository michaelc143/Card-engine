package CS506Team25.Card_Engine;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public class Game extends Thread{
    // Response from the user, game waits for this to be set when and then resets it to null
    private volatile String userResponse;
    // This game's ID in the database
    public int gameID;
    // The card that is turned up in the first round of bidding
    public Card upCard;
    // An array players that holds info about hands
    public Player[] players;
    // The player whose turn we're currently on
    public Player currentPlayer;
    // Used to build the outputs to players for debugging purposes
    public StringBuilder messageToOutput;
    // A list of inputs user can respond with
    public String[] optionsForPlayer;
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
    public ArrayList<Card> currentTrick;
    // The whole Euchre deck of 28 cards
    ArrayList<Card> deck;
    // The suit named trump in the current round
    public Card.Suit trump;
    // The suit led with in the current trick
    Card.Suit ledSuit;
    // The player going alone, or null if nobody is going alone
    Player lonerPlayer;
    // Used to handle race conditions with threading, program should be waiting when true
    public volatile boolean isWaitingForInput;
    // The most recent move made by a player
    public String mostRecentMove;
    // What phase the game currently is in
    public GamePhase currentPhase;

    private final Logger logger = LoggerFactory.getLogger(Game.class);


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
                players[seat] = new Player(-seat, "BOT_" + seat);
        }
    }

    /**
     * Runs a game of Euchre
     * 
     * @return the winning team (0 for players with indexes 0 and 2, 1 for players 1
     *         and 3)
     */
    public void run() {
        messageToOutput = new StringBuilder();
        isWaitingForInput = true;
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
            messageToOutput.append("Team 0 wins\n");
        } else {
            messageToOutput.append("Team 1 wins\n");
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
        messageToOutput.append(upCard.toString()).append(" is turned up\n");

        firstBiddingRound();

        // Give people the chance to choose any of the other 3 suits as trump, in the
        // same order
        if (trump == null) {
            secondBiddingRound();
        }

        // No trump was named, redeal
        if (trump == null) {
            messageToOutput.append("No trump named, redealing\n");
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
        messageToOutput.append("New scores: [").append(scores[0]).append(", ").append(scores[1]).append("]\n");

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
            currentPlayer = players[(dealerIndex + i) % 4];

            // A player can only pick up or order up the card if they have one of that suit
            // in their hand
            boolean canPickUp = false;
            for (Card card : currentPlayer.hand) {
                if (card.getSuit().equals(upCard.getSuit())) {
                    canPickUp = true;
                    break;
                }
            }
            if (canPickUp) {
                // Use websocket to ask playerIndex if they wish to pick up the card
                messageToOutput.append("Player ").append(currentPlayer.username).append(", would you like player ").append(players[dealerIndex].username).append(" to pick up ").append(upCard.toString()).append("? 'Yes' or 'No'\n");
                // Wait for response
                String response = getPlayerInput(GamePhase.AGREE_TO_TRUMP,
                    new String[] {"Yes", "No"});
                // Parse whether response is Yes or No
                if (response.equals("Yes")) {

                    chooseGoingAlone(currentPlayer);

                    trump = upCard.getSuit();

                    // Alert players that the trump has been named
                    messageToOutput.append("Player ").append(currentPlayer.username).append(" has named ").append(trump).append(" as trump\n");

                    // Set the calling team
                    callingTeam = ((dealerIndex + i) % 4) % 2;

                    // Dealer must pick up the card and choose a card to discard
                    players[dealerIndex].hand.add(upCard);
                    messageToOutput.append("Player ").append(players[dealerIndex].username).append(", discard one of your cards (respond with the index): ").append(players[dealerIndex].hand.toString()).append("\n");
                    int discard = Integer.parseInt(getPlayerInput(GamePhase.DISCARD_FOR_TRUMP, getIndexesOfCardsInHand()));
                    players[dealerIndex].hand.remove(discard);
                    break;
                }
            } else {
                messageToOutput.append("Player ").append(currentPlayer.username).append(", you cannot pick up/order up this card\n");
            }

        }
    }

    /**
     * Handles the second round of bidding where players can name any suit except
     * for the rejected up card's suit as trump
     */
    public void secondBiddingRound() {

        for (int i = 1; i < 5; i++) {
            currentPlayer = players[(dealerIndex + i) % 4];
            ArrayList<String> nameableSuits = new ArrayList<>();

            // The player can name any suit they have in their hand except for the suit of
            // the rejected up card
            for (Card card : currentPlayer.hand) {
                if (!nameableSuits.contains(card.getSuit().name())) {
                    nameableSuits.add(card.getSuit().name());
                }
            }
            nameableSuits.remove(upCard.getSuit().name());
            nameableSuits.add("Pass");

            // Use websocket to ask playerIndex if they would like to name trump
            messageToOutput.append("Player ").append(currentPlayer.username).append(", would you like to name trump? Options are \"Pass\" or one of:").append(
                nameableSuits).append("\n");

            // Wait for response
            String response = getPlayerInput(GamePhase.NAME_TRUMP, nameableSuits.toArray(new String[0]));

            // Parse response
            if (response.equals("Pass")) {
                continue;
            } else {
                // Set trump to what the player named, then end the loop
                try {
                    chooseGoingAlone(currentPlayer);

                    trump = Card.Suit.valueOf(response);
                    // Alert players that trump has been named
                    messageToOutput.append("Player ").append(currentPlayer.username).append(" has named ").append(trump).append(" as trump\n");

                    // Set the calling team
                    callingTeam = ((dealerIndex + i) % 4) % 2;

                    break;
                } catch (IllegalArgumentException e) { // This should not be needed after moving to websockets
                    messageToOutput.append("Invalid suit, passing\n");
                }
            }
        }
    }

    /**
     * Allows the player to choose whether they wish to go alone
     * @param player, the player going alone
     */
    public void chooseGoingAlone(Player player) {
        messageToOutput.append("Player ").append(player.username).append(", would you like to go alone? Options are 'Yes' or 'No'\n");
        String response = getPlayerInput(GamePhase.GO_ALONE,
            new String[] {"Yes", "No"});
        if (response.equals("Yes")) {
            lonerPlayer = player;
        }
        
        //This will probably need some way to be handled visually on the frontend
        messageToOutput
            .append("Player ").append(players[(Arrays.asList(players).indexOf(currentPlayer) + 2) % 4].username).append(", your partner has chosen to go alone, you cannot play this hand\n");
    }
    /**
     * Shuffles the deck, randomizing it and assigning cards to each player's hand
     * and the up card
     */
    public void shuffle() {
        Collections.shuffle(deck);

        // initalize hand-level data structures and variables
        trickCount = new int[2];
        lonerPlayer = null;
        trump = null;

        // Each of the 4 players gets 5 cards
        for (int i = 0; i < 4; i++) {
            players[i].hand = new ArrayList<>(deck.subList(5 * i, 5 * (i + 1)));

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
            playCard(players[(i + startingPlayerIndex) % 4]);
        }
        // determine who wins the trick
        int winnerIndex = (startingPlayerIndex + scoreHand()) % 4;

        // Add a trick won to the winning team
        trickCount[winnerIndex % 2]++;

        // Alert users who won the trick
        messageToOutput.append("Player ").append(players[winnerIndex].username).append(" won with ").append(currentTrick.get((4 + winnerIndex - startingPlayerIndex) % 4)).append("\n");
        return winnerIndex; // return the index of the player who won the trick
    }

    /**
     * Allows a player to play a valid card
     * 
     * @param player the player who will play the card
     */
    public void playCard(Player player) {
        if (player == players[(Arrays.asList(players).indexOf(lonerPlayer) + 2) % 4]) {
            // This player's partner is going alone, so the player cannot play any cards
            // this hand
            currentTrick.add(null);
            return;
        }
        ArrayList<Card> validCards;
        ArrayList<Card> hand = player.hand;
        // The first player can play any card
        if (player == players[startingPlayerIndex]) {
            validCards = hand;
        } else {
            // Players after the first must follow suit if possible
            validCards = getValidCards(hand);
        }
        // send valid cards to frontend
        messageToOutput.append("Player ").append(player.username).append(", play one of these cards (respond with index): ").append(validCards.toString()).append("\n");
        // Let the player choose their card
        Card playedCard = validCards.get(Integer.parseInt(getPlayerInput(GamePhase.PLAY_CARD, getIndexesOfCardsInHand())));

        // If the player led, update the ledSuit to enforce following suit
        if (ledSuit == null) {
            ledSuit = playedCard.getSuit(trump);
        }
        // remove played card from hand
        hand.remove(playedCard);
        messageToOutput.append("You played ").append(playedCard.toString()).append(". Your new hand is: ").append(hand).append("\n");
        currentTrick.add(playedCard);
    }

    /**
     * Helper method to determine which cards in a hand can be played
     * 
     * @param hand the hand of cards to select from
     * @return the subset of cards which are eligible to be played
     */
    public ArrayList<Card> getValidCards(ArrayList<Card> hand) {
        if (trump == null){
            logger.debug("Can't get playable cards due to trump not being set yet");
            return null;
        }

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
            messageToOutput.append("Team ").append(callingTeam).append(" got euchred, opposing team gets 2 points\n");
        } else if (trickCount[callingTeam] < 5) {
            // Calling team took 3-4 tricks, and get 1 point
            scores[callingTeam] += 1;
            messageToOutput.append("Team ").append(callingTeam).append(" took ").append(trickCount[callingTeam]).append(" tricks, and get 1 point\n");
        } else if(lonerPlayer != null){
            //Calling team took all tricks and went alone, and get 4 points
            scores[callingTeam] += 4;
            messageToOutput.append("Team ").append(callingTeam).append(" went alone and took all tricks, and get 4 points\n");
        } else {
            // Calling team took all tricks, and get 2 points
            scores[callingTeam] += 2;
            messageToOutput.append("Team ").append(callingTeam).append(" took all tricks, and get 2 points\n");
        }
    }

    /**
     * @param move The move to be made represented as a string
     * @param userID ID of the user making the move
     * @return true if successful, false otherwise
     */
    public boolean makeMove(String move, int userID){
        if (userID != currentPlayer.playerID){
            logger.debug("Player other then current player trying ot make a move");
            return false;
        }
        userResponse = move;
        return true;
    }

    /**
     * @return number of cards currently in the deck
     */
    public int getCardsInDeck(){
        return deck.size();
    }

    /**
     * Helper method to add a String array of the indexes of cards in hand
     * @return A string array of the indexes of the card starting from 0
     */
    private String[] getIndexesOfCardsInHand(){
        String[] numberedIndexes = new String[currentPlayer.hand.size()];
        for (int cardIndex = 0; cardIndex < currentPlayer.hand.size(); cardIndex++) {
            numberedIndexes[cardIndex] = String.valueOf(cardIndex);
        }
        return numberedIndexes;
    }

    /**
     * @param input the string value of the move player is trying to make
     */
    private void setMostRecentMove(String input){
        try {
            mostRecentMove = currentPlayer.hand.get(Integer.parseInt(input)).toString();

        } catch (NumberFormatException e) {
            mostRecentMove = input;
        }
    }

    /**
     * Handles when the code needs player input. Locks the thread until input is received via the websocket
     * @return The passed message
     */
    private String getPlayerInput(GamePhase newPhase, String[] newOptions){
        currentPhase = newPhase;
        optionsForPlayer = newOptions;

        isWaitingForInput = true;
        while (isWaitingForInput || userResponse == null) {
            Thread.onSpinWait();
        }
        setMostRecentMove(userResponse);
        String result = userResponse;
        userResponse = null;
        messageToOutput = new StringBuilder();
        return result;
    }

    public enum GamePhase {
        NAME_TRUMP,
        DISCARD_FOR_TRUMP,
        AGREE_TO_TRUMP,
        GO_ALONE,
        PLAY_CARD
    }
}
