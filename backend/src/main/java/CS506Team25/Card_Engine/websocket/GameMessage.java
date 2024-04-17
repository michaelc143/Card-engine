package CS506Team25.Card_Engine.websocket;

import CS506Team25.Card_Engine.Game;
import CS506Team25.Card_Engine.Lobby;
import CS506Team25.Card_Engine.Player;

/**
 * Used to represent a game's data for API purposes
 */
public class GameMessage {
    //id of the game
    public int id;
    //at what point in its lifecycle a game is at
    public Status status;
    //an array of players where position in array is seat #, null means a bot
    public Player[] players;

    public GameMessage(Lobby lobby){
        this.status = Status.Lobby;
        this.id = lobby.gameID;
        this.players = lobby.playerArr;
    }

    public GameMessage(Game game){
        this.status = Status.Game;
        this.id = game.gameID;
        this.players = game.players;
    }
    public enum Status {
        Lobby,
        Game,
        Ended
    }
}
