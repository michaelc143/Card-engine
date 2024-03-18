CREATE TABLE `full_house_badger`.`users` (
	`user_id` INT NOT NULL AUTO_INCREMENT ,
	`user_name` VARCHAR(75) DEFAULT NULL ,
	`email` VARCHAR(75) DEFAULT NULL ,
	PRIMARY KEY (`user_id`)
) ENGINE = InnoDB DEFAULT  CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;
