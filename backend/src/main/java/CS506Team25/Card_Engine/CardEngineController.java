package CS506Team25.Card_Engine;

import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
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
     * @param gameName Name that will be displayed in lobby
     * @return Newly created game's ID
     */
    @PostMapping("/create-game")
    public String createGame(@RequestParam String gameName) {
        try (Connection connection = DriverManager.getConnection(url, databaseUsername, password);
             PreparedStatement insertStatement = connection.prepareStatement("INSERT INTO euchre_game VALUES (DEFAULT, ?, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT)")) {

            insertStatement.setString(1, gameName);
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
     * @param gameID ID of game you're trying ot join
     * @param playerID your player ID
     * @param seatNumber which seat at the table you want to join 1-4
     * @return Response message
     */
    @PostMapping("/select-seat")
    public String assignSeat(@RequestParam int gameID, int playerID, int seatNumber) {
        String playerSeat = "player" + seatNumber + "_id";
        try (Connection connection = DriverManager.getConnection(url, databaseUsername, password);
            PreparedStatement insertStatement = connection.prepareStatement("UPDATE euchre_game SET " + playerSeat + " = ? WHERE game_id = ?")) {

            insertStatement.setInt(1, playerID);
            insertStatement.setInt(2, gameID);
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
    @GetMapping("/open-games")
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

}
