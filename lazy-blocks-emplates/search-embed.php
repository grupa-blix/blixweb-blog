<div class="embed loading" data-search-phrase="<?php echo $attributes['search_phrase']; ?>">
    <div class="embed__navigation navigation">
        <div class="navigation__name-wrapper navigation__name-wrapper--grid">
            <img class="navigation__brand-logo" alt="" src="" width="40" height="40" />
            <strong class="navigation__brand-name"></strong>
            <div class="navigation__availability-badge availability-badge">
                <div class="availability-badge__dot"></div>
                <span class="availability-badge__label"></span>
            </div>
        </div>
        <div class="navigation__inner-wrapper">
        <div class="navigation__pagination">
            <span class="page-number--current">1</span>/<span class="page-number--total"></span>
        </div>
        </div>
        <div class="navigation__progress-bar">
        <div class="navigation__progress-bar-track">
            <div class="navigation__progress-bar-progress"></div>
        </div>
        </div>
    </div>
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
            <button class="swiper__zoom-in-btn">
                <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/plus.svg';?>" alt="Zbliż"/>
            </button>
            <button class="swiper__zoom-out-btn">
                <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/minus.svg';?>" alt="Oddal"/>
            </button>
        </div>
    </div>
</div>