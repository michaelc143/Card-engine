package CS506Team25.Card_Engine;

import CS506Team25.Card_Engine.websocket.GameWebsocketController;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.Arrays;

public class Lobby {
    public int gameID;
    public Player[] playerArr = new Player[4]; //Position in array represents position at table, if null then there's no player

    /**
     * Creates a new lobby on the backend
     * @param gameID game ID of the Lobby to be created
     */
    public Lobby(int gameID){
        this.gameID = gameID;
    }

    /**
     * Creates a new lobby on the backend
     * @param gameID game ID of the Lobby to be created
     * @param playerArr players in Lobby
     */
    public Lobby(int gameID, Player[] playerArr){
        this.gameID = gameID;
        this.playerArr = playerArr;
    }

    /**
     * Assign player seat in lobby
     * @param playerID the ID of the player to join
     * @param seat the number of the seat they will be at 1-4 inclusive
     * @return 0 if successfully assigned seat, 1 if seat successfully assigned seat and game started
     */
    public int joinLobby(int playerID, String username, int seat){
        if (playerArr[seat-1] == null){
            playerArr[seat-1] = new Player(playerID, username);
        } else {
            throw new IllegalArgumentException("Player could not be assigned to seat " + seat);
        }

        if (getPlayerCount() >= 4) {
            createGame();
            return 1;
        }
        return 0;
    }

    /**
     * Sets a player in the lobbies status as ready to start
     * @param playerID id of the player voting to start the game
     * @param vote true when player wants to start the game, false otherwise
     * @return 0 if successfully changed vote, 1 if seat successfully assigned seat and game started
     */
    public int changeVote(int playerID, boolean vote){
        for (int i = 0; i < 4; i++){
            if (playerArr[i] != null && playerArr[i].playerID == playerID){
                playerArr[i].readyToStart = vote;
                if (getPlayerCount() <= getVotesToStart()){
                    createGame();
                    return 1;
                }
                return 0;
            }
        }
        return -1;
    }

    /**
     * @return An array with each player in the lobby. If an index is null then there's no player at that seat.
     */
    public Player[] getPlayers(){
        return playerArr;
    }

    /**
     * @return Number of players in lobby 0-4 inclusive
     */
    private int getPlayerCount(){
        int playerCount = 0;
        for (int i = 0; i < 4; i++){
            if (playerArr[i] != null)
                playerCount++;
        }
        return playerCount;
    }

    /**
     * @return Number of players in lobby who have voted to start
     */
    private int getVotesToStart(){
        int votesToStart = 0;
        for (int i = 0; i < 4; i++){
            if (playerArr[i] != null && playerArr[i].readyToStart)
                votesToStart++;
        }
        return votesToStart;
    }

    /**
     * @return A JSON with the lobbies attributes
     * {
     *     "seat_{seat-number}": JSON
     *     {
     *         "player_id": Integer,
     *         "ready_to_start": Boolean
     *     }
     * }
     */
    public ObjectNode getLobbyInformation(){
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode json = objectMapper.createObjectNode();
        json.put("game_id", gameID);
        for (int i = 0; i < playerArr.length; i++) {
            ObjectNode player = objectMapper.createObjectNode();
            if (playerArr[i] != null) {
                player.put("player_id", playerArr[i].playerID);
                player.put("ready_to_start", playerArr[i].readyToStart);
            }
            json.set("seat_" + (i + 1), player);
        }
        return json;
    }

    /**
     * Deletes lobby and creates new game with current players
     */
    private void createGame(){
        GameManager.startGame(gameID, playerArr);
    }
}
