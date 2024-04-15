package CS506Team25.Card_Engine.apitesting;

import CS506Team25.Card_Engine.CardEngineController;
import CS506Team25.Card_Engine.websocket.GameWebsocketController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class SmokeTest {

	@Autowired
	private CardEngineController restController;

	@Autowired
	private GameWebsocketController webController;

	@Test
	void contextLoads() {
		assertThat(restController).isNotNull();
		assertThat(webController).isNotNull();
	}

}
