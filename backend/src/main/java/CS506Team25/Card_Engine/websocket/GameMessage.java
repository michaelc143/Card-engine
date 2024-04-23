package CS506Team25.Card_Engine.websocket;

import CS506Team25.Card_Engine.Card;
import CS506Team25.Card_Engine.Game;
import CS506Team25.Card_Engine.Player;

import java.util.ArrayList;

/**
 * Used to represent a game's data for API purposes
 */
public class GameMessage extends LobbyMessage{
    public String message;
    public String upCard;
    public Player currentPlayer;
    public int cardsInDeck;
    public ArrayList<Card> currentTrick;
    public String trump;
    public ArrayList<String> options;


    public GameMessage(Game game){
        this.status = Status.Game.name();
        this.id = game.gameID;
        if (game.upCard != null)
            this.upCard = game.upCard.toString();
        if (game.currentTrick != null)
            this.currentTrick = game.currentTrick;
        if (game.trump != null && game.trump.name() != null)
            this.trump = game.trump.name();
        if (game.message_to_output != null)
            this.message = game.message_to_output.toString();
        this.cardsInDeck = game.getCardsInDeck();
        this.options = new ArrayList<>(game.options);
        deepCopyPlayers(game);
    }

    private void deepCopyPlayers(Game game){
        Player[] game_players = game.players;
        this.players = new Player[game_players.length];
        for (int i = 0; i < game_players.length; i++) {
            Player curPlayer = game_players[i];
            this.players[i] = new Player(curPlayer.playerID, curPlayer.username);
            this.players[i].cardsInHand = curPlayer.hand.size();
        }
        if (game.currentPlayer != null)
            currentPlayer = new Player(game.currentPlayer.playerID, game.currentPlayer.username);
    }

}
