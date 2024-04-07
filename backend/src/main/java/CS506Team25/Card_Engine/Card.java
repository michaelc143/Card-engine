package CS506Team25.Card_Engine;

import java.util.*;

public class Card {
    enum Color {
        RED,
        BLACK
    }

    enum Suit {
        DIAMONDS(Color.RED),
        HEARTS(Color.RED),
        SPADES(Color.BLACK),
        CLUBS(Color.BLACK);

        private final Color color;

        Suit(Color color) {
            this.color = color;
        }

        public Color getSuitColor() {
            return color;
        }
    }

    enum Rank {
        // Make sure to be careful with the rank values when Jacks are involved, as they
        // depend on the trump suit
        NINE(9),
        TEN(10),
        JACK(11),
        QUEEN(12),
        KING(13),
        ACE(14);

        private final int value;

        Rank(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    private final Suit suit;
    private final Rank rank;

    public Suit getSuit() {
        return this.suit;
    }

    public Rank getRank() {
        return this.rank;
    }

    public Color getColor() {
        return this.suit.getSuitColor();
    }

    @Override
    public String toString() {
        return rank + " of " + suit;
    }

    //TODO: implement sort order for QOL
    
    public Card(Suit suit, Rank rank) {
        this.suit = suit;
        this.rank = rank;
    }
}