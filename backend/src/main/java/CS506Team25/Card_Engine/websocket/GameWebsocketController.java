package CS506Team25.Card_Engine.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
public class GameWebsocketController {
    @MessageMapping("/game/{id}/requestState")
    @SendTo("/topic/game/{id}")
    public String getGameData(String message) {
        System.out.println("TEST");
        return "Hello, " + message + "!";
    }

    @MessageMapping("/game/{id}/requestHand")
    @SendToUser("/queue/response")
    public String getHand(String message) {
        return "Hello, " + message + ", this is a private message!";
    }
}
