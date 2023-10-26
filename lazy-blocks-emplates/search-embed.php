<div class="embed loading" data-search-phrase="<?php echo $attributes['search_phrase']; ?>">
    <div class="swiper">
        <div class="swiper-wrapper">
            <div class="swiper-slide placeholder">
                <div class="page-wrapper">
                    <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/embed-placeholder.png';?>" class="page-img">
                </div>
            </div>
        </div>
        <button class="swiper-button-prev">
            <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>" alt="Strzałka"/>
        </button>
        <button class="swiper-button-next">
            <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>" alt="Strzałka"/>
        </button>
        <div class="swiper__special-buttons">
            <a href title>
                <button class="swiper__leaflet-btn">
                    <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/book.svg';?>" alt="Pełna gazetka"/>
                </button>
            </a>
            <button class="swiper__zoom-in-btn">
                <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/plus.svg';?>" alt="Zbliż"/>
            </button>
            <button class="swiper__zoom-out-btn">
                <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/minus.svg';?>" alt="Oddal"/>
            </button>
        </div>
    </div>
</div>