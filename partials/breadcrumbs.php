<section class="section pb-0">
    <div class="breadcrumbs__outer">
        <div class="breadcrumbs ">
            <ul class="breadcrumbs__steps">
                <li class="breadcrumbs__step">
                    <a href="https://blix.pl/">
                        <span class="d-lg-none"><i class="icon-home"></i></span>
                        <span class="d-none d-lg-inline">Blix</span>
                    </a>
                </li>
                <li class="breadcrumbs__step">
                    <a href="<?php echo get_home_url(); ?>">Blog</a>
                </li>
                <?php if (is_category()) :
                    $ancestors = get_ancestors(get_queried_object()->term_id, 'category');

                    foreach ($ancestors as $ancestor) :
                        $category = get_category($ancestor); ?>
                        <li class="breadcrumbs__step">
                            <a href="<?php echo get_category_link($category); ?>"><?php echo $category->cat_name; ?></a>
                        </li>
                    <?php endforeach; ?>
                    <li class="breadcrumbs__step">
                        <a href="<?php echo get_category_link(get_queried_object()); ?>"><?php echo get_queried_object()->cat_name; ?></a>
                    </li>
                <?php elseif (is_single()) :
                    $post_categories = get_the_category($post);

                    usort($post_categories, function($a, $b) {
                        return $a->term_id - $b->term_id;
                     });

                    if (term_exists(yoast_get_primary_term())) {
                        $main_category = get_term(yoast_get_primary_term_id('category', $post->id));
                    } else {
                        $main_category = $post_categories[0];
                    }

                    $ancestors = get_ancestors($main_category->term_id, 'category');

                    foreach ($ancestors as $ancestor) :
                        $category = get_category($ancestor); ?>
                        <li class="breadcrumbs__step">
                            <a href="<?php echo get_category_link($category); ?>"><?php echo $category->cat_name; ?></a>
                        </li>
                    <?php endforeach; ?>
                    <li class="breadcrumbs__step">
                        <a href="<?php echo get_category_link($main_category); ?>"><?php echo $main_category->name; ?></a>
                    </li>
                    <li class="breadcrumbs__step">
                        <a href="<?php echo get_permalink($post); ?>"><?php echo $post->post_title; ?></a>
                    </li>
                <?php elseif (is_search()) : ?>
                    <li class="breadcrumbs__step">
                        <a href="<?php echo $_SERVER['REQUEST_URI'] ?>">Wyniki wyszukiwania</a>
                    </li>
                <?php elseif (is_page('autorzy')) : ?>
                    <li class="breadcrumbs__step">
                        <a href="/autorzy">Autorzy</a>
                    </li>
                <?php elseif (is_author()) : ?>
                    <li class="breadcrumbs__step">
                        <a href="/autorzy">Autorzy</a>
                    </li>
                    <li class="breadcrumbs__step">
                        <a href="<?php echo get_author_posts_url(get_the_author_meta('ID')); ?>">
                            <?php echo get_the_author_meta('display_name') ?>
                        </a>
                    </li>
                <?php endif ?>
            </ul>
        </div>
    </div>
</section>