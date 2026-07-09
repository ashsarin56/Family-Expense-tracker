-- Use the database that's already created by Railway
-- The database name comes from the MYSQLDATABASE environment variable (default: railway)

create table if not exists users(
    id int primary key auto_increment,
    name varchar(100) not null,
    email varchar(150) not null unique,
    password varchar(255) not null,
    role varchar(20) not null default 'member',
    family_id int default null,
    created_at timestamp default current_timestamp
);

create table if not exists families(
    id int primary key auto_increment,
    name varchar(100) not null,
    invite_code varchar(50) not null unique,
    created_by int not null,
    created_at timestamp default current_timestamp,
    foreign key (created_by) references users(id)
);

-- Add foreign key constraint if it doesn't exist
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
    WHERE CONSTRAINT_NAME = 'fk_user_family' 
    AND TABLE_NAME = 'users'
);

SET @sql = IF(@constraint_exists = 0, 
    'ALTER TABLE users ADD CONSTRAINT fk_user_family FOREIGN KEY (family_id) REFERENCES families(id)',
    'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

create table if not exists categories(
    id int primary key auto_increment,
    name varchar(100) not null,
    family_id int not null,
    created_at timestamp default current_timestamp,
    foreign key (family_id) references families(id),
    unique key unique_category_per_family (name, family_id)
);

create table if not exists expenses(
    id int primary key auto_increment,
    amount decimal(10,2) not null,
    description varchar(255) not null,
    category_id int not null,
    user_id int not null,
    family_id int not null,
    created_at timestamp default current_timestamp,
    foreign key (category_id) references categories(id),
    foreign key (user_id) references users(id),
    foreign key (family_id) references families(id)
);

