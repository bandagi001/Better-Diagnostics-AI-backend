-- Update existing User table to add Google OAuth fields
-- Run this script if you already have data in your database

USE ti_dev;

-- Add Google OAuth fields to existing User table
ALTER TABLE User 
ADD COLUMN googleId varchar(255) NULL AFTER licenseExpiry,
ADD COLUMN googleLogin boolean DEFAULT false AFTER googleId,
ADD COLUMN photoUrl text(65535) AFTER googleLogin;

-- Verify the changes
DESCRIBE User;

-- Show sample data (if any exists)
SELECT _id, email, userName, googleId, googleLogin, photoUrl FROM User LIMIT 5;
