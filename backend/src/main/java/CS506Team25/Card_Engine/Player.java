package CS506Team25.Card_Engine;

import java.util.*;

/**
 * Used to represent a player
 */
public class Player {
    //player's user ID
    public int playerID;
    //player's username
    public String username;
    //whether the player has voted to start the game for lobby purposes
    public boolean readyToStart = false;
    //players current score
    public int score = 0;
    //Cards in player's hand
    public ArrayList<Card> hand;

    public Player(int playerID, String username){
        this.playerID = playerID;
        this.username = username;
    }
}
