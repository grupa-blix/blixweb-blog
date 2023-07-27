<?php get_header(); ?>

<?php
$vars = (object) [
    'header' => 'Wyniki wyszukiwania: ' . $s
]
?>
<?php include "partials/pills-navigation.php"; ?>

<?php
$s = get_search_query();
$args = array('s' => $s);
$the_query = new WP_Query($args); ?>

<?php
$vars = (object) [
    'elements' => $posts
]
?>
<?php include 'partials/sections/posts.php'; ?>

<?php wpbeginner_numeric_posts_nav(); ?>
<?php get_footer(); ?>