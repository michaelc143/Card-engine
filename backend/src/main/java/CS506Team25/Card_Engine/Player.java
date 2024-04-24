package CS506Team25.Card_Engine;

import java.util.*;

/**
 * Used to represent a player
 */
public class Player {
    // Player's user ID
    public int playerID;
    // Player's username
    public String username;
    // Whether the player has voted to start the game for lobby purposes
    public boolean readyToStart = false;
    // Number of cards in hand
    public int cardsInHand;
    // Cards in player's hand
    public ArrayList<Card> hand;

    public Player(int playerID, String username){
        this.playerID = playerID;
        this.username = username;
    }
}
