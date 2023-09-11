<div class="embed loading" <?php if(isset($brand)) echo 'data-brand-slug="' . $brand . '"' ?> <?php if(isset($leafletId) && $leafletId != null) echo 'data-leaflet-id="' . $leafletId . '"' ?> <?php if(isset($searchPhrase)) echo 'data-search-phrase="' . $searchPhrase . '"' ?> >
    <div class="swiper">
        <div class="swiper-wrapper">
            <div class="swiper-slide placeholder">
                <div class="page-wrapper">
                    <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/embed-placeholder.png';?>" class="page-img">
                </div>
            </div>
        </div>
        <button class="swiper-button-prev">
            <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>"/>
        </button>
        <button class="swiper-button-next">
            <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>"/>
        </button>
        <div class="swiper__special-buttons">
            <a href target="__blank">
                <button class="swiper__leaflet-btn">
                    <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/book.svg';?>"/>
                </button>
            </a>
            <button class="swiper__zoom-in-btn">
                <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/plus.svg';?>"/>
            </button>
            <button class="swiper__zoom-out-btn">
                <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/minus.svg';?>"/>
            </button>
        </div>
    </div>
</div>

<?php unset($brand); ?>
<?php unset($leafletId); ?>
<?php unset($searchPhrase); ?>