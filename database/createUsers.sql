CREATE TABLE `full_house_badger`.`users` (
	`user_id` INT NOT NULL AUTO_INCREMENT ,
	`user_name` VARCHAR(75) NOT NULL UNIQUE ,
	`date_joined` DATE DEFAULT (CURRENT_DATE) ,
	PRIMARY KEY (`user_id`)
) ENGINE = InnoDB DEFAULT  CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;
