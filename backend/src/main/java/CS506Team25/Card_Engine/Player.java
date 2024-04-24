package CS506Team25.Card_Engine;

import java.util.*;

/**
 * Used to represent a player
 *          The JSON object has the following structure:
 *          {
 *              "playerID": Integer <player_id_1>,
 *              "username": String "<username_1>",
 *              "readyToStart": Boolean <ready_to_start_1>,
 *              "cardsInHand": Integer <cards_in_hand_1>,
 *              "hand": null
 *          }
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
    /**
     * Cards in player's hand, has the following format
     * [
     *     {
     *         "suit": String "<suit_1>",
     *         "rank": String "<rank_1>"
     *     },
     *     ...
     * ]
     */
    public ArrayList<Card> hand;

    public Player(int playerID, String username){
        this.playerID = playerID;
        this.username = username;
    }
}
