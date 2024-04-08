package CS506Team25.Card_Engine;

public class Lobby {
    int gameID;
    int votes = 0; //Total number of votes to start
    int[] scores;
    int[] playerArr = new int[4];

    /**
     * Creates a new lobby on the backend
     * @param gameID game ID of the Lobby to be created
     */
    public Lobby(int gameID){
        this.gameID = gameID;
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
     * @param seat the number of the seat they will be at 1-4
     * @return 0 if successful
     */
    public int joinLobby(int playerID, int seat){
        if (playerArr[seat] == 0){
            playerArr[seat] = playerID;
        } else {
            throw new IllegalArgumentException("Player could not be assigned to seat " + seat);
        }

        if (getPlayerCount() >= 4)
            createGame();
        return 0;
    }

    /**
     * Handles logic for voting to start a game
     */
    public void voteToStart(int playerID){
        for (int i = 0; i < 4; i++){
            if (playerArr[i] == playerID){
                votes++;
                break;
            }
        }
        if (getPlayerCount() <= votes){
            createGame();
        }
    }

    /**
     * @return Amount of players in lobby
     */
    private int getPlayerCount(){
        int playerCount = 0;
        for (int i = 0; i < 4; i++){
            if (playerArr[i] > 0)
                playerCount++;
        }
        return playerCount;
    }

    /**
     * Deletes lobby and creates new game with current players
     */
    private void createGame(){
        GameManager.startGame(gameID, playerArr);
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
