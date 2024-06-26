package CS506Team25.Card_Engine.websocket;

import CS506Team25.Card_Engine.*;
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
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * API for websockets which allow live updates to multiple users
 */
@Controller
public class GameWebsocketController {

    @Autowired
    private SimpMessagingTemplate template;
    private static final Logger logger = LoggerFactory.getLogger(GameWebsocketController.class);

    /**
     * Message that is sent when player subscribes to an Euchre game.
     * @param gameID gameID you're joining
     * @return A JSON with information about the lobby if game isn't ready to start see {@link LobbyMessage} for format.
     * If game is ready to start returns a JSON with info about the game see {@link GameMessage} for format.
     * Otherwise, if the game couldn't be found
     */
    @SubscribeMapping("/games/euchre/{gameID}")
    @SendTo("/topic/games/euchre/{gameID}")
    public LobbyMessage handleSubscribingToEuchreGame(@DestinationVariable int gameID){
        Lobby lobby = GameManager.getLobby(gameID);
        Game game = GameManager.getGame(gameID);
        if (lobby != null){
            return new LobbyMessage(lobby);
        } else if (game != null){
            handleStartOfGame(gameID);
            return new GameMessage(game);
        }
        return null;
    }

    /**
     * @param gameID ID of current lobby
     * @param userID Voting user's ID
     * @return A JSON with information about the lobby if game isn't ready to start see {@link LobbyMessage} for format.
     * If game is ready to start returns a JSON with info about the game see {@link GameMessage} for format.
     * Otherwise, if the vote's unable to be changed return null
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
            handleStartOfGame(gameID);
            return new GameMessage(GameManager.getGame(lobby.gameID));
        }
        return null;
    }

    /**
     * @param gameID ID of current lobby
     * @param userID Voting user's ID
     * @return A JSON with information about the lobby if game isn't ready to start see {@link LobbyMessage} for format.
     * If game is ready to start returns a JSON with info about the game see {@link GameMessage} for format.
     * Otherwise, if the vote's unable to be changed return null
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

    /**
     * @param gameID ID of current game
     * @param userID ID of the user trying to make a move
     * @param move The move being made, see options in {@link GameMessage} to know which moves can be made
     * @return A JSON of the updated game state if move successfully made, see {@link GameMessage} for format
     * Otherwise if game could not be found or if move could not be made, return null
     */
    @MessageMapping("/games/euchre/{gameID}/{userID}/make-move")
    @SendTo("/topic/games/euchre/{gameID}")
    public GameMessage makeMove(@DestinationVariable int gameID, @DestinationVariable int userID, String move){
        Game game = GameManager.getGame(gameID);
        if (game == null){
            return null;
        }
        // Make the players move, if the move wasn't able to made return null
        if (!game.makeMove(move, userID)){
            return null;
        }

        // Let the game know it can resume now that it has input
        game.isWaitingForInput = false;

        // Wait until the game is waiting for input to send out a message
        waitUntilGameWantsInput(game);

        // If there's a winner then send a finished game state
        if (game.winningPlayers != null){
            updateGameToFinishedInDB(gameID);
            return new GameMessage().getFinishedGameMessage(game);
        }

        // Handle the case where the next turn is a bots turn
        if (game.botIsPlaying){
            BotMoveHandler botMoves = new BotMoveHandler(this, game);
            new Thread(botMoves).start();
        }

        return new GameMessage(game);
    }

    /**
     * Endpoint that privately sends a player their hand
     * @param gameID ID of current lobby
     * @param userID ID of player that is requesting hand
     * @return A JSON representing the players cards in hand, see {@link Player#hand} for format, coupled with a boolean value which is true if the card is currently playable
     * else return null if game or player in game couldn't be found
     */
    @MessageMapping("/games/euchre/{gameID}/{userID}/request-hand")
    @SendToUser("/queue/{gameID}/hand")
    public LinkedHashMap<Card, Boolean> getHand(@DestinationVariable int gameID, @DestinationVariable int userID) {
        Game game = GameManager.getGame(gameID);
        LinkedHashMap<Card, Boolean> hand = new LinkedHashMap<>();
        ArrayList<Card> cardsInHand = new ArrayList<>();
        if (game == null){
            return null;
        }

        // Find the player associated with the userID
        for (Player player : game.players){
            if (player.playerID == userID)
                cardsInHand = player.hand;
        }

        // If player couldn't be found or there's no cards in hand return null
        if (cardsInHand.isEmpty())
            return null;

        if (game.trump != null) {
            ArrayList<Card> validCards = game.getValidCards(cardsInHand);
            for (Card card : cardsInHand) {
                hand.put(card, validCards.contains(card));
            }
        } else {
            cardsInHand.forEach(card -> hand.put(card, false));
        }
        return hand;
    }

    /**
     * Internal message to handle when a bot is making a move
     * @param game The game the bot is in.
     */
    public void sendBotMove(Game game){
        game.isWaitingForInput = false;
        game.botIsPlaying = false;
        waitUntilGameWantsInput(game);
        if (game.winningPlayers != null) {
            updateGameToFinishedInDB(game.gameID);
            this.template.convertAndSend("/topic/games/euchre/" + game.gameID, new GameMessage().getFinishedGameMessage(game));
        } else {
            this.template.convertAndSend("/topic/games/euchre/" + game.gameID, new GameMessage(game));
        }
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
     * @param gameID ID of the game to be updated in the DB
     */
    private void handleStartOfGame(int gameID){
        try (Connection connection = ConnectToDataBase.connect();
             PreparedStatement insertStatement = connection.prepareStatement("UPDATE euchre_game SET game_status = ? WHERE game_id = ?")) {
            insertStatement.setString(1, "in_progress");
            insertStatement.setInt(2, gameID);
            insertStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        Game game = GameManager.getGame(gameID);
        waitUntilGameWantsInput(game);
        if (game.botIsPlaying){
            BotMoveHandler botMoves = new BotMoveHandler(this, game);
            new Thread(botMoves).start();
        }
    }

    /**
     * Helper method to deal with the transition to a finished game
     * @param gameID ID of the game to be updated in the DB
     */
    private void updateGameToFinishedInDB(int gameID){
        try (Connection connection = ConnectToDataBase.connect();
             PreparedStatement insertStatement = connection.prepareStatement("UPDATE euchre_game SET game_status = ?, winner_1 = ?, winner_2 = ? WHERE game_id = ?")) {
            // Check to see if a bot won, if so we use an ID of 0 for them
            int winner1 = Math.max(GameManager.getGame(gameID).winningPlayers[0].playerID, 0);
            int winner2 = Math.max(GameManager.getGame(gameID).winningPlayers[1].playerID, 0);
            insertStatement.setString(1, "done");
            insertStatement.setInt(2, winner1);
            insertStatement.setInt(3, winner2);
            insertStatement.setInt(4, gameID);
            insertStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Helper method to make sure there isn't de-sync between a changing game and a sent out message
     * @param game the game that is to be waited on
     */
    public void waitUntilGameWantsInput(Game game){
        while (!game.isWaitingForInput){
            Thread.onSpinWait();
        }
    }

}
