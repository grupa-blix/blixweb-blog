<?php
$link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS']
=== 'on' ? "https" : "http") .
"://" . $_SERVER['HTTP_HOST'] .
$_SERVER['REQUEST_URI'];
?>
<div class="share-modal">
    <div class="share-modal__bg"></div>
    <div class="share-modal__card">
        <div class="share-modal__header-wrapper">
            <h2>Udostępnij artykuł</h2>
            <button type="button" class="share-modal__close-btn"><img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/x-icon.svg'; ?>"></button>
        </div>
        <span class="share-modal__url"><?php echo $link; ?></span>
        <button class="button button--green share-modal__copy-btn">Kopiuj link</button>
    </div>
</div>