<?php

function wps_deregister_styles()
{
    wp_dequeue_style('global-styles');
}
add_action('wp_enqueue_scripts', 'wps_deregister_styles', 100);

function register_menus()
{
    register_nav_menus(
        array(
            'main' => __('Main'),
            'footer_upper' => __('Footer Upper'),
            'footer_lower' => __('Footer Lower'),
        )
    );
}
add_action('init', 'register_menus');

function wpbeginner_numeric_posts_nav()
{

    if (is_singular())
        return;

    global $wp_query;

    /** Stop execution if there's only 1 page */
    if ($wp_query->max_num_pages <= 1)
        return;

    $paged = get_query_var('paged') ? absint(get_query_var('paged')) : 1;
    $max   = intval($wp_query->max_num_pages);

    /** Add current page to the array */
    if ($paged >= 1)
        $links[] = $paged;

    /** Add the pages around the current page to the array */
    if ($paged >= 3) {
        $links[] = $paged - 1;
        $links[] = $paged - 2;
    }

    if (($paged + 2) <= $max) {
        $links[] = $paged + 2;
        $links[] = $paged + 1;
    }

    echo '<div class="pagination">' . "\n";

    /** Link to first page, plus ellipses if necessary */
    echo ('<a href="' . esc_url(get_pagenum_link(1)) . '"><button class="pagination-btn pagination-btn--first"><img src="' . get_stylesheet_directory_uri() . '/assets/img/pagination-start.svg" alt="Pierwsza strona"></button></a>');

    /** Previous Post Link */
    if (get_previous_posts_link()) {
        echo ('<a href="' . esc_url(get_previous_posts_page_link()) . '"><button class="pagination-btn pagination-btn--prev"><img src="' . get_stylesheet_directory_uri() . '/assets/img/pagination-caret.svg" alt="Ostatnia strona"></button></a>');
    } else {
        echo ('<button class="pagination-btn pagination-btn--prev"><img src="' . get_stylesheet_directory_uri() . '/assets/img/pagination-caret.svg" alt="Ostatnia strona"></button>');
    }

    echo ('<div><span class="offers__pagination-current-page">' . $paged . '</span> z <span class="offers__pagination-total-pages">' . $max . '</span></div>');

    /** Next Post Link */
    if (get_next_posts_link()) {
        echo ('<a href="' . esc_url(get_next_posts_page_link()) . '"><button class="pagination-btn pagination-btn--next"><img src="' . get_stylesheet_directory_uri() . '/assets/img/pagination-caret.svg" alt="Ostatnia strona"></button></a>');
    } else {
        echo ('<button class="pagination-btn pagination-btn--next"><img src="' . get_stylesheet_directory_uri() . '/assets/img/pagination-caret.svg" alt="Ostatnia strona"></button>');
    }

    /** Link to last page, plus ellipses if necessary */
    echo ('<a href="' . esc_url(get_pagenum_link($max)) . '"><button class="pagination-btn pagination-btn--end"><img src="' . get_stylesheet_directory_uri() . '/assets/img/pagination-end.svg" alt="Ostatnia strona"></button></a>');

    echo '</div>' . "\n";
}

/*remove term descriptions from post editor */

function wpse_hide_cat_descr()
{ ?>

    <style type="text/css">
        .term-description-wrap {
            display: none;
        }
    </style>

<?php }

add_action('admin_head-term.php', 'wpse_hide_cat_descr');
add_action('admin_head-edit-tags.php', 'wpse_hide_cat_descr');

function disallow_insert_term($term, $taxonomy)
{

    $user = wp_get_current_user();

    if ($taxonomy === 'post_tag' && in_array('author', $user->roles)) {

        return new WP_Error(
            'disallow_insert_term',
            __('Your role does not have permission to add terms to this taxonomy')
        );
    }

    return $term;
}

add_filter('pre_insert_term', 'disallow_insert_term', 10, 2);

add_action("wp_ajax_article_like", "article_like");
add_action("wp_ajax_nopriv_article_like", "article_like");

function article_like() {
    update_field('likes', 28, 15611);
    die();
}

add_action( 'init', 'my_script_enqueuer' );

function my_script_enqueuer() {
   wp_register_script( "likes_script", get_stylesheet_directory_uri().'/assets/js/likes.js', array('jquery') );
   wp_localize_script( 'likes_script', 'myAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' )));

   wp_enqueue_script( 'jquery' );
//    wp_enqueue_script( 'likes_script' );

}