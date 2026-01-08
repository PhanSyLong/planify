-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: planify
-- ------------------------------------------------------
-- Server version	8.0.34

DROP DATABASE IF EXISTS planify;
CREATE DATABASE planify;
USE planify;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `daily_performance`;
CREATE TABLE `daily_performance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `date` datetime NOT NULL,
  `subtasks_completed` int DEFAULT NULL,
  `subtasks_incompleted` int DEFAULT NULL,
  `subtasks_cancelled` int DEFAULT NULL,
  `task_early` int DEFAULT NULL,
  `task_late` int DEFAULT NULL,
  `task_ontime` int DEFAULT NULL,
  `duration_changes` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_daily_performance_idx` (`plan_id`),
  KEY `fk_daily_performnance_user_idx` (`user_id`),
  CONSTRAINT `fk_daily_performance_plan` FOREIGN KEY (`plan_id`) REFERENCES `plan` (`id`),
  CONSTRAINT `fk_daily_performance_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


LOCK TABLES `daily_performance` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `follow`;
CREATE TABLE `follow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `follower_id` int NOT NULL,
  `following_id` int NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_follower_user_idx` (`follower_id`),
  KEY `fk_follower_idx` (`following_id`),
  CONSTRAINT `fk_follow_user` FOREIGN KEY (`follower_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_follow` FOREIGN KEY (`following_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


LOCK TABLES `follow` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `forked_plan`;
CREATE TABLE `forked_plan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `original_plan_id` int DEFAULT NULL,
  `adopted_plan_id` int DEFAULT NULL,
  `adopted_user_id` int DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_original_plan_idx` (`original_plan_id`),
  KEY `fk_fork_plan_user_idx` (`adopted_user_id`),
  KEY `fk_fork_plan_plan_idx` (`adopted_plan_id`),
  CONSTRAINT `fk_original_plan_plan` FOREIGN KEY (`original_plan_id`) REFERENCES `plan` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `fk_fork_plan_plan` FOREIGN KEY (`adopted_plan_id`) REFERENCES `plan` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `fk_fork_plan_user` FOREIGN KEY (`adopted_user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


LOCK TABLES `forked_plan` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `bookmark`;
CREATE TABLE `bookmark` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_bookmark_user_idx` (`user_id`),
  KEY `fk_bookmark_plan_idx` (`plan_id`),
  CONSTRAINT `fk_bookmark_plan` FOREIGN KEY (`plan_id`) REFERENCES `plan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bookmark_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


LOCK TABLES `bookmark` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `notification`;
CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` enum('task_deadline','task_fork','follower','task_reminder') COLLATE utf8mb4_bin NOT NULL,
  `message_text` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `time` datetime,
  `plan_id` int,
  PRIMARY KEY (`id`),
  KEY `fk_notification_user_idx` (`user_id`),
  KEY `fk_notification_plan_idx` (`plan_id`),
  KEY `idx_notification_plan_id` (`plan_id`),
  CONSTRAINT `fk_notification_plan` FOREIGN KEY (`plan_id`) REFERENCES `plan` (`id`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


LOCK TABLES `notification` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `plan`;
CREATE TABLE `plan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(120) COLLATE utf8mb4_bin NOT NULL,
  `description` varchar(120) COLLATE utf8mb4_bin NOT NULL,
  `duration` bigint NOT NULL,
  `picture` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `visibility` enum('private','public') COLLATE utf8mb4_bin NOT NULL,
  `status` enum('incompleted','completed','cancelled') COLLATE utf8mb4_bin NOT NULL,
  `created_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `expired_at` datetime(6) DEFAULT NULL,
  `expired_sent` bit(1) DEFAULT NULL,
  `reminder_at` datetime(6) DEFAULT NULL,
  `reminder_sent` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_plan_user_idx` (`user_id`),
  KEY `idx_plan_reminder` (`reminder_sent`,`reminder_at`),
  KEY `idx_plan_expired` (`expired_sent`,`expired_at`),
  KEY `idx_plan_user_id` (`user_id`),
  CONSTRAINT `fk_plan_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


LOCK TABLES `plan` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` enum('ADMIN','USER') COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


LOCK TABLES `role` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `stage`;
CREATE TABLE `stage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plan_id` int NOT NULL,
  `title` varchar(120) COLLATE utf8mb4_bin NOT NULL,
  `description` text COLLATE utf8mb4_bin,
  `duration` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_stage_plan_idx` (`plan_id`),
  CONSTRAINT `fk_stage_plan` FOREIGN KEY (`plan_id`) REFERENCES `plan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


LOCK TABLES `stage` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `subtask`;
CREATE TABLE `subtask` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `title` varchar(120) COLLATE utf8mb4_bin NOT NULL,
  `description` text COLLATE utf8mb4_bin,
  `duration` int NOT NULL,
  `status` enum('incompleted','completed','cancelled') COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_subtask_task_idx` (`task_id`),
  CONSTRAINT `fk_subtask_task` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


LOCK TABLES `subtask` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(120) COLLATE utf8mb4_bin NOT NULL,
  `category` enum('subject','certificate') COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


LOCK TABLES `tag` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `tag_plan`;
CREATE TABLE `tag_plan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `plan_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tk_tag_plan_idx` (`plan_id`),
  KEY `fk_tag_plan_tag_idx` (`tag_id`),
  CONSTRAINT `fk_tag_plan_plan` FOREIGN KEY (`plan_id`) REFERENCES `plan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tag_plan_tag` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


LOCK TABLES `tag_plan` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stage_id` int NOT NULL,
  `description` text COLLATE utf8mb4_bin,
  `duration` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_task_stage_idx` (`stage_id`),
  CONSTRAINT `fk_task_stage` FOREIGN KEY (`stage_id`) REFERENCES `stage` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


LOCK TABLES `task` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `notificationenabled` enum('true','false') COLLATE utf8mb4_bin DEFAULT NULL,
  `bio` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


LOCK TABLES `user` WRITE;
UNLOCK TABLES;


DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_role_user_idx` (`user_id`),
  KEY `fk_user_role_role_idx` (`role_id`),
  CONSTRAINT `fk_user_role_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_role_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


LOCK TABLES `user_role` WRITE;
UNLOCK TABLES;

CREATE TABLE invalidated_token (
    id VARCHAR(255) PRIMARY KEY,
    expiry_time DATETIME NOT NULL
);


/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-18 15:04:10
