package CS506Team25.Card_Engine;

import java.util.*;

public class Lobby {
    int id;
    int[] scores;
    /**
     * Creates a new game of Euchre with the 4 players specified.
     * @param players: The array of player IDs (indexes 0 and 2 are in a team against indexes 1 and 3)
     * @param gameId: The id of the particular game
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
     * Main method for the command-line version of Euchre to test the game logic, will be replaced with websockets.
     * @param args no arguments should be given
     */
    public static void main(String[] args){
        Lobby lobby = new Lobby();
        int[] players = {1,2,3,4}; 
        lobby.startGame(players);
        
    }
}
