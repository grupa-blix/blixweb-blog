<?php

$version = "7.1.19";

function deregister_styles()
{
    wp_dequeue_style('global-styles');
}
add_action('wp_enqueue_scripts', 'deregister_styles', 100);

function register_styles()
{
    global $version;
	wp_enqueue_style('shared', get_stylesheet_directory_uri() . "/assets/css/shared.css",'',$version);

    if(is_single() && is_page_template( 'article.php' )){
        wp_enqueue_style('article', get_stylesheet_directory_uri() . "/assets/css/article.css",'',$version);
    }

    if(is_single() && is_page_template( 'recipe.php' )){
        wp_enqueue_style('recipe', get_stylesheet_directory_uri() . "/assets/css/recipe.css",'',$version);
    }

    if(is_page("autorzy")){
        wp_enqueue_style('authors', get_stylesheet_directory_uri() . "/assets/css/authors.css",'',$version);
    }

    if(is_404()){
        wp_enqueue_style('error404', get_stylesheet_directory_uri() . "/assets/css/error404.css",'',$version);
    }
}
add_action('wp_enqueue_scripts', 'register_styles', 100);

function register_scripts()
{
    global $version;
	wp_enqueue_script('shared', get_stylesheet_directory_uri() . "/assets/js/shared.js",'',$version, true);

    if(is_single() && is_page_template( 'article.php' )){
        wp_enqueue_script('article', get_stylesheet_directory_uri() . "/assets/js/article.js",'',$version, true);
        wp_enqueue_script('likes', get_stylesheet_directory_uri() . "/assets/js/likes.js",'',$version, true);
    }

    if(is_single() && is_page_template( 'recipe.php' )){
        wp_enqueue_script('recipe', get_stylesheet_directory_uri() . "/assets/js/recipe.js",'',$version, true);
        wp_enqueue_script('rating', get_stylesheet_directory_uri() . "/assets/js/rating.js",'',$version, true);
        wp_enqueue_script('comments', get_stylesheet_directory_uri() . "/assets/js/comments.js",'',$version, true);
    }
}
add_action('wp_enqueue_scripts', 'register_scripts', 100);

function register_admin_scripts()
{
    global $version;

    if(is_admin() && get_post_type() == "post"){
        wp_enqueue_script('adminSingle', get_stylesheet_directory_uri() . "/assets/js/adminSingle.js",'',$version,true);
    }
}
add_action('admin_enqueue_scripts', 'register_admin_scripts', 100);

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

function set_pagination_base () {
    global $wp_rewrite;
    $wp_rewrite->pagination_base = 'strona';
}
add_action( 'init', 'set_pagination_base' );

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

add_action('rest_api_init', function () {
    register_rest_route( 'blog', 'like/',array(
        'methods'  => 'POST',
        'callback' => 'like_post'
    ));

    register_rest_route( 'blog', 'rate/',array(
        'methods'  => 'POST',
        'callback' => 'rate_post'
    ));

    register_rest_route( 'blog', 'isUserAllowed/',array(
        'methods'  => 'POST',
        'callback' => 'check_recaptcha'
    ));

    register_rest_route( 'blog', 'comment/',array(
        'methods'  => 'POST',
        'callback' => 'comment_post'
    ));
  });

function like_post($request) {
    $data = json_decode($request->get_body(), true);
    $field = (int) get_field('likes', $data['postId']);
    $modifier = (int) $data['modifier'];
    $newValue = $field + $modifier;
    if($newValue < 0) $newValue = 0;
    update_field('likes', $newValue, $data['postId']);
    $response['newValue'] = $newValue;
    $res = new WP_REST_Response($response);
    $res->set_headers(array('Cache-Control' => 'no-cache'));
    $res->set_status(200);
    return $res;
}

