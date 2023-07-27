<?php get_header(); ?>

<?php
$post_categories = get_the_category($post);

if (term_exists(yoast_get_primary_term())) {
    $main_category = get_term(yoast_get_primary_term_id('category', $post->id));
} else {
    $main_category = $post_categories[0];
}
?>

<section class="section">
    <h1><?php echo $post->post_title; ?></h1>

    <div><?php echo $main_category->name; ?></div>
    <?php foreach ($post_categories as $category) :
        if ($category->term_id != $main_category->term_id) : ?>
            <div><?php echo $category->name; ?></div>
    <?php endif;
    endforeach; ?>

    <div><?php echo $post->post_date; ?></div>

    <img src="<?php echo get_the_post_thumbnail_url($post, "full"); ?>">

    <div><?php echo the_field("servings"); ?></div>
    <div><?php echo the_field("preparation_time"); ?></div>
    <div><?php echo the_field("difficulty"); ?></div>

    <?php echo the_content(); ?>

    <?php echo the_field("ingredients"); ?>
    <?php echo the_field("preparation"); ?>
</section>

<?php get_footer(); ?>