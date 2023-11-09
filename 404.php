<?php get_header(); ?>

<?php include "partials/pills-navigation.php"; ?>

<section class="section pb-0 error404">
    <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/404.png'; ?>">
    <h1>Przepraszamy, ta strona opuściła orbitę Blix</h1>
    <p>Skorzystaj z wyszukiwarki lub zobacz nasze najnowsze wpisy.</p>
</section>

<?php
$args = array(
'post_type' => 'post',
'orderby' => 'modified',
'post_status' => 'publish',
'order' => 'DESC',
'posts_per_page' => 8
);

$result = new WP_Query( $args );

if(count($result->posts) > 0) :
    $vars = (object) [
            'elements' => $result->posts
    ];
    include 'partials/sections/posts.php';
endif ?>

<?php get_footer(); ?>