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
    public Card upCard;
    public Player currentPlayer;
    public int cardsInDeck;
    public ArrayList<Card> currentTrick;
    public Card.Suit trump;


    public GameMessage(Game game){
        this.status = Status.Game;
        this.id = game.gameID;
        this.upCard = game.upCard;
        this.currentPlayer = game.currentPlayer;
        this.cardsInDeck = game.getCardsInDeck();
        this.currentTrick = game.currentTrick;
        this.trump = game.trump;
        this.message = game.message_to_output.toString();
        deepCopyPlayers(game);
    }

    private void deepCopyPlayers(Game game){
        Player[] game_players = game.players;
        this.players = new Player[game_players.length];
        for (int i = 0; i < game_players.length; i++) {
            Player curPlayer = game_players[i];
            this.players[i] = new Player(curPlayer.playerID, curPlayer.username);
        }
        if (currentPlayer != null)
            currentPlayer = new Player(game.currentPlayer.playerID, game.currentPlayer.username);
    }

}
