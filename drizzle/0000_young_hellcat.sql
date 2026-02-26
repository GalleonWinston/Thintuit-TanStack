-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `t_bin` (
	`ID` int NOT NULL,
	`Location_X` float NOT NULL,
	`Location_Y` float NOT NULL,
	`Status` int NOT NULL,
	`LastServiceTime` datetime NOT NULL,
	`LastFullTime` datetime NOT NULL,
	`Category` int NOT NULL,
	`Description` varchar(128),
	`LastDisconnectedTime` datetime NOT NULL,
	`Active` tinyint(1) NOT NULL,
	CONSTRAINT `t_bin_ID` PRIMARY KEY(`ID`)
);
--> statement-breakpoint
CREATE INDEX `IX_STATUS` ON `t_bin` (`Status`);--> statement-breakpoint
CREATE INDEX `IX_Category` ON `t_bin` (`Category`);
*/