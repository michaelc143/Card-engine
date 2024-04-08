package CS506Team25.Card_Engine;

import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import java.io.StringWriter;
import java.io.PrintWriter;


/**
 * The "CardEngineController" class contains all methods to run the euchre card engine.
 * 
 * It contains a test method (hello()), a method to login (login()), and a method to register (register()).
 * 
 */
@RestController
@CrossOrigin
public class CardEngineController {

    private final String url = "jdbc:mysql://localhost:53306/full_house_badger";
    private final String databaseUsername = "root";
    private final String password = "lucky_badger";


    /**
     * Test method to test functionality of @GetMapping("/")
     * 
     * @return "Hello World"
     */
    @GetMapping("/")
    public String hello() {
        return "Hello World";
    }

    /**
     * Login method connecting to the database through @PostMapping("/login")
     * 
     * Uses a prepared statement to find a user in the database (if they exist) and allow them to login.
     * 
     * @param username                                  Username attempting to login
     * @return "Logged in"                              Login successful
     * @return "User does not exist"                    User not found
     * @return "Error occurred connecting to server."   Error connecting to database
     */
    @PostMapping("/login")
    public String login(@RequestParam String username) {
        try (Connection connection = DriverManager.getConnection(url, databaseUsername, password);
                PreparedStatement statement = connection.prepareStatement("SELECT * FROM users WHERE user_name = ?")) {

            statement.setString(1, username);
            // Check if user exists or not
            // If exists, return "Logged in"
            // Else, return "User does not exist"
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

    /**
     * Register method connecting to the database through @PostMapping("/register")
     * 
     * Uses a prepared statement to find if a desired username is already in use
     * If username is available, inserts username into database and registers user
     * 
     * @param username                                  Username attempting to be registered
     * @return "User already exists"                    Desired username already in use
     * @return "User successfully registered"           Username registered and added to database
     * @return "Failed to register user"                Error when adding username to database during registration
     * @return "Error occurred connecting to server."   Error connecting to database
     */
    @PostMapping("/register")
    public String register(@RequestParam String username) {
        try (Connection connection = DriverManager.getConnection(url, databaseUsername, password);
                PreparedStatement statement = connection.prepareStatement("SELECT * FROM users WHERE user_name = ?")) {

            statement.setString(1, username);

            // If user is already in the database, return "User already exists"
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return "User already exists";
                }
            }
            
            PreparedStatement insertStatement = connection.prepareStatement("INSERT INTO users (user_name) VALUES (?)");

            insertStatement.setString(1, username);
            int rowsInserted = insertStatement.executeUpdate();

            // Check the number of rows inserted to the database
            // If >0, then username must've been added, thus return "User successfully registered"
            // Else, return "Failed to register user"
            if(rowsInserted > 0){
                return "User successfully registered";
            }else{
                return "Failed to register user";
            }

        } catch (SQLException e) {
            e.printStackTrace();
            return "Error occurred connecting to server.";
        }
    }
}
