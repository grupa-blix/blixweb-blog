<?php wp_footer(); ?>
<?php
$args = array(
    'post_type' => 'post',
    'orderby' => 'ID',
    'post_status' => 'publish',
    'order' => 'DESC',
    'posts_per_page' => 4
);

$result = new WP_Query($args);
$footerUpperItems = wp_get_nav_menu_items(10);
$footerLowerItems = wp_get_nav_menu_items(11);
$footerUpperMainItems = array_filter($footerUpperItems, function ($k) {
    return $k->menu_item_parent == 0;
});
$footerLowerMainItems = array_filter($footerLowerItems, function ($k) {
    return $k->menu_item_parent == 0;
});
?>
<footer class="footer">
    <?php include 'partials/sections/leaflets.php'; ?>

    <?php $vars = (object) [
        'header' => 'Blix poleca!',
        'elements' => $result->posts
    ];
    include 'partials/sections/posts.php'; ?>

    <section class="section section--gray section--full">
        <?php foreach ($footerUpperMainItems as $mainItem) : ?>
            <div class="footer__nav">
                <h4><?php echo $mainItem->post_title ?></h4>
                <ul class="footer__grid">
                    <?php
                    $footerUpperSubItems = array_filter($footerUpperItems, function ($v) use ($mainItem) {
                        return $v->menu_item_parent == $mainItem->ID;
                    });
                    foreach ($footerUpperSubItems as $subItem) :
                    ?>
                        <li><a href="<?php echo $subItem->url; ?>"><?php echo $subItem->post_title; ?></a></li>
                    <?php endforeach ?>
                </ul>
            </div>
        <?php endforeach ?>
    </section>
    <section class="section section--gray section--full py-0">
        <div class="footer__wrapper">
            <div class="footer__apps">
                <h4>Pobierz aplikację Blix na swój telefon!</h4>
                <div class="footer__apps-badges">
                    <a href="https://play.google.com/store/apps/details?id=com.gazetki.gazetki">
                        <img class="lazyload loaded" src="https://blix.pl/gotuj/blix-googleplay.png" alt="Google Play" width="169" height="50" data-src="https://blix.pl/gotuj/blix-googleplay.png" data-was-processed="true">
                    </a>
                    <a href="https://blix.app.link/WKcXWBDG0W">
                        <img class="lazyload loaded" src="https://blix.pl/gotuj/blix-appstore.png" alt="Aplikacja Blix iOS - App Store" width="150" height="50" data-src="https://blix.pl/gotuj/blix-appstore.png" data-was-processed="true">
                    </a>
                    <a href="https://appgallery.cloud.huawei.com/marketshare/app/C100525553?locale=pl_PL">
                        <img class="lazyload loaded" src="https://blix.pl/gotuj/blix-huawei-app-gallery.png" alt="Aplikacja Blix Huawei - App Store" width="167" height="50" data-src="https://blix.pl/gotuj/blix-huawei-app-gallery.png" data-was-processed="true">
                    </a>
                </div>
            </div>
            <?php foreach ($footerLowerMainItems as $mainItem) : ?>
                <div class="footer__nav">
                    <h4><?php echo $mainItem->post_title ?></h4>
                    <ul>
                        <?php
                        $footerLowerSubItems = array_filter($footerLowerItems, function ($v) use ($mainItem) {
                            return $v->menu_item_parent == $mainItem->ID;
                        });
                        foreach ($footerLowerSubItems as $subItem) :
                        ?>
                            <li><a href="<?php echo $subItem->url; ?>"><?php echo $subItem->post_title; ?></a></li>
                        <?php endforeach ?>
                    </ul>
                </div>
            <?php endforeach ?>
            <div class="footer__sub">
                <span class="footer__sub-text">Wszystkie prawa zastrzeżone 2023</span>
            </div>
        </div>
        <div class="turl" data-turl="<?php echo get_stylesheet_directory_uri();?>"></div>
    </section>
    <script src="<?php echo get_stylesheet_directory_uri() . "/assets/js/app-navbar.js" ?>"></script>
    <script src="<?php echo get_stylesheet_directory_uri() . "/assets/js/app-base.js" ?>"></script>
    <?php if(in_category("przepisy")) : ?>
        <script src="<?php echo get_stylesheet_directory_uri() . "/assets/js/app-recipe.js" ?>"></script>
	<?php elseif(in_category("aktualnosci")) : ?>
        <script src="<?php echo get_stylesheet_directory_uri() . "/assets/js/app-article.js" ?>"></script>
	<?php endif; ?>
</footer>
</body>

</html>