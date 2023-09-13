<?php
$post_categories = get_the_category($post);
$top_category = get_term(1229);

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
                    'posts_per_page' => 9
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
                <?php endwhile; ?>
                <?php wp_reset_query() ?>
        </div>
    </div>
    <div class="main">
        <div class="top-wrapper">
            <h1 class="top-wrapper__title"><?php echo $post->post_title; ?></h1>
            <div class="top-wrapper__pills pills">
                <div class="pills__wrapper">
                    <div class="pills__track">
                        <div class="pills__overlay pills__overlay--left">
                            <button class="pills__button pills__button--left">
                                <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>" />
                            </button>
                        </div>
                        <a href="<?php echo get_category_link($top_category); ?>" class="pill pill--main"><?php echo $top_category->name; ?></a>
                        <?php foreach ($post_categories as $category) :
                            if ($category->term_id != $top_category->term_id) : ?>
                                <a href="<?php echo get_category_link($category); ?>" class="pill"><?php echo $category->name; ?></a>
                        <?php endif; endforeach; ?>
                        <div class="pills__overlay pills__overlay--right">
                            <button class="pills__button pills__button--right">
                                <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>" />
                            </button>
                        </div>
                    </div>
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

            <div class="top-wrapper__data">
                <?php if(get_field('rating') && get_field('rating_count') != 0) : ?>
                    <div class="data__rating">
                        <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/rate.svg'; ?>" />
                        <span><?php echo number_format(get_field('rating'), 1)?></span>
                    </div>
                <?php endif; ?>
                <?php if(get_comments_number($post) > 0) : ?>
                    <div class="data__comments">
                        <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/comment.svg'; ?>" />
                        <span><?php echo count(get_comments($post)); ?></span>
                    </div>
                <?php endif; ?>
                <?php echo get_the_date('d.m.Y'); ?></div>
            <div class="top-wrapper__content"><?php echo the_content(); ?></div>
            <div class="top-wrapper__contents contents">
                <span>Spis treści:</span>
                <ol class="contents__list">
                    <li data-scroll-element="ingredients"><a href="#składniki">Składniki</a></li>
                    <li data-scroll-element="promotions"><a href="#promocje-na-składniki">Promocje na składniki</a></li>
                    <li data-scroll-element="preparation"><a href="#jak-zrobić-<?php echo $post->post_name; ?>">Jak zrobić <?php echo the_title(); ?></a></li>
                    <li data-scroll-element="tips"><a href="#wskazówki">Wskazówki</a></li>
                </ol>
            </div>
        </div>

        <div class="bottom-wrapper">
            <div id="składniki" class="bottom-wrapper__ingredients" data-scroll="ingredients">
                <div class="bottom-wrapper__ingredients-inner-wrapper">
                    <h2>Składniki</h2>
                    <?php echo the_field("ingredients"); ?>
                </div>
            </div>
            <div id="promocje-na-składniki" class="bottom-wrapper__embed" data-scroll="promotions">
                <h2>Promocje na składniki</h2>
                <div class="bottom-wrapper__embed-pills pills">
                    <div class="pills__wrapper">
                        <div class="pills__track">
                            <div class="pills__overlay pills__overlay--left">
                                <button class="pills__button pills__button--left">
                                    <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>" />
                                </button>
                            </div>

                            <div class="pills__overlay pills__overlay--right">
                                <button class="pills__button pills__button--right">
                                    <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <?php include __DIR__ . '/../embed.php' ?>
            </div>
            <div id="jak-zrobić-<?php echo $post->post_name; ?>" class="bottom-wrapper__preparation" data-scroll="preparation">
                <h2>Jak zrobić <?php echo $post->post_title; ?></h2>
                <?php echo the_field("preparation"); ?>
            </div>
            <div id="wskazówki" class="bottom-wrapper__tips" data-scroll="tips">
                <h2>Wskazówki</h2>
                <?php echo the_field("tips"); ?>
            </div>
            <div class="bottom-wrapper__engagement">
                <h2>Podoba Ci się ten artykuł?</h2>
                <div class="engagement-wrapper">
                    <div class="rating" data-post-id="<?php echo $post->ID; ?>">
                        <div class="rating__wrapper">
                            <?php
                            $progressPercentage = number_format(get_field('rating'), 1) * 20;
                            if(floor(get_field('rating')) * 4 > 16){
                                $spacing = 16;
                            }else{
                                $spacing = floor(get_field('rating')) * 4;
                            }
                            $progress = ($progressPercentage / 100) * 104 + $spacing;
                            ?>
                            <div class="rating__bg">
                                <div class="rating__progress" style="width:<?php echo $progress . "px"?>"></div>
                                <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/stars-bg.svg'; ?>">
                            </div>
                            <div class="rating__btns-wrapper">
                                <button class="star" data-rating="1"></button>
                                <button class="star" data-rating="2"></button>
                                <button class="star" data-rating="3"></button>
                                <button class="star" data-rating="4"></button>
                                <button class="star" data-rating="5"></button>
                            </div>
                        </div>
                        <span class="rating__value">
                            <?php
                                if(get_field('rating') != 0){
                                    echo number_format(get_field('rating'), 1);
                                }else{
                                    echo 'Oceń';
                                }
                            ?>
                        </span>
                    </div>
                    <div class="share">
                        <button class="share__btn">
                            <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/share.svg'; ?>" />
                        </button>
                        <span>Udostępnij</span>
                    </div>
                    <div class="comments">
                        <button class="comments__btn">
                            <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/comment.svg'; ?>" />
                        </button>
                        <span>Komentarze</span>
                    </div>
                </div>
            </div>
            <div class="bottom-wrapper__author">
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
    </div>
</section>
<?php include __DIR__ . "/../comments.php"; ?>
<?php include __DIR__ . "/../share.php"; ?>
<?php wp_reset_postdata(); ?>