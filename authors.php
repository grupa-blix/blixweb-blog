<?php /* Template Name: Autorzy */ ?>

<?php get_header(); ?>

<?php
    $authors = get_users([
        'fields'  => ['ID', 'display_name'],
        'role'    => 'author',
        'orderby' => 'display_name',
    ]);
?>

<?php
    $vars = (object) [
        'header' => 'Autorzy'
    ]
?>
<?php include "partials/pills-navigation.php"; ?>

<section class="section authors-list">
    <?php foreach ($authors as $author) : ?>
        <div class="authors-list__single">
            <?php echo get_avatar($author->ID, 48, '', $author->display_name); ?>
            <a href="<?php echo get_author_posts_url($author->ID); ?>">
                <h4><?php echo $author->display_name; ?></h4>
            </a>
            <?php
                $vars = (object) [
                    'author_id' => $author->ID,
                ];
                include 'partials/socials.php'
            ?>
        </div>
    <?php endforeach; ?>
</section>

<?php get_footer(); ?>