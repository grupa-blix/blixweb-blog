<section class="section">
    <?php if (isset($vars->header)) : ?><h2><?php echo $vars->header; ?></h2><?php endif ?>
    <div class="section__items section__items--articles">
        <?php foreach ($vars->elements as $element) : ?>
            <article class="article section__item">
                <a href="<?php echo get_permalink($element); ?>">
                    <div class="article__img-wrapper">
                        <?php
                        if(in_category('przepisy', $element)){
                            $alt = 'Przepis na ' . strtolower($element->post_title);
                        }else{
                            $alt = $element->post_title;
                        }
                        ?>
                        <?php echo get_the_post_thumbnail($element, 'large', ['class' => 'article__img', 'loading' => 'lazy', 'alt' => $alt]) ?>
                        <button class="article__btn-cta button">
                            <i class="icon-eye"></i>
                            <span>Zobacz</span>
                        </button>
                    </div>
                    <div class="article__info">
                        <?php
                        if (term_exists(yoast_get_primary_term('category', $element))) {
                            $main_category = get_term(yoast_get_primary_term_id('category', $element));
                        } else {
                            $post_categories = get_the_category($element);
                            usort($post_categories, function($a, $b) {
                                return $a->term_id - $b->term_id;
                             });

                            $main_category = $post_categories[0];
                        }
                        ?>
                        <span class="article__category"><?php echo $main_category->name ?></span>
                        <h4 class="article__name"><?php echo $element->post_title ?></h4>
                        <div class="article__details details">
                            <div class="details__date"><?php echo get_the_modified_date('d.m.Y', $element); ?></div>
                            <div class="details__inner-wrapper">
                                <?php if(get_field('likes', $element->ID)) : ?>
                                    <div class="details__likes">
                                        <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/like.svg'; ?>" loading="lazy" alt="Polubienia"/>
                                        <span><?php echo the_field('likes', $element->ID); ?></span>
                                    </div>
                                <?php endif ?>
                                <?php if(get_field('rating', $element->ID) && get_field('rating_count', $element->ID) != 0) : ?>
                                    <div class="details__rating">
                                        <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/rate.svg'; ?>" loading="lazy" alt="Ocena"/>
                                        <span><?php echo number_format(get_field('rating', $element->ID), 1)?></span>
                                    </div>
                                <?php endif; ?>
                                <?php if(get_comments_number($element) > 0) : ?>
                                    <div class="details__comments">
                                        <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/comment.svg'; ?>" loading="lazy" alt="Liczba komentarzy"/>
                                        <span><?php echo get_comments_number($element); ?></span>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        <?php endforeach; ?>
    </div>
</section>

<?php unset($vars); ?>
<?php wp_reset_postdata(); ?>