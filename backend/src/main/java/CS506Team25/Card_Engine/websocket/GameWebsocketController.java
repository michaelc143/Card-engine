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

    @SubscribeMapping("/games/euchre/{gameID}")
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
    @MessageMapping("/games/euchre/{gameID}/requestState")
    @SendTo("/topic/games/euchre/{gameID}")
    public String getGameData(String message) {
        System.out.println("TEST");
        return "Hello, " + message + "!";
    }

    @MessageMapping("/games/euchre/{gameID}")
    @SendTo("/topic/games/euchre/{gameID}")
    public String queueUp(@DestinationVariable int gameID, int userID){
        if (GameManager.getLobby(gameID).voteToStart(userID)){
            return "Successfully voted to start";
        }
        return "Failed to vote to start for game:" + gameID + " and player: " + userID;
    }

    /**
     * TODO: Implement
     * Endpoint that privately sends a player their hand
     * @param message
     * @return
     */
    @MessageMapping("/game/{gameID}/requestHand")
    @SendToUser("/queue/response")
    public String getHand(String message) {
        return "Hello, " + message + ", this is a private message!";
    }
}
