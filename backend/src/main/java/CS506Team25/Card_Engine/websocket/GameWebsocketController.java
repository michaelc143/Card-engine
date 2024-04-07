package CS506Team25.Card_Engine.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class GameWebsocketController {
    @MessageMapping("/game/{id}/requestState")
    @SendTo("/topic/game/{id}")
    public String getGameData(String message) throws Exception {
        System.out.println("TEST");
        return "Hello, " + message + "!";
    }

    @MessageMapping("/game/{id}/requestHand")
    @SendToUser("/queue/response")
    public String getHand(String message) throws Exception {
        return "Hello, " + message + ", this is a private message!";
    }
}
