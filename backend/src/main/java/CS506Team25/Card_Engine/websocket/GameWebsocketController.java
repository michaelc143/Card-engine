package CS506Team25.Card_Engine.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
public class GameWebsocketController {
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
    public String queueUp(){
        return "Successfully voted to start";
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