CREATE TABLE role (
    role_id BIGINT NOT NULL AUTO_INCREMENT,
    description VARCHAR(255) NOT NULL,
    PRIMARY KEY (role_id)
);

CREATE TABLE `user` (
    user_id BIGINT NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(64) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(32),
    full_name VARCHAR(150) NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT uk_user_name UNIQUE (user_name),
    CONSTRAINT uk_user_email UNIQUE (email),
    CONSTRAINT ck_user_name_no_at CHECK (LOCATE('@', user_name) = 0),
    CONSTRAINT ck_user_email_has_at CHECK (LOCATE('@', email) > 1),
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role (role_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci;
