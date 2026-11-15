-- Profile photo. Stores either an uploaded data URL or the Google profile
-- picture URL captured at sign-in. NULL means show the neutral placeholder.
ALTER TABLE users ADD COLUMN avatar TEXT;
