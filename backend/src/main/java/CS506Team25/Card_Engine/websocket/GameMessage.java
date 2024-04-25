package CS506Team25.Card_Engine.websocket;

import CS506Team25.Card_Engine.Card;
import CS506Team25.Card_Engine.Game;
import CS506Team25.Card_Engine.Player;

import java.util.ArrayList;

/**
 * Used to represent a game's data for API purposes
 *         The JSON object has the following structure:
 *         {
 *             "id": Integer <game_id>,
 *             "status": String <game_status>,
 *             "players": [
 *                 {
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
 *             ],
 *             "upCard": String "<up_card>",
 *             "currentPlayer": {
 *                 "playerID": Integer <current_player_id>,
 *                 "username": String "<current_username>",
 *                 "readyToStart": Boolean <current_ready_to_start>,
 *                 "cardsInHand": Integer <current_cards_in_hand>,
 *                 "hand": NULL
 *             },
 *             "cardsInDeck": Integer <cards_in_deck>,
 *             "currentTrick": ArrayList <current_trick>,
 *             "trump": String <trump>,
 *             "options": [String "<option_1>", String "<option_2>", ...],
 *             "message": String "<game_message>",
 *             "most_recent_move": String "<most_recent_move>"
 *         }
 */
public class GameMessage extends LobbyMessage{
    public String upCard;
    public Player currentPlayer;
    public int cardsInDeck;
    public ArrayList<Card> currentTrick;
    public String trump;
    public String[] options;
    public String message;
    public String moveMade;
    public String phase;


    public GameMessage(Game game){
        this.status = Status.Game.name();
        this.id = game.gameID;
        if (game.upCard != null)
            this.upCard = game.upCard.toString();
        if (game.currentTrick != null)
            this.currentTrick = game.currentTrick;
        if (game.trump != null)
            this.trump = game.trump.name();
        if (game.messageToOutput != null)
            this.message = game.messageToOutput.toString();
        this.cardsInDeck = game.getCardsInDeck();
        this.options = game.optionsForPlayer.clone();
        this.moveMade = game.mostRecentMove;
        this.phase = game.currentPhase.name();
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
