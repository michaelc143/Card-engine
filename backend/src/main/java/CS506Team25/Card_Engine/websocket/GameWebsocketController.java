package CS506Team25.Card_Engine.websocket;

import CS506Team25.Card_Engine.Game;
import CS506Team25.Card_Engine.GameManager;
import CS506Team25.Card_Engine.Lobby;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

@Controller
public class GameWebsocketController {



    /**
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
    public ObjectNode voteStart(@DestinationVariable int gameID, int userID){
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
     * TODO: Implement
     * Endpoint that privately sends a player their hand
     * @param message
     * @return
     */
    @MessageMapping("/games/{gameID}/request-hand")
    @SendToUser("/queue/response")
    public String getHand(String message) {
        return "Hello, " + message + ", this is a private message!";
    }
}
