<?php get_header(); ?>

<?php
    $vars = (object) [
        'header' => get_the_author_meta('display_name') . ' - artykuły i przepisy'
    ];
    include "partials/pills-navigation.php";
?>

<section class="section py-0">
    <p>
        <?php echo get_the_author_meta('description'); ?>
    </p>
    <?php
        $vars = (object) [
            'author_id' => get_the_author_meta('ID')
        ];
        include 'partials/socials.php'
    ?>
</section>

<?php
    $vars = (object) [
        'elements' => $posts
    ];
    include 'partials/sections/posts.php';
?>

<?php wpbeginner_numeric_posts_nav(); ?>

<?php get_footer(); ?>