CREATE TABLE `testflight_applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`app_slug` text NOT NULL,
	`app_name` text NOT NULL,
	`device` text NOT NULL,
	`reason` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`ip_hash` text NOT NULL,
	`consented_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_testflight_applications_ip_created` ON `testflight_applications` (`ip_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_testflight_applications_email_app_status` ON `testflight_applications` (`email`,`app_slug`,`status`);--> statement-breakpoint
CREATE INDEX `idx_testflight_applications_status_app` ON `testflight_applications` (`status`,`app_slug`);