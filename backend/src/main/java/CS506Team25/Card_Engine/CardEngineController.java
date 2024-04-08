package CS506Team25.Card_Engine;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.*;

import java.sql.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.StringWriter;
import java.io.PrintWriter;

@RestController
@CrossOrigin
public class CardEngineController {

    private final String url = "jdbc:mysql://localhost:53306/full_house_badger";
    private final String databaseUsername = "root";
    private final String password = "lucky_badger";

    @GetMapping("/")
    public String hello() {
        return "Hello World";
    }

    @PostMapping("/login")
    public String login(@RequestParam String username) {
        try (Connection connection = DriverManager.getConnection(url, databaseUsername, password);
             PreparedStatement statement = connection.prepareStatement("SELECT * FROM users WHERE user_name = ?")) {

            statement.setString(1, username);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return "Logged in";
                } else {
                    return "User does not exist";
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return "Error occurred connecting to server.";
        }
    }

    @PostMapping("/register")
    public String register(@RequestParam String username) {
        try (Connection connection = DriverManager.getConnection(url, databaseUsername, password);
             PreparedStatement statement = connection.prepareStatement("SELECT * FROM users WHERE user_name = ?")) {

            statement.setString(1, username);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return "User already exists";
                }
            }

            PreparedStatement insertStatement = connection.prepareStatement("INSERT INTO users (user_name) VALUES (?)");
            insertStatement.setString(1, username);
            int rowsInserted = insertStatement.executeUpdate();
            if (rowsInserted > 0) {
                return "User successfully registered";
            } else {
                return "Failed to register user";
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return "Error occurred connecting to server.";
        }
    }

    /**
     * Creates a game that players can join
     * @param gameName name that will be displayed in lobby
     * @param gamePassword optional argument, creates a password for the game
     * @return Newly created game's ID
     */
    @PostMapping("games/euchre/create-game")
    public String createGame(@RequestParam String gameName, @RequestParam(required = false) String gamePassword) {
        try (Connection connection = DriverManager.getConnection(url, databaseUsername, password);
             PreparedStatement insertStatement = connection.prepareStatement("INSERT INTO euchre_game VALUES (DEFAULT, ?, ?, ?, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT , DEFAULT )")) {

            insertStatement.setString(1, gameName);
            if (gamePassword != null){
                insertStatement.setBoolean(2, true);
                insertStatement.setString(3, gameName);
            } else {
                insertStatement.setBoolean(2, false);
                insertStatement.setNull(3, Types.VARCHAR);
            }
            int rowsInserted = insertStatement.executeUpdate();
            if (rowsInserted > 0) {
                PreparedStatement selectStatement = connection.prepareStatement("SELECT LAST_INSERT_ID()");
                ResultSet resultSet = selectStatement.executeQuery();
                resultSet.next();
                return Integer.toString(resultSet.getInt(1));
            } else {
                return "Game could not be created";
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return "Error occurred connecting to server.";
        }
    }

    /**
     * Allows a player to select their seat, is functionally how a player joins a game
     * @param id ID of game you're trying ot join
     * @param playerID your player ID
     * @param seatNumber which seat at the table you want to join 1-4
     * @return Response message
     */
    @PostMapping("games/euchre/{id}/select-seat")
    public String assignSeat(@PathVariable String id, int playerID, int seatNumber) {
        String playerSeat = "player" + seatNumber + "_id";
        try (Connection connection = DriverManager.getConnection(url, databaseUsername, password);
            PreparedStatement insertStatement = connection.prepareStatement("UPDATE euchre_game SET " + playerSeat + " = ? WHERE game_id = ?")) {

            insertStatement.setInt(1, playerID);
            insertStatement.setInt(2, Integer.valueOf(id));
            int rowsInserted = insertStatement.executeUpdate();
            if (rowsInserted > 0) {
                return "Successfully assigned to seat " + seatNumber;
            } else {
                return "Could not assign seat";
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return "Error occurred connecting to server.";
        }
    }

    /**
     * @return A JSON of all games that can be joined with key game name and values game id and number of players, null if an error occurs
     */
    @GetMapping("games/euchre/open-games")
    public ObjectNode getOpenGames() {
        try (Connection connection = DriverManager.getConnection(url, databaseUsername, password);
            PreparedStatement statement = connection.prepareStatement("SELECT game_id, game_name, player1_id, player2_id, player3_id, player4_id FROM euchre_game WHERE game_status = 'waiting_for_players'")) {

            ObjectMapper objectMapper = new ObjectMapper();
            ObjectNode json = objectMapper.createObjectNode();
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                ObjectNode game = objectMapper.createObjectNode();

                int players = 0;
                for (int x = 3; x < 7; x++){
                    if (resultSet.getInt(x) != 0){
                        players++;
                    }
                }
                game.put("game_id",resultSet.getInt(1));
                game.put("number_players", players);
                json.set(resultSet.getString(2), game);
            }
            return json;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Get information about a game
     * @param id game's id
     * @return JSON of all of a games attributes, note that player1 is seat 1 and so on
     */
    @GetMapping("/games/euchre/{id}")
    public ObjectNode getGameInfo(@PathVariable String id){
        try (Connection connection = DriverManager.getConnection(url, databaseUsername, password);
            PreparedStatement statement = connection.prepareStatement("SELECT * FROM euchre_game WHERE game_id = ?")) {

            ObjectMapper objectMapper = new ObjectMapper();
            ObjectNode json = objectMapper.createObjectNode();
            statement.setInt(1, Integer.parseInt(id));
            try (ResultSet resultSet = statement.executeQuery()) {
                resultSet.next();
                json.put("game_id", resultSet.getInt(1));
                json.put("game_name", resultSet.getString(2));
                json.put("player1_id", resultSet.getInt(3));
                json.put("player2_id", resultSet.getInt(4));
                json.put("player3_id", resultSet.getInt(5));
                json.put("player4_id", resultSet.getInt(6));
                json.set("player1_name", userIDToUsername(resultSet.getInt(3)));
                json.set("player2_name", userIDToUsername(resultSet.getInt(4)));
                json.set("player3_name", userIDToUsername(resultSet.getInt(5)));
                json.set("player4_name", userIDToUsername(resultSet.getInt(6)));
                json.put("game_status", resultSet.getString(7));
                json.put("winner_1", resultSet.getInt(8));
                json.put("winner_2", resultSet.getInt(9));
                json.put("creation_date", String.valueOf(resultSet.getDate(10)));
                return json;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Get information about a player
     * @param id player's id
     * @return JSON of player's id, username, and date joined
     */
    @GetMapping("/player/{id}")
    public ObjectNode getPlayerInfo(@PathVariable String id){
        try (Connection connection = DriverManager.getConnection(url, databaseUsername, password);
            PreparedStatement statement = connection.prepareStatement("SELECT * FROM users WHERE user_id = ?")) {

            ObjectMapper objectMapper = new ObjectMapper();
            ObjectNode json = objectMapper.createObjectNode();
            statement.setInt(1, Integer.parseInt(id));
            try (ResultSet resultSet = statement.executeQuery()) {
                resultSet.next();
                json.put("user_id", resultSet.getInt(1));
                json.put("user_name", resultSet.getString(2));
                json.put("date_joined", String.valueOf(resultSet.getDate(3)));
                return json;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    private JsonNode userIDToUsername(int userID){
        if (userID != 0) {
            return getPlayerInfo(Integer.toString(userID)).get("user_name");
        } else {
            return null;
        }
    }

}
