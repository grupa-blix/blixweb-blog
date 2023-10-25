    <?php wp_footer(); ?>
    <?php
    $args = array(
        'post_type' => 'post',
        'post_status' => 'publish',
        'meta_key' => 'wpb_post_views_count',
        'orderby' => 'meta_value_num',
        'order' => 'DESC',
        'posts_per_page' => 4
    );

    $result = new WP_Query($args);
    $footerUpperItems = wp_get_nav_menu_items(1232);
    $footerLowerItems = wp_get_nav_menu_items(11);
    $footerLowerMainItems = array_filter($footerLowerItems, function ($k) {
        return $k->menu_item_parent == 0;
    });
    ?>
        <footer class="footer">
            <?php
            $header = "Gazetki dla Ciebie w Blix";
            $leaflets = "promoted";
            $ga_label = "footer-leaflets";
            $no_padding_top = true;
            include 'partials/sections/leaflets.php'; ?>

            <?php $vars = (object) [
                'header' => 'Blix poleca!',
                'elements' => $result->posts
            ];
            include 'partials/sections/posts.php'; ?>

            <section class="section section--gray section--full brands">
                <div class="footer__nav">
                    <h4>Gazetki Blix</h4>
                    <ul class="footer__grid">
                        <?php foreach ($footerUpperItems as $item) : ?>
                            <li>
                                <a href="<?php echo $item->url; ?>"><?php echo $item->title; ?></a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </section>

            <section class="section section--gray section--full py-0">
                <div class="footer__wrapper">
                    <div class="footer__apps">
                        <h4>Pobierz aplikację Blix na swój telefon!</h4>
                        <div class="footer__apps-badges">
                            <a href="https://play.google.com/store/apps/details?id=com.gazetki.gazetki" rel=”nofollow” >
                                <img src="https://blix.pl/gotuj/blix-googleplay.png" alt="Google Play" width="169" height="50" loading="lazy">
                            </a>
                            <a href="https://blix.app.link/WKcXWBDG0W" rel=”nofollow” >
                                <img src="https://blix.pl/gotuj/blix-appstore.png" alt="Aplikacja Blix iOS - App Store" width="150" height="50" loading="lazy">
                            </a>
                            <a href="https://appgallery.cloud.huawei.com/marketshare/app/C100525553?locale=pl_PL" rel=”nofollow” >
                                <img src="https://blix.pl/gotuj/blix-huawei-app-gallery.png" alt="Aplikacja Blix Huawei - App Store" width="167" height="50" loading="lazy">
                            </a>
                        </div>
                    </div>
                    <?php foreach ($footerLowerMainItems as $mainItem) : ?>
                        <div class="footer__nav">
                            <h4><?php echo $mainItem->title ?></h4>
                            <ul>
                                <?php
                                $footerLowerSubItems = array_filter($footerLowerItems, function ($v) use ($mainItem) {
                                    return $v->menu_item_parent == $mainItem->ID;
                                });
                                foreach ($footerLowerSubItems as $subItem) :
                                ?>
                                    <li><a href="<?php echo $subItem->url; ?>"><?php echo $subItem->title; ?></a></li>
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
        </footer>
    </body>
</html>