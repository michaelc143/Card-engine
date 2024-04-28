package CS506Team25.Card_Engine.websocket;

import CS506Team25.Card_Engine.Game;

public class BotMoveHandler implements Runnable{
    private final GameWebsocketController gameWebsocketController;
    private final Game game;

    public BotMoveHandler(GameWebsocketController gameWebsocketController, Game game) {
        this.gameWebsocketController = gameWebsocketController;
        this.game = game;
    }

    @Override
    public void run(){
        while (game.botIsPlaying) {
            // Add a delay so that bots don't instantly make moves
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            gameWebsocketController.sendBotMove(game);
        }
    }
}
