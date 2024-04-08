package CS506Team25.Card_Engine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;



/**
 * Class containing main() that runs the whole program
 * 
 * Utilizes @SpringBootApplication from the Spring framework to create a Spring application
 * 
 */
@SpringBootApplication
public class CardEngineApplication {

	/**
	 * Main method that runs the entire program as a Spring application
	 * 
	 * @param args The command line arguments
	 */
	public static void main(String[] args) {
		SpringApplication.run(CardEngineApplication.class, args);
	}

}
