<?php $main_category = get_the_category($post)[0]; ?>
<section class="section article-info">
    <div class="top-wrapper">
        <h1 class="top-wrapper__title"><?php echo the_title(); ?></h1>
        <div class="top-wrapper__details details">
            <div class="details__date"><?php echo get_the_date('d.m.Y'); ?></div>
            <?php if(get_field('likes', $post->ID)) : ?>
                <div class="details__likes">
                    <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/like.svg'; ?>" />
                    <span><?php echo the_field('likes', $post->ID); ?></span>
                </div>
            <?php endif ?>
        </div>
        <div class="top-wrapper__pills pills">
            <div class="pills__track">
                <a href="<?php echo get_category_link($main_category) ?>" class="pill pill--main"><?php echo $main_category->name; ?></a>
            </div>
        </div>
        <div class="top-wrapper__short-description">
            <?php if(get_field("short_description")) : ?>
                <?php echo the_field("short_description");?>
            <?php endif; ?>
        </div>
        <?php if(get_field("distinguished_element") === "embed") : ?>
            <strong class="top-wrapper__embed">[embed]</strong>
        <?php else : ?>
            <img src="<?php echo get_the_post_thumbnail_url($post, "full"); ?>" class="top-wrapper__featured-img">
        <?php endif; ?>
        <div class="top-wrapper__sidebar"><?php include __DIR__ . "/../search.php"; ?></div>
        </div>
    <div class="bottom-wrapper">
        <?php echo the_content(); ?>
    </div>
</section>