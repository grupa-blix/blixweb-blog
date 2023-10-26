<div class="section section--gray with-overflow section--leaflets">
    <div class="section__header-wrapper">
      <<?php echo $attributes['header-type']; ?>>Zobacz gazetki z kategorii <?php echo $attributes["category"]["label"]; ?></<?php echo $attributes['header-type']; ?>>
        <a href="<?php echo 'https://blix.pl/sklepy/' . $attributes["category"]["value"]; ?>">
          <button class="section__btn-cta-top button">Zobacz więcej</button>
        </a>
    </div>
    <div class="swiper section__swiper section__swiper--leaflets section__swiper--leaflets-small" data-leaflets="category" data-category="<?php echo $attributes["category"]["value"]; ?>" data-ga-label="article-single-categoryblock-leaflets">
        <div class="swiper-wrapper section__items section__items--horizontal">
            <?php for ($i = 1; $i <= $attributes['max']; $i++) : ?>
              <div class="swiper-slide">
                <div class="leaflet section__item loading">
                    <a href class="leaflet__link" title>
                        <div class="leaflet__cover-wrapper shimmer">
                          <picture class="leaflet__cover">
                              <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/leaflet-cover-placeholder.png'; ?>" alt title width="360" height="510" loading="lazy" >
                          </picture>
                          <button class="leaflet__btn-cta button">
                              <i class="icon-eye"></i>
                              <span>Zobacz</span>
                          </button>
                        </div>
                        <div class="leaflet__availability availability lav-active shimmer">
                            <div class="availability__dot"></div>
                            <span class="availability__label">Dostępność gazetki</span>
                        </div>
                        <div class="leaflet__info shimmer">
                            <img class="leaflet__brand-logo brand-logo lazyload loaded" src="<?php echo get_stylesheet_directory_uri() . '/assets/img/brand-logo-placeholder.png'; ?>" alt title loading="lazy">
                            <h6 class="leaflet__brand-name">Nazwa brandu</h6>
                            <span class="leaflet__leaflet-name">Nazwa gazetki</span>
                        </div>
                      </a>
                </div>
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
    <a href="<?php echo 'https://blix.pl/sklep/' . $attributes["category"]["value"]; ?>">
      <button class="section__btn-cta-bottom button">Zobacz więcej</button>
    </a>
</div>