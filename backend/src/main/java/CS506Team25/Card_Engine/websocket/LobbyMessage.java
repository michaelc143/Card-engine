package CS506Team25.Card_Engine.websocket;

import CS506Team25.Card_Engine.Card;
import CS506Team25.Card_Engine.Game;
import CS506Team25.Card_Engine.Lobby;
import CS506Team25.Card_Engine.Player;

/**
 * Used to represent a lobbies data for API purposes
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
