CREATE TABLE navbar (
    id int(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    menu_items varchar(255),
    
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE blog_posts (
    id int(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    post_title varchar(255) NOT NULL,
    post_description varchar(255),
    post_content varchar(255),
    
    
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE pages_content (
    id int(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE navbar (
    DROP home,
    DROP teste,
    ADD menu VARCHAR(255)
);

SHOW COLUMNS FROM pages_content LIKE 'Teste';

SELECT EXISTS(SELECT * FROM table_name)

IF NOT EXISTS ( SELECT NULL FROM pages_content WHERE column_name = "Home") THEN ALTER TABLE pages_content ADD Home VARCHAR(255) END IF

INSERT INTO navbar (menu_items) VALUES ("Home");

SET @item = "Home"; INSERT INTO navbar (menu_items) VALUES (@item) ON DUPLICATE KEY UPDATE menu_items = @item;

