<?php

function deregister_styles()
{
    wp_dequeue_style('global-styles');
}
add_action('wp_enqueue_scripts', 'deregister_styles', 100);

function register_styles()
{
	wp_enqueue_style('shared', get_stylesheet_directory_uri() . "/assets/css/shared.css");

    if(is_single() && in_category("aktualnosci")){
        wp_enqueue_style('article', get_stylesheet_directory_uri() . "/assets/css/article.css");
    }

    if(is_single() && in_category("przepisy")){
        wp_enqueue_style('recipe', get_stylesheet_directory_uri() . "/assets/css/recipe.css");
    }

    if(is_page("autorzy")){
        wp_enqueue_style('authors', get_stylesheet_directory_uri() . "/assets/css/authors.css");
    }
}
add_action('wp_enqueue_scripts', 'register_styles', 100);

function register_scripts()
{
	wp_enqueue_script('shared', get_stylesheet_directory_uri() . "/assets/js/shared.js",'','',true);

    if(is_single() && in_category("aktualnosci")){
        wp_enqueue_script('article', get_stylesheet_directory_uri() . "/assets/js/article.js",'','',true);

        wp_register_script( "likes_script", get_stylesheet_directory_uri().'/assets/js/likes.js','','', array(
        'strategy'  => 'defer',
        'in_footer' => true,
        ));
        wp_localize_script( 'likes_script', 'myAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' )));

        wp_enqueue_script( 'likes_script' );
    }

    if(is_single() && in_category("przepisy")){
        wp_enqueue_script('recipe', get_stylesheet_directory_uri() . "/assets/js/recipe.js",'','',true);

        wp_register_script( "rating_script", get_stylesheet_directory_uri().'/assets/js/rating.js','','', array(
        'strategy'  => 'defer',
        'in_footer' => true,
        ));
        wp_localize_script( 'rating_script', 'myAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' )));

        wp_register_script( "comments", get_stylesheet_directory_uri().'/assets/js/comments.js','','', array(
        'strategy'  => 'defer',
        'in_footer' => true,
        ));
        wp_localize_script( 'comments', 'myAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' )));

        wp_enqueue_script( 'rating_script' );
        wp_enqueue_script( 'comments' );
    }
}
add_action('wp_enqueue_scripts', 'register_scripts', 100);

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
    header("Content-type:application/json");
    $field = (int) get_field('likes', $_POST["postId"]);
    $modifier = (int) $_POST["newValue"];
    $newValue = $field + $modifier;
    update_field('likes', $newValue, $_POST["postId"]);
    echo the_field('likes', $_POST["postId"]);
    die();
}

add_action("wp_ajax_recipe_rating", "recipe_rating");
add_action("wp_ajax_nopriv_recipe_rating", "recipe_rating");

function recipe_rating() {
    header("Content-type:application/json");
    $newSum = (int) get_field('rating_sum', $_POST["postId"]) + $_POST["rating"];
    $newCount = (int) get_field('rating_count', $_POST["postId"]) + 1;
    $newRating = number_format($newSum / $newCount, 1);
    update_field('rating_sum', $newSum, $_POST["postId"]);
    update_field('rating_count', $newCount, $_POST["postId"]);
    update_field('rating', $newRating, $_POST["postId"]);
    echo the_field('rating', $_POST["postId"]);
    die();
}

add_action("wp_ajax_recaptcha", "recaptcha");
add_action("wp_ajax_nopriv_recaptcha", "recaptcha");

function recaptcha() {
    $response = file_get_contents(
        "https://www.google.com/recaptcha/api/siteverify?secret=6LfyoAYoAAAAANZzhfiiyJKq0yEurvVHasvW028U&response=" . $_POST["recaptcha"]
    );

    echo json_encode(json_decode($response));
    die();
}

add_action("wp_ajax_recipe_comment", "recipe_comment");
add_action("wp_ajax_nopriv_recipe_comment", "recipe_comment");

function recipe_comment() {
    header("Content-type:application/json");
    $obj = array(
        "comment_post_ID" => $_POST["comment_post_ID"],
        "comment_author" => $_POST["comment_author"],
        "comment_content" => $_POST["comment_content"],
        "comment_parent" => $_POST["comment_parent"],
        "comment_approved" => 0
    );

    wp_insert_comment($obj);
    echo json_encode($obj);
    die();
}

// This will suppress empty email errors when submitting the user form
add_action('user_profile_update_errors', 'my_user_profile_update_errors', 10, 3 );
function my_user_profile_update_errors($errors, $update, $user) {
    $errors->remove('empty_email');
}

// This will remove javascript required validation for email input
// It will also remove the '(required)' text in the label
// Works for new user, user profile and edit user forms
add_action('user_new_form', 'my_user_new_form', 10, 1);
add_action('show_user_profile', 'my_user_new_form', 10, 1);
add_action('edit_user_profile', 'my_user_new_form', 10, 1);
function my_user_new_form($form_type) {
    ?>
    <script type="text/javascript">
        jQuery('#email').closest('tr').removeClass('form-required').find('.description').remove();
        // Uncheck send new user email option by default
        <?php if (isset($form_type) && $form_type === 'add-new-user') : ?>
            jQuery('#send_user_notification').removeAttr('checked');
        <?php endif; ?>
    </script>
    <?php
}

function custom_author_base() {
    global $wp_rewrite;
    $wp_rewrite->author_base = 'autor';
}
add_action( 'init', 'custom_author_base' );
