package CS506Team25.Card_Engine.websocket;

import CS506Team25.Card_Engine.Game;

public class SendBotMove implements Runnable{
    private GameWebsocketController gameWebsocketController;
    private Game game;

    public void SendBotMove(GameWebsocketController gameWebsocketController, Game game) {
        this.gameWebsocketController = gameWebsocketController;
        this.game = game;
    }

    @Override
    public void run(){
        gameWebsocketController.sendBotMove(game);
    }
}
