<section class="section">
    <?php if (isset($vars->header)) : ?><h1><?php echo $vars->header; ?></h1><?php endif ?>
    <div class="section__items section__items--articles">
        <?php foreach ($vars->elements as $element) : ?>
            <article class="article section__item">
                <a href="<?php echo get_permalink($element); ?>">
                    <div class="article__img-wrapper">
                        <?php echo get_the_post_thumbnail($element, 'large', ['class' => 'article__img']) ?>
                        <button class="article__btn-cta button">
                            <i class="icon-eye"></i>
                            <span>Zobacz</span>
                        </button>
                    </div>
                    <div class="article__info">
                        <span class="article__category"><?php echo get_the_category($element)[0]->name ?></span>
                        <span class="article__name"><?php echo $element->post_title ?></span>
                        <span class="article__details"><?php echo get_the_date('d.m.Y', $element) ?></span>
                    </div>
                </a>
            </article>
        <?php endforeach; ?>
    </div>
</section>

<?php unset($vars); ?>
<?php wp_reset_postdata(); ?>