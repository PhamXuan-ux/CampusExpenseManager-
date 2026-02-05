DROP DATABASE IF EXISTS DataExpenseManagement;

CREATE DATABASE DataExpenseManagement;
USE DataExpenseManagement;

-- ====================================================
-- NHÓM 1: CÁC BẢNG CƠ SỞ (KHÔNG PHỤ THUỘC)
-- ====================================================

-- Bảng user
CREATE TABLE `user` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255),
    `phone` VARCHAR(255),
    `user_name` VARCHAR(255),
    `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng category (Danh mục cha)
CREATE TABLE `category` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `type` VARCHAR(255), -- Thu/Chi
    `user_id` INT, -- (Tuỳ chọn: nếu danh mục riêng tư)
    `usageCount` INT DEFAULT 0,
    `lastUsedAt` DATETIME
);

-- Bảng traffic (Thống kê)
CREATE TABLE `traffic` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `traffic_count` INT,
    `y_m_d` DATE
);

-- Bảng group (Nhóm) - Dùng dấu ` ` vì Group là từ khoá
CREATE TABLE `group` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `status` VARCHAR(255)
);

-- Bảng foreign currency (Ngoại tệ)
CREATE TABLE `foreign_currency` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `rate` DECIMAL(18, 2)
);

-- ====================================================
-- NHÓM 2: CÁC BẢNG CẤP 1 (PHỤ THUỘC VÀO USER/CATEGORY)
-- ====================================================

-- Bảng account (Tách riêng theo sơ đồ)
CREATE TABLE `account` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `phone` VARCHAR(255),
    `email` VARCHAR(255),
    `password` VARCHAR(255),
    `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `role` VARCHAR(255),
    `status` VARCHAR(255),
    `accessed_today` BOOLEAN DEFAULT 0,
    `last_login` DATETIME,
    `verified` BOOLEAN DEFAULT 0,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

-- Bảng token
CREATE TABLE `token` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `token_hash` VARCHAR(255),
    `user_id` INT NOT NULL,
    `expires_at` TIME, -- Hoặc DATETIME tuỳ logic
    `device_id` VARCHAR(255),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

-- Bảng notification
CREATE TABLE `notification` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `for_user_id` INT NOT NULL,
    `contents` TEXT,
    `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`for_user_id`) REFERENCES `user`(`id`)
);

-- Bảng wallet
CREATE TABLE `wallet` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `balance` DECIMAL(18, 2) DEFAULT 0,
    `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `user_id` INT NOT NULL,
    `status` VARCHAR(255),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Bảng category detail
CREATE TABLE `category_detail` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `userCount` INT,
    `category_id` INT NOT NULL,
    FOREIGN KEY (`category_id`) REFERENCES `category`(`id`)
);

-- Bảng logs
CREATE TABLE `logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `contents` TEXT,
    `by_user_id` INT,
    `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`by_user_id`) REFERENCES `user`(`id`)
);

-- Bảng goal price
CREATE TABLE `goal_price` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `target_amount` DECIMAL(18, 2), -- Đặt target_amount thay vì thiếu cột
    `user_id` INT,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Bảng savings book
CREATE TABLE `savings_book` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `balance` DECIMAL(18, 2),
    `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `name` VARCHAR(255),
    `last_access` DATETIME,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Bảng loan and debt
CREATE TABLE `loan_and_debt` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `amount` DECIMAL(18, 2),
    `type` VARCHAR(255),
    `to_other` VARCHAR(255),
    `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `remaining` DECIMAL(18, 2),
    `note` TEXT,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Bảng member group
CREATE TABLE `member_group` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `group_id` INT NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`group_id`) REFERENCES `group`(`id`)
);

-- Bảng group fund
CREATE TABLE `group_fund` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `balance` DECIMAL(18, 2),
    `group_id` INT NOT NULL,
    `create_by` INT,
    `usageCount` INT,
    `lastUsedAt` DATETIME,
    FOREIGN KEY (`group_id`) REFERENCES `group`(`id`)
);

-- ====================================================
-- NHÓM 3: CÁC BẢNG CẤP 2 (PHỨC TẠP NHẤT)
-- ====================================================

-- Bảng budget (Sửa lỗi year-month thành year_month)
CREATE TABLE `budget` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `category_id` INT,
    `balance` DECIMAL(18, 2),
    `remaining` DECIMAL(18, 2),
    `year_month` DATE,
    `status` VARCHAR(255),
    `last_access` DATETIME,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`category_id`) REFERENCES `category`(`id`)
);

-- Bảng transaction
CREATE TABLE `transaction` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `cate_detail_id` INT,
    `amount` DECIMAL(18, 2),
    `type` VARCHAR(255),
    `user_id` INT NOT NULL,
    `wallet_id` INT NOT NULL,
    `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `transactionTime` TIME,
    `note` TEXT,
    `budget_id` INT,
    `last_input` DATETIME,
    `status` VARCHAR(50), -- Cột màu đỏ trong ảnh
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`wallet_id`) REFERENCES `wallet`(`id`),
    FOREIGN KEY (`cate_detail_id`) REFERENCES `category_detail`(`id`),
    FOREIGN KEY (`budget_id`) REFERENCES `budget`(`id`)
);

-- Bảng savings history
CREATE TABLE `savings_history` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `wallet_id` INT,
    `amount` DECIMAL(18, 2),
    `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `note` TEXT,
    `type` VARCHAR(255),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`wallet_id`) REFERENCES `wallet`(`id`)
);

-- Bảng group transaction
CREATE TABLE `group_transaction` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `cate_detail_id` INT,
    `amount` DECIMAL(18, 2),
    `type` VARCHAR(255),
    `user_id` INT,
    `group_fund_id` INT,
    `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `note` TEXT,
    `group_id` INT,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`group_fund_id`) REFERENCES `group_fund`(`id`),
    FOREIGN KEY (`cate_detail_id`) REFERENCES `category_detail`(`id`),
    FOREIGN KEY (`group_id`) REFERENCES `group`(`id`)
);

-- Bảng otp_codes (Lưu mã xác thực OTP)
CREATE TABLE `otp_codes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `code` VARCHAR(10) NOT NULL,
    `type` VARCHAR(50) NOT NULL, -- 'register' hoặc 'forgot_password'
    `expires_at` DATETIME NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX (`email`)
);
