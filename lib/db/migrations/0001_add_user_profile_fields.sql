ALTER TABLE users
ADD COLUMN display_name VARCHAR(100),
ADD COLUMN bio TEXT,
ADD COLUMN location VARCHAR(100),
ADD COLUMN website VARCHAR(255),
ADD COLUMN social_links TEXT,
ADD COLUMN stripe_customer_id TEXT; 