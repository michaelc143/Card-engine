CREATE TABLE `full_house_badger`.`euchre_game` (
        `game_id` INT NOT NULL AUTO_INCREMENT,
        `player1_id` INT ,
        `player2_id` INT ,
        `player3_id` INT ,
        `player4_id` INT ,
        `game_status` ENUM('waiting_for_players','in_progress','done') DEFAULT 'waiting_for_players' ,
        `winner_1` INT ,
        `winner_2` INT ,
        `creation_date` DATE DEFAULT (CURRENT_DATE) ,
        PRIMARY KEY (game_id) ,
        FOREIGN KEY (player1_id) REFERENCES users(user_id) ,
        FOREIGN KEY (player2_id) REFERENCES users(user_id) ,
        FOREIGN KEY (player3_id) REFERENCES users(user_id) ,
        FOREIGN KEY (player4_id) REFERENCES users(user_id)
);