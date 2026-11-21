INSERT INTO role (role_id, description) VALUES (1, 'User');

INSERT INTO `user` (user_name, password, email, phone, full_name, role_id)
VALUES ('demo', '$2a$12$ZSu2KF8XHeZ2jp.jgfO.7ulsrKD09jMz2jrrfxc9CfA5iPquFLsP2',
        'demo@example.com', '0900000000', 'Demo User', 1);
