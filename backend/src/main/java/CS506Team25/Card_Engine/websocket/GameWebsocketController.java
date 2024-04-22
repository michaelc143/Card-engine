package CS506Team25.Card_Engine.websocket;

import CS506Team25.Card_Engine.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Controller
public class GameWebsocketController {

    private static Logger logger = LoggerFactory.getLogger(GameWebsocketController.class);

    /**
     * Message that is sent when player subscribes to an Euchre game.
     * @param gameID gameID you're joining
     * @return A JSON with information about the lobby
     * {
     *     "seat_{seat-number}": JSON
     *     {
     *         "player_id": Integer,
     *         "username": String,
     *         "ready_to_start": Boolean
     *     }
     * }
     */
    @SubscribeMapping("/games/euchre/{gameID}")
    @SendTo("/topic/games/euchre/{gameID}")
    public LobbyMessage handleSubscribingToEuchreGame(@DestinationVariable int gameID){
        Lobby lobby = GameManager.getLobby(gameID);
        Game game = GameManager.getGame(gameID);
        if (lobby != null){
            return new LobbyMessage(lobby);
        } else if (game != null){
            updateLobbyToGameInDB(gameID);
            return new GameMessage(game);
        }
        return null;
    }

    /**
     * @param gameID ID of current lobby
     * @param userID Voting user's ID
     * @return A JSON with information about the lobby
     * {
     *     "seat_{seat-number}": JSON
     *     {
     *         "player_id": Integer,
     *         "username": String,
     *         "ready_to_start": Boolean
     *     }
     * }
     */
    @MessageMapping("/games/euchre/{gameID}/vote-start")
    @SendTo("/topic/games/euchre/{gameID}")
    public LobbyMessage voteStart(@DestinationVariable int gameID, @Payload int userID){
        Lobby lobby = GameManager.getLobby(gameID);
        int result = lobby.changeVote(userID, true);
        if (result == 0){
            return new LobbyMessage(lobby);
        }
        else if (result == 1){
            updateLobbyToGameInDB(gameID);
            return new GameMessage(GameManager.getGame(lobby.gameID));
        }
        return null;
    }

    /**
     * @param gameID ID of current lobby
     * @param userID Voting user's ID
     * @return A JSON with information about the lobby
     * {
     *     "seat_{seat-number}": JSON
     *     {
     *         "player_id": Integer,
     *         "username": String,
     *         "ready_to_start": Boolean
     *     }
     * }
     */
    @MessageMapping("/games/euchre/{gameID}/vote-not-to-start")
    @SendTo("/topic/games/euchre/{gameID}")
    public LobbyMessage voteNotToStart(@DestinationVariable int gameID, int userID){
        Lobby lobby = GameManager.getLobby(gameID);
        if (lobby.changeVote(userID, false) >= 0){
            return new LobbyMessage(lobby);
        }
        return null;
    }

    @MessageMapping("/games/euchre/{gameID}/make-move")
    @SendTo("/topic/games/euchre/{gameID}")
    public GameMessage makeMove(@DestinationVariable int gameID, String move){
        Game game = GameManager.getGame(gameID);
        if (game == null){
            return null;
        }

        game.makeMove(move);

        return new GameMessage(game);
    }

    /**
     * Endpoint that privately sends a player their hand
     * @param gameID ID of current lobby
     * @param userID ID of player that is requesting hand
     * @return A JSON representing the players cards in with the rank and suit as the key and a boolean denoting if it's
     * playable as the value, else return null if game or player in game couldn't be found
     * {
     *     "{card-name}": Boolean
     * }
     */
    @MessageMapping("/games/euchre/{gameID}/request-hand")
    @SendToUser("/queue/{gameID}/hand")
    public ArrayList<Card> getHand(@DestinationVariable int gameID, int userID) {
        Game game = GameManager.getGame(gameID);
        if (game == null){
            return null;
        }

        Player[] players = game.players;

        for (Player player:
             players) {
            if (player.playerID == userID) {
                return player.hand;
            }
        }
        return null;
    }

    /**
     * Endpoint that privately sends a player their hand
     * @param gameID ID of current lobby
     * @param userID ID of player that is requesting hand
     * @return A JSON representing the players cards in with the rank and suit as the key and a boolean denoting if it's
     * playable as the value, else return null if game or player in game couldn't be found
     * {
     *     "{card-name}": Boolean
     * }
     */
    @MessageMapping("/games/euchre/{gameID}/request-playable-cards")
    @SendToUser("/queue/{gameID}/hand")
    public ArrayList<Card> getPlayableCards(@DestinationVariable int gameID, int userID) {
        Game game = GameManager.getGame(gameID);
        if (game == null){
            return null;
        }

        Player[] players = game.players;

        for (Player player:
                players) {
            if (player.playerID == userID) {
                return game.getValidCards(player.hand);
            }
        }
        return null;
    }

    /**
     * Handles any exceptions occurring here; sends the error message to the originating client
     */
    @MessageExceptionHandler
    @SendToUser(value = "/queue/games/euchre/errors", broadcast = false)
    public Map<String, String> handleException(Throwable exception) {
        logger.error("Error in game socket controller", exception);
        var response = new HashMap<String, String>();
        response.put("error", exception.getMessage());
        return response;
    }

    /**
     * Helper method to deal with the transition form lobby to game
     * @param gameID
     */
    private void updateLobbyToGameInDB(int gameID){
        try (Connection connection = ConnectToDataBase.connect();
             PreparedStatement insertStatement = connection.prepareStatement("UPDATE euchre_game SET game_status = ? WHERE game_id = ?")) {
            insertStatement.setString(1, "in_progress");
            insertStatement.setInt(2, gameID);
            int rowsInserted = insertStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Helper method to structure the JSON which will be returned by endpoints
     * @param message
     */

}
