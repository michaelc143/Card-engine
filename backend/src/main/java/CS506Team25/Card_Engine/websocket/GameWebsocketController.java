package CS506Team25.Card_Engine.websocket;

import CS506Team25.Card_Engine.ConnectToDataBase;
import CS506Team25.Card_Engine.Game;
import CS506Team25.Card_Engine.GameManager;
import CS506Team25.Card_Engine.Lobby;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Controller
public class GameWebsocketController {

    private static final String url = "jdbc:mysql://localhost:53306/full_house_badger";
    private final String databaseUsername = "root";
    private final String password = "lucky_badger";

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
    @SubscribeMapping("/topic/games/euchre/{gameID}")
    public ObjectNode handleSubscribingToEuchreGame(@DestinationVariable int gameID){
        Lobby lobby = GameManager.getLobby(gameID);
        Game game = GameManager.getGame(gameID);
        if (lobby != null){
            return lobby.getLobbyInformation();
        } else if (game != null){
            //TODO return a JSON of game info
            return null;
        }
        return null;
    }

    /**
     * TODO: Implement
     * Endpoint that sends a games status to a specific game
     * @param message
     * @return
     */
    @MessageMapping("/games/euchre/{gameID}/request-state")
    @SendTo("/topic/games/euchre/{gameID}")
    public String getGameData(String message) {
        return "Hello, " + message + "!";
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
    public ObjectNode voteStart(@DestinationVariable int gameID, @Payload int userID){
        Lobby lobby = GameManager.getLobby(gameID);
        if (lobby.changeVote(userID, true)){
            return lobby.getLobbyInformation();
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
    public ObjectNode voteNotToStart(@DestinationVariable int gameID, int userID){
        Lobby lobby = GameManager.getLobby(gameID);
        if (lobby.changeVote(userID, false)){
            return lobby.getLobbyInformation();
        }
        return null;
    }

    /**
     * Endpoint to subscribe to get notified when a lobby starts game
     * @param gameID
     * @return JSON describing table arrangement
     */
    @SendTo("/topic/games/euchre/{gameID}/game-started")
    public static String startGame(@DestinationVariable int gameID){
        try (Connection connection = ConnectToDataBase.connect();
             PreparedStatement insertStatement = connection.prepareStatement("UPDATE euchre_game SET game_status = ? WHERE game_id = ?")) {

            insertStatement.setString(1, "in_progress");
            insertStatement.setInt(2, gameID);
            int rowsInserted = insertStatement.executeUpdate();
            if (rowsInserted > 0) {
                return "Game has started";
            } else {
                return null;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * TODO: Implement
     * Endpoint that privately sends a player their hand
     * @param message
     * @return
     */
    @MessageMapping("/games/{gameID}/request-hand")
    @SendToUser("/queue/{gameID}/hand")
    public String getHand(String message) {
        return "Hello, " + message + ", this is a private message!";
    }

    /**
     * Handles any exceptions occurring here; sends the error message to the originating client
     */
    @MessageExceptionHandler
    @SendToUser(value = "/queue/game/errors", broadcast = false)
    public Map<String, String> handleException(Throwable exception) {
        logger.error("Error in game socket controller", exception);
        var response = new HashMap<String, String>();
        response.put("error", exception.getMessage());
        return response;
    }

}
