<?php
$post_categories = get_the_category($post);

usort($post_categories, function($a, $b) {
    return $a->term_id - $b->term_id;
 });

if (term_exists(yoast_get_primary_term())) {
    $main_category = get_term(yoast_get_primary_term_id('category', $post->id));
} else {
    $main_category = $post_categories[0];
}
?>

<section class="section recipe-info">
    <div class="top-wrapper">
        <h1 class="top-wrapper__title"><?php echo $post->post_title; ?></h1>

        <div class="top-wrapper__pills pills">
            <div class="pills__track">
                <a href="<?php echo get_category_link($main_category); ?>" class="pill pill--main"><?php echo $main_category->name; ?></a>
                <?php foreach ($post_categories as $category) :
                    if ($category->term_id != $main_category->term_id) : ?>
                        <a href="<?php echo get_category_link($category); ?>" class="pill"><?php echo $category->name; ?></a>
                <?php endif; endforeach; ?>
            </div>
        </div>

        <img src="<?php echo get_the_post_thumbnail_url($post, "full"); ?>" class="top-wrapper__featured-img">

        <div class="top-wrapper__details">
            <?php if(get_field("servings")) : ?>
                <div class="top-wrapper__detail"><img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/servings.svg'; ?>" /><strong><?php echo the_field("servings"); ?></strong></div>
            <?php endif; ?>
            <?php if(get_field("preparation_time")) : ?>
                <div class="top-wrapper__detail"><img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/time.svg'; ?>" /><strong><?php echo the_field("preparation_time"); ?></strong></div>
            <?php endif; ?>
            <?php if(get_field("difficulty")) : ?>
                <div class="top-wrapper__detail"><img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/difficulty.svg'; ?>" /><strong><?php echo the_field("difficulty"); ?></strong></div>
            <?php endif; ?>
        </div>

        <div class="top-wrapper__data"><?php echo $post->post_date; ?></div>
        <div class="top-wrapper__content"><?php echo the_content(); ?></div>
        <div class="top-wrapper__sidebar">
            <?php include __DIR__ . "/../search.php"; ?>
            <div class="sidebar-posts">
                <strong class="sidebar-posts__header">Zobacz również</strong>
                <?php
                    $args = array(
                        'post_type' => 'post',
                        'orderby' => 'ID',
                        'post_status' => 'publish',
                        'order' => 'DESC',
                        'cat' => $main_category->term_id,
                        'post__not_in' => [$post->ID],
                        'posts_per_page' => 9
                    );

                    $result = new WP_Query($args);

                    while ( $result->have_posts() ) : $result->the_post() ?>
                        <div class="single-post">
                            <a href="<?php echo get_permalink(); ?>">
                                <?php echo get_the_post_thumbnail(null, 'thumbnail', ['class' => 'single-post__img']) ?>
                                <div class="single-post__data">
                                    <span class="single-post__title"><?php echo the_title(); ?></span>
                                    <span class="single-post__date"><?php echo get_the_date('d.m.Y', $post); ?></span>
                                </div>
                            </a>
                        </div>
                    <?php endwhile; ?>
            </div>
        </div>
    </div>

    <div class="bottom-wrapper">
        <div class="bottom-wrapper__ingredients">
            <h2>Składniki</h2>
            <?php echo the_field("ingredients"); ?>
        </div>
        <div class="bottom-wrapper__preparation">
            <h2>Jak zrobić <?php echo $post->post_title; ?></h2>
            <?php echo the_field("preparation"); ?>
        </div>
    </div>
</section>