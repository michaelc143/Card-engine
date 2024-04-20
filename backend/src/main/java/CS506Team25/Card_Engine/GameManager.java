package CS506Team25.Card_Engine;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.LinkedHashMap;
import java.util.Set;

/**
 * Holds all instances of running games
 */
public class GameManager extends LinkedHashMap<Integer, Game> {
  private static LinkedHashMap<Integer, Lobby> liveLobbies = new LinkedHashMap<>();
  private static LinkedHashMap<Integer, Game> liveGames = new LinkedHashMap<>();

  public static Lobby getLobby(int gameID){
    return liveLobbies.get(gameID);
  }

  public static Game getGame(int gameID){
    return liveGames.get(gameID);
  }

  public static void putLobby(int gameID){
    liveLobbies.put(gameID, new Lobby(gameID));
  }

  public static void putLobby(int gameID, Player[] players){
    liveLobbies.put(gameID, new Lobby(gameID, players));
  }

  public static ObjectNode getAllLobbies(){
    ObjectMapper objectMapper = new ObjectMapper();
    ObjectNode json = objectMapper.createObjectNode();
    Set<Integer> keys = liveLobbies.keySet();
    for (Integer gameID:
         keys) {
      json.set(gameID.toString(), liveLobbies.get(gameID).getLobbyInformation());
    }
    return json;
  }
  public static void startGame(int gameID, Player[] players){
    liveLobbies.remove(gameID);
    liveGames.put(gameID, new Game(gameID, players));
    System.out.println("Game started on backend");
    liveGames.get(gameID).start();

  }

}
