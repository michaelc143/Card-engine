package CS506Team25.Card_Engine;

import CS506Team25.Card_Engine.websocket.GameWebsocketController;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.Arrays;

public class Lobby {
    int gameID;
    Player[] playerArr = new Player[4]; //Position in array represents position at table, if null then there's no player

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
     * Creates a new game of Euchre with the 4 players specified.
     * @param players: The array of player IDs (indexes 0 and 2 are in a team against indexes 1 and 3)
     */
    public int startGame(int[] players){
        System.out.println("Starting game");

        //Use the constructor to pass in websocket information
        Game game = new Game(players);
        int winningTeam = game.runGame();
        //handle game ending and updating database with winners and losers
        return 0;
    }

    /**
     * Assign player seat in lobby
     * @param playerID the ID of the player to join
     * @param seat the number of the seat they will be at 1-4 inclusive
     * @return 0 if successful
     */
    public int joinLobby(int playerID, String username, int seat){
        if (playerArr[seat] == null){
            playerArr[seat] = new Player(playerID, username);
        } else {
            throw new IllegalArgumentException("Player could not be assigned to seat " + seat);
        }

        if (getPlayerCount() >= 4)
            createGame();
        return 0;
    }

    /**
     * Sets a player in the lobbies status as ready to start
     * @param playerID id of the player voting to start the game
     * @param vote true when player wants to start the game, false otherwise
     * @return true if successful, false if player couldn't be found
     */
    public boolean changeVote(int playerID, boolean vote){
        for (int i = 0; i < 4; i++){
            if (playerArr[i] != null && playerArr[i].playerID == playerID){
                playerArr[i].readyToStart = vote;
                if (getPlayerCount() <= getVotesToStart()){
                    createGame();
                }
                return true;
            }
        }
        return false;
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
     *         "username": String,
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
        GameManager.startGame(gameID, Arrays.stream(playerArr)
                .mapToInt(player -> player != null ? player.playerID : 0)
                .toArray());
        GameWebsocketController.startGame(gameID);
    }

    /**
     * Main method for the command-line version of Euchre to test the game logic, will be replaced with websockets.
     * @param args no arguments should be given
     */
    public static void main(String[] args){
        Lobby lobby = new Lobby(0);
        int[] players = {1,2,3,4}; 
        lobby.startGame(players);
        
    }
}
