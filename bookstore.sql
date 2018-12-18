-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 02, 2018 at 05:08 PM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 7.1.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bookstore`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `publisher` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int(11) NOT NULL,
  `isbn` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(5,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `publisher`, `year`, `isbn`, `price`, `created_at`, `updated_at`) VALUES
(1, 'Storm of Steel', 'Ernst Junger', 'Penguin', 1980, '1234557891011', '12.99', '2018-04-18 14:27:27', '2018-04-18 14:27:27'),
(2, 'The World of Yesterday', 'Stefan Zweig', 'Pushkin Press', 1971, '1232345886773', '12.85', '2018-05-01 11:52:48', '2018-05-01 15:30:18'),
(3, 'The Prelude', 'William Wordsworth', 'Penguin', 1995, '1232123488756', '14.00', '2018-05-01 15:25:44', '2018-05-01 15:25:44'),
(4, 'Jude the Obscure', 'Thomas Hardy', 'Wordsworth Classics', 2014, '8761775423764', '10.95', '2018-05-01 15:27:33', '2018-05-01 15:28:18'),
(6, 'There & Back Again', 'J.R.R Tolkien', 'HarperCollins', 1925, '3264475423765', '12.00', '2018-04-18 14:27:27', '2018-04-18 14:27:27'),
(7, 'East of Eden', 'John Steinbeck', 'Penguin', 1952, '4859325886734', '10.99', '2018-04-18 14:27:27', '2018-04-18 14:27:28'),
(8, 'Pride & Predjudice', 'Jane Austin', 'Wordsworth Classics', 2010, '0966387891011', '11.00', '2018-04-18 14:27:27', '2018-04-18 14:27:29'),
(9, 'A Dolls House', 'Henrick Ibsen', 'Penguin', 1944, '0975178952789', '10.95', '2018-04-18 14:27:27', '2018-04-18 14:27:30'),
(10, 'Frankenstein', 'Mary Shelley', 'Penguin', 2012, '9780141439471', '12.45', '2018-04-18 14:27:27', '2018-04-18 14:27:27'),
(11, 'Wuthering Heights', 'Emily Bronte', 'HarperCollins', 2006, '9780141439556', '10.00', '2018-04-18 14:27:27', '2018-04-18 14:27:27'),
(12, 'Anna Karenina', 'Leo Tolstoy', 'Penguin', 1980, '9780140449174', '11.95', '2018-04-18 14:27:27', '2018-04-18 14:27:27');
-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(4, '2018_04_17_215731_create_books_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Evan MacHale', 'n00150552@student.iadt.ie', '$2y$10$gnF7UQaO5Wtldu104fTOnut6a2tFI8Dmf146xfXF50SIQLSAvYwza', 'q6DEnqjPviohOBAEZZy1NxkExKAKXI0pbweVuA4oL92EwoNicJu0M9FBNsDc', '2018-04-17 20:52:48', '2018-04-17 20:52:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `books_isbn_unique` (`isbn`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
