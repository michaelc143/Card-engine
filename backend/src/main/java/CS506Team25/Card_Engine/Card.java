package CS506Team25.Card_Engine;

import java.util.*;

public class Card {
    enum Color {
        RED,
        BLACK
    }

    enum Suit {
        DIAMONDS(Color.RED),
        SPADES(Color.BLACK),
        HEARTS(Color.RED),
        CLUBS(Color.BLACK);

        private final Color color;

        Suit(Color color) {
            this.color = color;
        }

        /**
         * A helper method to get the color of a suit
         * @return the color of the suit
         */
        public Color getColor() {
            return color;
        }
    }

    enum Rank {
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

        /**
         * A simple helper method to compare card values
         * @return the value of the rank, not accounting for jacks
         */
        public int getValue() {
            return value;
        }
    }

    private final Suit suit;
    private final Rank rank;

    /**
     * Returns the suit of the card. This should be used before trump is named.
     * 
     * @return the card's suit, not accounting for jacks swapping suit
     */
    public Suit getSuit() {
        return this.suit;
    }

    /**
     * Returns the suit of the card, accounting for what has been named trump. This
     * should be use after trump is named.
     * 
     * @param trump the trump suit
     * @return the card's suit, accounting for jacks swapping suit
     */
    public Suit getSuit(Suit trump) {
        // If it's a jack of the same color as trump, it's treated as the trump suit
        if (this.rank.equals(Rank.JACK) && this.suit.getColor().equals(trump.getColor())) {
            return trump;
        }
        return this.suit;
    }

    /**
     * Returns the rank of the card.
     * 
     * @return the card's rank as a Rank enum
     */
    public Rank getRank() {
        return this.rank;
    }

    /**
     * Returns an integer representation of the value of the card. The number itself
     * is only used to compare cards to see which wins. It is only useful when the
     * card is either following suit or trump.
     * 
     * @param trump the trump suit
     * @return integer ranking of the card
     */
    public int getRanking(Suit trump) {
        // If it's a non trump card (opposite color or same color but different suit and
        // not a jack), simply return the rank
        if (!this.suit.color.equals(trump.color) || (!this.suit.equals(trump) && !this.rank.equals(Rank.JACK))) {
            return this.rank.getValue();
        }

        // If it's a trump card, return the trump ordering
        // The actual values don't matter, just their values relative to each other
        // Non-jacks are relatively simple, just return the int rank and add 100 to
        // ensure it beats all non-trump
        if (!this.rank.equals(Rank.JACK)) {
            return this.rank.getValue() + 100;
        }

        // The left bower (the opposite suit jack) is the 2nd highest card
        if (!this.suit.equals(trump)) {
            return 200;
        }

        // The right bower (jack of the trump suit) is the highest card
        return 300;
    }

    /**
     * Returns whether the card is a trump given the trump suit
     * 
     * @param trump the trump suit
     * @return boolean representing whether the card is trump
     */
    public boolean isTrump(Suit trump) {
        // A card is trump in 2 conditions: it's the same suit as trump or it's the jack
        // of the other suit with the same color
        if (this.suit.equals(trump) || (this.suit.getColor().equals(trump.getColor()) && this.rank.equals(Rank.JACK))) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns a string representation of the card.
     * 
     * @return a string representation of the card
     */
    @Override
    public String toString() {
        return rank + " of " + suit;
    }

    /**
     * Creates a new card object with given suit and rank
     * 
     * @param suit the suit of the card
     * @param rank the rank of the card
     * @return the created card
     */
    public Card(Suit suit, Rank rank) {
        this.suit = suit;
        this.rank = rank;
    }
}