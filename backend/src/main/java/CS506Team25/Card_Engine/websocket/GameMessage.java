package CS506Team25.Card_Engine.websocket;

import CS506Team25.Card_Engine.Card;
import CS506Team25.Card_Engine.Game;
import CS506Team25.Card_Engine.Lobby;
import CS506Team25.Card_Engine.Player;

/**
 * Used to represent a game's data for API purposes
 */
public class GameMessage extends LobbyMessage{
    public Card upCard;
    public Player currentPlayer;

    public GameMessage(Game game){
        this.status = Status.Game;
        this.id = game.gameID;
        this.players = game.players;
        this.upCard = game.upCard;

        hidePlayerHands();
    }

    private void hidePlayerHands(){
        for (Player player:
                players) {
            player.hand = null;
        }
    }
}
