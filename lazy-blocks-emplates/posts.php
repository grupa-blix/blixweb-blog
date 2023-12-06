<?php
global $post;
$category = get_category_by_slug( $attributes['category'] );
$args = array(
  'post_type' => 'post',
  'orderby' => 'modified',
  'post_status' => 'publish',
  'order' => 'DESC',
  'cat' => $category->cat_ID,
  'posts_per_page' => $attributes['posts-count']
);

$result = new WP_Query( $args );

if ( $result-> have_posts() ) : ?>

<section class="section">
    <div class="section__header-wrapper">
      <<?php echo $attributes['header-type']; ?>><?php echo $attributes['header']; ?></<?php echo $attributes['header-type']; ?>>
        <a href="<?php echo $attributes['link']; ?>">
          <button class="section__btn-cta-top button">Zobacz więcej</button>
        </a>
    </div>
    <div class="section__items section__items--articles">
        <?php
        $i=0;
        while ( $result->have_posts() ) : $result->the_post() ?>
          <article class="article section__item<?php if($i == 0 and $attributes['first-post-distinguished']) echo ' article--distinguished'?>">
              <a href="<?php echo get_permalink(); ?>">
                <div class="article__img-wrapper">
                    <?php
                      if($attributes['category'] == 'przepisy'){
                        $alt = 'Przepis na ' . strtolower($post->post_title);
                      }else{
                        $alt = $post->post_title;
                      }
                    ?>
                    <?php if(has_post_thumbnail($post)){
                      if($i == 0 and $attributes['first-post-distinguished']) :
                        echo get_the_post_thumbnail(null, 'large', ['class' => 'article__img', 'loading' => false, 'alt' => $alt]);
                      else :
                        echo get_the_post_thumbnail(null, 'large', ['class' => 'article__img', 'loading' => 'lazy', 'alt' => $alt]);
                      endif;
                    }else { ?>
                        <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/blix-placeholder.jpg'; ?>" class="article__img" width="800" height="600" loading="lazy" />
                    <?php } ?>
                    <button class="article__btn-cta button">
                        <i class="icon-eye"></i>
                        <span>Zobacz</span>
                    </button>
                </div>
                <div class="article__info">
                    <?php
                        $post_categories = get_the_category($element);
                        $main_category = $post_categories[0];
                        foreach($post_categories as $category) {
                            if($category->parent == 0){
                                $main_category = $category;
                            }
                         };
                    ?>
                    <span class="article__category"><?php echo $main_category->name; ?></span>
                    <h4 class="article__name"><?php echo the_title() ?></h4>
                    <div class="article__details details">
                        <div class="details__date"><?php echo get_the_modified_date('d.m.Y', $post); ?></div>
                        <div class="details__inner-wrapper">
                          <?php if(get_field('likes', $post->ID)) : ?>
                            <div class="details__likes">
                                <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/like.svg'; ?>" loading="lazy" alt="Polubienia"/>
                                <span><?php echo the_field('likes', $post->ID); ?></span>
                            </div>
                          <?php endif ?>
                          <?php if(get_field('rating', $post->ID) && get_field('rating_count', $post->ID) != 0) : ?>
                            <div class="details__rating">
                              <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/rate.svg'; ?>" loading="lazy" alt="Ocena"/>
                              <span><?php echo number_format(get_field('rating', $post->ID), 1)?></span>
                            </div>
                          <?php endif; ?>
                          <?php if(get_comments_number($post) > 0) : ?>
                            <div class="details__comments">
                              <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/comment.svg'; ?>" loading="lazy" alt="Liczba komentarzy"/>
                              <span><?php echo get_comments_number($post); ?></span>
                            </div>
                          <?php endif; ?>
                        </div>
                    </div>
                </div>
              </a>
          </article>
        <?php $i++; endwhile; ?>
    </div>
    <a href="<?php echo $attributes['link']; ?>">
      <button class="section__btn-cta-bottom button">Zobacz więcej</button>
    </a>
</section>

<?php endif;

wp_reset_postdata(); ?>