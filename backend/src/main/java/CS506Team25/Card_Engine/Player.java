package CS506Team25.Card_Engine;

import java.util.*;

public class Player {
    public Player(int playerID, String username){
        this.playerID = playerID;
        this.username = username;
    }

    @Override
    public String toString() {
        return super.toString();
    }

    int playerID;
    String username;
    boolean readyToStart = false;
    int score = 0;
}
