<form method="get" action="<?php echo home_url(); ?>" role="search" class="article-search">
  <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/search-icon.svg'; ?>" alt="Wyszukaj artykuł">
  <input type="text" placeholder="<?php echo esc_attr_x('Wyszukaj artyuł...', 'placeholder') ?>" value="<?php echo get_search_query() ?>" name="s" title="<?php echo esc_attr_x('Wyszukaj artyuł...', 'label') ?>" />
</form>