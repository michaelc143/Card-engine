CREATE TABLE `WhatAndWho`.`What` (
  `What_pk` INT NOT NULL auto_increment,
  `What_aa` VARCHAR(45) NULL,
  `What_bb` INT NULL,
  `What_cc` DATETIME NULL,
  `What_dd` ENUM('p', 'q', 'r') NULL,
  PRIMARY KEY (`What_pk`));