function rate_post($request) {
    $data = json_decode($request->get_body(), true);
    $newSum = (int) get_field('rating_sum', $data["postId"]) + $data["rating"];
    $newCount = (int) get_field('rating_count', $data["postId"]) + 1;
    $newRating = number_format($newSum / $newCount, 1);
    update_field('rating_sum', $newSum, $data["postId"]);
    update_field('rating_count', $newCount, $data["postId"]);
    update_field('rating', $newRating, $data["postId"]);
    $response['newRating'] = $newRating;
    $res = new WP_REST_Response($response);
    $res->set_headers(array('Cache-Control' => 'no-cache'));
    $res->set_status(200);
    return $res;
}

function check_recaptcha($request) {
    $data = json_decode($request->get_body(), true);

    $response = file_get_contents(
        "https://www.google.com/recaptcha/api/siteverify?secret=6LfyoAYoAAAAANZzhfiiyJKq0yEurvVHasvW028U&response=" . $data["token"]
    );
    $res = new WP_REST_Response(json_decode($response));
    $res->set_headers(array('Cache-Control' => 'no-cache'));
    $res->set_status(200);
    return $res;
}


function comment_post($request) {
    $data = json_decode($request->get_body(), true);

    $obj = array(
        "comment_post_ID" => $data["comment_post_ID"],
        "comment_author" => $data["comment_author"],
        "comment_content" => $data["comment_content"],
        "comment_parent" => $data["comment_parent"],
        "comment_approved" => 0
    );

    wp_new_comment($obj);

    $res = new WP_REST_Response();
    $res->set_headers(array('Cache-Control' => 'no-cache'));
    $res->set_status(200);
    return $res;
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

/**
 * Filters the title.
 *
 * @param string $title The current page's generated title.
 *
 * @return string The filtered title.
 */
function prefix_filter_title_example( $title ) {
	if(is_single() && in_category('przepisy')){
		$title = get_the_title() . ' - przepis ❇️ | Gotuj z Blix!';
	}elseif(is_category() && get_the_category_by_ID(get_queried_object()->parent) == "Przepisy"){
		$title = get_queried_object()->cat_name . ' - przepisy ❇️ | Gotuj z Blix!';
	}
    return $title;
  }
  add_filter( 'wpseo_title', 'prefix_filter_title_example' );

  /**
 * Filters the description.
 *
 * @param string $description The current page's generated meta description.
 *
 * @return string The filtered meta description.
 */
function prefix_filter_description_example( $description ) {
    if(is_single()){
        if(get_post_meta(get_queried_object()->ID, '_yoast_wpseo_metadesc', true)){
            $description = get_post_meta(get_queried_object()->ID, '_yoast_wpseo_metadesc', true);
        }else{
            $description = get_the_excerpt();
        }
    }

    return $description;
  }
  add_filter( 'wpseo_metadesc', 'prefix_filter_description_example' );


function category_image($image) {
    global $posts;
    if(is_single() && has_post_thumbnail(get_queried_object()->ID)){
        $image = get_the_post_thumbnail_url(null, 'full');
    }else if(is_category() && has_post_thumbnail($posts[0]->ID)){
        $image = get_the_post_thumbnail_url($posts[0], 'full');
    }else if(is_front_page()){
        $category = get_category_by_slug('aktualnosci');
        $args = array(
            'posts_per_page' => 1,
            'cat' => $category->cat_ID,
            'orderby' => 'modified',
        );
        $q = new WP_Query( $args);

        if ( $q->have_posts() ) {
            $image = get_the_post_thumbnail_url($q->posts[0], 'full');
        }
    }
    return $image;
}
add_filter('wpseo_opengraph_image', 'category_image');

  /**
 * Changes the locale output.
 *
 * @param string $locale The current locale.
 *
 * @return string The locale.
 */
function yst_wpseo_change_og_locale( $locale ) {
    return 'pl_PL';
}

add_filter( 'wpseo_locale', 'yst_wpseo_change_og_locale' );

function wpb_set_post_views($postID) {
    $count_key = 'wpb_post_views_count';
    $count = get_post_meta($postID, $count_key, true);
    if($count==''){
        $count = 0;
        delete_post_meta($postID, $count_key);
        add_post_meta($postID, $count_key, '0');
    }else{
        $count++;
        update_post_meta($postID, $count_key, $count);
    }
}
//To keep the count accurate, lets get rid of prefetching
remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);

