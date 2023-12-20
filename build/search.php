<?php get_header(); ?>

<?php
$vars = (object) [
    'header' => 'Wyniki wyszukiwania: ' . $s
]
?>
<?php include "partials/pills-navigation.php"; ?>

<?php
$s = get_search_query();
$args = array('s' => $s, 'orderby' => 'modified', 'paged' => $paged);
$result = new WP_Query($args); ?>

<?php
    if(count($result->posts) > 0) :
        $vars = (object) [
                'elements' => $result->posts
        ];
        include 'partials/sections/posts.php';
    else : ?>

    <section class="section">
        <?php echo "<strong>Niestety nie znaleźliśmy artykułów dla frazy <span class='text-turquoise'>&#34;" . $s . "&#34;.</span></strong> Sprawdź poprawność pisowni lub przejdź do <a href='/' style='text-decoration:underline;'>strony głównej.</a>" ;?>
    </section>

<?php endif; ?>

<?php wpbeginner_numeric_posts_nav(); ?>
<?php get_footer(); ?>