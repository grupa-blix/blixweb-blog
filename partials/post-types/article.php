<?php $main_category = get_the_category($post)[0]; ?>
<section class="section article-info">
    <div class="sidebar">
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
                    'posts_per_page' => 8
                );

                $result = new WP_Query($args);

                while ( $result->have_posts() ) : $result->the_post() ?>
                    <div class="single-post">
                        <a href="<?php echo get_permalink(); ?>">
                            <?php echo get_the_post_thumbnail(null, 'thumbnail', ['class' => 'single-post__img', 'loading' => 'lazy']) ?>
                            <div class="single-post__data">
                                <span class="single-post__title"><?php echo the_title(); ?></span>
                                <span class="single-post__date"><?php echo get_the_date('d.m.Y', $post); ?></span>
                            </div>
                        </a>
                    </div>
                <?php endwhile;
                wp_reset_postdata(); ?>
        </div>
    </div>
    <div class="main">
        <h1 class="main__title"><?php echo the_title(); ?></h1>
        <div class="main__details details">
            <div class="details__date"><?php echo get_the_date('d.m.Y'); ?></div>
            <div class="details__likes hidden">
                <div class="likes-icon"></div>
                <span><?php echo the_field('likes', $post->ID); ?></span>
            </div>
        </div>
        <div class="main__pills pills">
            <div class="pills__track">
                <div class="pills__overlay pills__overlay--left">
                    <button class="pills__button pills__button--left">
                        <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>" />
                    </button>
                </div>
                <a href="<?php echo get_category_link($main_category) ?>" class="pill pill--main"><?php echo $main_category->name; ?></a>
                <div class="pills__overlay pills__overlay--right">
                    <button class="pills__button pills__button--right">
                        <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>" />
                    </button>
                </div>
            </div>
        </div>
        <div class="main__short-description">
            <?php if(get_field("short_description")) : ?>
                <?php echo the_field("short_description");?>
            <?php endif; ?>
        </div>
        <?php
            if(get_field("distinguished_element") === "embed") :
                $type = get_field( 'embed_type' )['value'];

                if($type === "brand") :
                    $brand = get_field( 'related_brand' )['value'];
                    $leafletId = get_field( 'leaflet_ID' );

                    include __DIR__ . '/../embed.php';
                elseif ($type == "search") :
                    $searchPhrase = get_field( 'search_phrase' );

                    if($searchPhrase != '') include __DIR__ . '/../embed.php';
                endif;
            else : ?>
            <img src="<?php echo get_the_post_thumbnail_url($post, "full"); ?>" class="main__featured-img">
        <?php endif; ?>
        <div class="main__contents contents d-none">
            <span>Spis treści:</span>
            <ul class="contents__list"></ul>
        </div>
        <div class="main__content content">
            <?php the_content(); ?>
        </div>
        <div class="main__engagement">
            <h2>Podoba Ci się ten artykuł?</h2>
            <div class="engagement-wrapper">
                <div class="likes" data-post-id="<?php echo $post->ID?>">
                    <button class="likes__btn"></button>
                    <span class="value hidden"><?php echo the_field('likes'); ?></span>
                </div>
                <div class="share">
                    <button class="share__btn">
                        <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/share.svg'; ?>" />
                    </button>
                    <span>Udostępnij</span>
                </div>
            </div>
        </div>
        <div class="main__author">
            <?php echo get_avatar(get_the_author_meta('ID'), 96); ?>
            <span>Autor: </span>
            <a href="<?php echo get_author_posts_url(get_the_author_meta('ID')); ?>">
                <?php echo get_the_author_meta('display_name') ?>
            </a>
            <?php
            $vars = (object) [
                'class' => 'socials--small',
                'author_id' => get_the_author_meta('ID')
            ];
            include __DIR__ . '/../socials.php' ?>
        </div>
    </div>
</section>
<?php include __DIR__ . "/../share.php"; ?>
<?php wp_reset_postdata(); ?>