function str_lreplace($search, $replace, $subject)
{
    $pos = strrpos($subject, $search);

    if($pos !== false)
    {
        $subject = substr_replace($subject, $replace, $pos, strlen($search));
    }

    return $subject;
}

function print_processed_ingredients($string)
{
    $search  = Array("&lt;ul&gt;", "&lt;/ul&gt;", "&lt;li&gt;", "&lt;/li&gt;");
    $replace = Array("", "", '"', '",');

    $t = htmlspecialchars($string);
    $processed_string = str_replace($search, $replace , $t);

    return str_lreplace(',','',$processed_string);
 }

 function print_processed_preparation($string)
{
    $search  = Array("<ol>", "</ol>", "<li>", "</li>");
    $replace = Array("", "", "", "");

    $processed_string = str_replace($search, $replace , $string);

    return $processed_string;
 }

 // Remove tags support from posts
function myprefix_unregister_tags() {
    unregister_taxonomy_for_object_type('post_tag', 'post');
}
add_action('init', 'myprefix_unregister_tags');

add_action('admin_head', 'my_custom_fonts');

function my_custom_fonts() {
  echo '<style>
    .acf-checkbox-list{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }
    .acf-checkbox-list:before, .acf-checkbox-list:after{
        content: none;
    }
    .acf-checkbox-list li {
        order: 2;
    }
    .acf-checkbox-list li:has(.selected) {
        order: 1;
    }
    .acf-checkbox-list .selected {
      font-weight: 700;
      color: red;
    }
  </style>';
}

function redirect_to_primary_category() {
	global $post;
	if ( $post != null && is_single( $post->ID ) ) {
		$cats = get_the_category();

		if ( count( $cats ) > 1 && in_category('przepisy') ) {
			global $wp;
            $url = explode('/', $wp->request);
            array_pop($url);
            $main_category = null;

            foreach($cats as $cat){
                if($cat->parent == 0){
                    $main_category = $cat;
                }
            }

			if ( end($url) != $main_category->slug ) {
				$primary_url = get_category_link($main_category) . $post->post_name;
                echo $primary_url;
				wp_safe_redirect( $primary_url, 301 );
				exit;
			}
		}
	}
}
add_action( 'template_redirect', 'redirect_to_primary_category' );

/*
 * Add here your functions below, and overwrite native theme functions
 */
function wpb_modify_jquery() {
    //check if front-end is being viewed
    if (!is_admin()) {
        // Remove default WordPress jQuery
        wp_deregister_script('jquery');
        // Register new jQuery script via Google Library
        wp_register_script('jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js', false, '2.2.4');
        // Enqueue the script
        wp_enqueue_script('jquery');
    }
}
// Execute the action when WordPress is initialized
add_action('init', 'wpb_modify_jquery');

remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

function custom_remove_subcategories_from_permalink($url, $post) {
    $categories = get_the_category($post->ID);

    if ($categories) {
        // Loop through categories and remove the subcategories
        foreach ($categories as $category) {
            if($category->parent != 0){
                $url = str_replace("/" . $category->slug . "/", "/", $url);
            }
        }
    }

    return $url;
}

add_filter('post_link', 'custom_remove_subcategories_from_permalink', 10, 2);
add_filter('post_type_link', 'custom_remove_subcategories_from_permalink', 10, 2);

add_filter( 'wpseo_primary_term_taxonomies', '__return_empty_array' );

function change_canonical($url) {
    if(is_single()){
        global $post;

        $categories = get_the_category($post->ID);

        if ($categories) {
            // Loop through categories and remove the subcategories
            foreach ($categories as $category) {
                if($category->parent != 0){
                    $url = str_replace("/" . $category->slug . "/", "/", $url);
                }
            }
        }
    }

    return $url;
}
add_filter( 'wpseo_canonical', 'change_canonical' );