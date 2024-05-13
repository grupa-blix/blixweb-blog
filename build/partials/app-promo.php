<?php
$mobile_device = (get_device_os() == 'Android' || get_device_os() == 'iOS') ? true : false;
$displayed = isset($_COOKIE['app-promo-displayed']) ? true : false;
$from_campaign = strpos($_SERVER['REQUEST_URI'], "utm_campaign") !== false ? true : false;
$variations = ["bottomsheet_zero", "bottomsheet_zero_late", "bottomsheet_mini", "bottomsheet_mini_late"];
$variation = $variations[array_rand($variations)];
$visible = ($variation == "bottomsheet_zero" || $variation == "bottomsheet_mini") ? "true" : "false";
$storeURL = "https://play.google.com/store/apps/details?id=com.gazetki.gazetki&referrer=utm_source%3Dblixweb%26utm_campaign%3Dblixapppromo%26utm_medium=" . $variation;

if (get_device_os() == 'iOS') {
    $storeURL = "https://blix.app.link/WKcXWBDG0W?utm_source=blixweb&utm_campaign=blixapppromo&utm_medium=" . $variation;
} ?>

<?php if ($mobile_device && !$displayed && !$from_campaign): ?>
    <div class="app-promo app-promo--bottomsheet" data-visible="<?php echo $visible; ?>" data-variation="<?php echo $variation; ?>">
        <div class="app-promo__content-wrapper app-promo__content-wrapper--bottomsheet">
            <div class="app-promo__logo-wrapper app-promo__logo-wrapper--bottomsheet">
                <div class="app-promo__logo-wrapper-bg"></div>
                <img class="app-promo__logo" src="<?php echo get_stylesheet_directory_uri() . '/assets/img/blix-logo-mint.svg'; ?>" width="48" height="48" alt="Logo Blix" />
            </div>
            <div class="app-promo__content">
                <h2 class="app-promo__header text-center">Najnowsze promocje<br> zawsze pod ręką w aplikacji Blix</h2>
                <?php if ($variation == "bottomsheet_zero" || $variation == "bottomsheet_zero_late"): ?>
                    <div class="app-promo__banner-wrapper">
                        <img class="app-promo__banner" src="<?php echo get_stylesheet_directory_uri() . '/assets/img/app-promo-banner.png'; ?>" alt="Baner Blix App"/>
                        <div class="app-promo__banner-shadow"></div>
                    </div>
                <?php endif; ?>
                <p class="app-promo__text text-center">Dołącz do milionów zadowolonych użytkowników!</p>
                <div class="app-promo__stars-wrapper">
                    <?php for ($i = 1; $i <= 5; $i++): ?>
                        <img class="app-promo__star" src="<?php echo get_stylesheet_directory_uri() . '/assets/img/star.svg'; ?>" width="14" height="14" alt="Gwiazdka"/>
                    <?php endfor; ?>
                </div>
                <div class="app-promo__buttons-wrapper">
                    <a href="<?= $storeURL ?>">
                        <button class="button button--green button--app">Otwórz w aplikacji</button>
                    </a>
                    <button class="button button--no-border button--web">Kontynuuj w przeglądarce</button>
                </div>
            </div>
        </div>
    </div>
<?php endif; ?>