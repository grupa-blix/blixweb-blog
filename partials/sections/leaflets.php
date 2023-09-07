<section class="section section--gray with-overflow">
    <div class="section__header-wrapper">
        <h2><?php echo $header; ?></h2>
        <a href="https://blix.pl/">
          <button class="section__btn-cta-top button">Zobacz więcej</button>
        </a>
    </div>
    <div class="swiper section__swiper section__swiper--leaflets" data-leaflets="<?php echo $leaflets; ?>">
        <div class="swiper-wrapper section__items section__items--horizontal">
            <?php for ($i = 1; $i <= 12; $i++) : ?>
                <div class="swiper-slide">
                    <div class="leaflet section__item loading">
                        <a href class="leaflet__link" title>
                            <div class="leaflet__cover-wrapper shimmer">
                                <picture class="leaflet__cover">
                                    <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/leaflet-cover-placeholder.png'; ?>" alt title width="360" height="510">
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
                                <img class="leaflet__brand-logo brand-logo lazyload loaded" src="<?php echo get_stylesheet_directory_uri() . '/assets/img/brand-logo-placeholder.png'; ?>" alt title>
                                <h6 class="leaflet__brand-name">Nazwa brandu</h6>
                                <span class="leaflet__leaflet-name">Nazwa gazetki</span>
                            </div>
                        </a>
                    </div>
                </div>
            <?php endfor ?>
        </div>
        <div class="swiper-button swiper-button-prev">
            <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg'; ?>" alt>
        </div>
        <div class="swiper-button swiper-button-next">
            <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg'; ?>" alt>
        </div>
        <div class="swiper-scrollbar">
            <div class="swiper-scrollbar__bg"></div>
        </div>
    </div>
    <a href="https://blix.pl/">
      <button class="section__btn-cta-bottom button">Zobacz więcej</button>
    </a>
</section>
<?php unset($header); ?>
<?php unset($leaflets); ?>