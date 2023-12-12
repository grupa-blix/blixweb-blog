<div class="socials<?php if(isset($vars->class)) echo ' ' . $vars->class ?>">
    <?php if(get_field('link_website', 'user_' . $vars->author_id)) : ?>
        <a href="<?php echo the_field('link_website', 'user_' . $vars->author_id); ?>" rel=”nofollow” target="__blank">
            <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/website.svg'; ?>" alt="Strona internetowa">
        </a>
    <?php endif ?>
    <?php if(get_field('link_twitter', 'user_' . $vars->author_id)) : ?>
        <a href="<?php echo the_field('link_twitter', 'user_' . $vars->author_id); ?>" rel=”nofollow” target="__blank">
            <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/twitter.svg'; ?>" alt="Twitter">
        </a>
    <?php endif ?>
    <?php if(get_field('link_facebook', 'user_' . $vars->author_id)) : ?>
        <a href="<?php echo the_field('link_facebook', 'user_' . $vars->author_id); ?>" rel=”nofollow” target="__blank">
            <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/facebook.svg'; ?>" alt="Facebook">
        </a>
    <?php endif ?>
    <?php if(get_field('link_instagram', 'user_' . $vars->author_id)) : ?>
        <a href="<?php echo the_field('link_instagram', 'user_' . $vars->author_id); ?>" rel=”nofollow” target="__blank">
            <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/instagram.svg'; ?>" alt="Instagram">
        </a>
    <?php endif ?>
</div>
<?php unset($vars); ?>