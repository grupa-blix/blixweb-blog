<section class="section section--gray with-overflow">
    <div class="section__header-wrapper">
      <<?php echo $attributes['header-type']; ?>><?php echo $attributes['header']; ?></<?php echo $attributes['header-type']; ?>>
        <a href="<?php echo $attributes['link']; ?>">
          <button class="section__btn-cta-top button">Zobacz więcej</button>
        </a>
    </div>
    <div class="swiper section__swiper section__swiper--products" data-ga-label="<?php echo $attributes['ga-label']; ?>">
        <div class="swiper-wrapper section__items section__items--horizontal">
            <?php for ($i = 1; $i <= $attributes['max']; $i++) : ?>
                <div class="swiper-slide">
                  <a href class="product__link">
                      <div class="product section__item loading">
                          <div class="product__img-wrapper shimmer">
                              <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/product-placeholder.png'; ?>" alt class="product__img" width="220" height="220" loading="lazy">
                              <button class="product__btn-cta button">
                                  <i class="icon-eye"></i>
                                  <span>Zobacz</span>
                              </button>
                          </div>
                          <span class="product__name shimmer">Produkt <?php echo $i; ?></span>
                          <span class="product__price shimmer">Cena <?php echo $i; ?></span>
                      </div>
                  </a>
                </div>
            <?php endfor ?>
        </div>
        <div class="swiper-button swiper-button-prev">
            <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg'; ?>" alt="Strzałka" loading="lazy">
        </div>
        <div class="swiper-button swiper-button-next">
            <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg'; ?>" alt="Strzałka" loading="lazy">
        </div>
        <div class="swiper-scrollbar">
            <div class="swiper-scrollbar__bg"></div>
        </div>
    </div>
    <a href="<?php echo $attributes['link']; ?>">
      <button class="section__btn-cta-bottom button">Zobacz więcej</button>
    </a>
</section>