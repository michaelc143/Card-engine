package CS506Team25.Card_Engine;

import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

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

    @PostMapping("/create-game")
    public String createGame() {
        try (Connection connection = DriverManager.getConnection(url, databaseUsername, password);
             PreparedStatement insertStatement = connection.prepareStatement("INSERT INTO euchre_game VALUES (DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT)")) {

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

}
