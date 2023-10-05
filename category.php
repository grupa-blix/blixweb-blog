<?php get_header(); ?>

<?php $current_category = get_queried_object(); ?>
<?php
if(get_the_category_by_ID($current_category->parent) == "Przepisy"){
    $mainHeader = $current_category->name . ' - przepisy';
}else{
    $mainHeader = $current_category->name;
}
?>
<?php
$vars = (object) [
    'header' => $mainHeader
]
?>
<?php include "partials/pills-navigation.php"; ?>

<?php
$vars = (object) [
    'elements' => array_slice($posts, 0, 8)
]
?>
<?php include 'partials/sections/posts.php'; ?>

<?php
$vars = (object) [
    'elements' => array_slice($posts, 8, 8)
]
?>
<?php if (count($vars->elements) != 0) : ?>
    <?php
    $header = "Najnowsze gazetki Blix";
    $leaflets = "newest";
    include 'partials/sections/leaflets.php';
    include 'partials/sections/posts.php'; ?>
<?php endif ?>

<?php
$vars = (object) [
    'elements' => array_slice($posts, 16, 8)
]
?>
<?php if (count($vars->elements) != 0) : ?>
    <?php
    include 'partials/sections/products.php';
    include 'partials/sections/posts.php'; ?>
<?php endif ?>

<?php wpbeginner_numeric_posts_nav(); ?>

<?php if (get_field('description', $current_category)) : ?>
    <section class="section">
        <?php the_field('description', $current_category); ?>
    </section>
<?php endif ?>

<?php get_footer(); ?>