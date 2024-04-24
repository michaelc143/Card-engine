package CS506Team25.Card_Engine.websocket;

import CS506Team25.Card_Engine.Card;
import CS506Team25.Card_Engine.Game;
import CS506Team25.Card_Engine.Lobby;
import CS506Team25.Card_Engine.Player;

/**
 * Used to represent a lobbies data for API purposes
 *         The JSON object has the following structure:
 *         {
 *             "id": Integer <game_id>,
 *             "status": String <game_status>,
 *             "players": [
 *                 {
 {
 *                     "playerID": Integer <player_id_1>,
 *                     "username": String "<username_1>",
 *                     "readyToStart": Boolean <ready_to_start_1>,
 *                     "cardsInHand": Integer <cards_in_hand_1>,
 *                     "hand": null
 *                 },
 *                 {
 *                     "playerID": Integer <player_id_2>,
 *                     "username": String "<username_2>",
 *                     "readyToStart": Boolean <ready_to_start_2>,
 *                     "cardsInHand": Integer <cards_in_hand_2>,
 *                     "hand": NULL
 *                 },
 *                 ...
 *             ]
 *         }
 */
public class LobbyMessage {
    //id of the game
    public int id;
    //at what point in its lifecycle a game is at
    public String status = Status.Lobby.name();
    //an array of players where position in array is seat #, null means a bot
    public Player[] players;

    public LobbyMessage(Lobby lobby){
        this.id = lobby.gameID;
        this.players = lobby.playerArr;
    }

    public LobbyMessage(){
    }

    public enum Status {
        Lobby,
        Game,
        Ended
    }
}
