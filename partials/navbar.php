<?php
$menuItems = wp_get_nav_menu_items("main");
$menuMainItems = array_filter($menuItems, function ($k) {
	return $k->menu_item_parent == 0;
});
?>

<div id="overlay" class="overlay"></div>
<div class="navbar__outer">
	<div class="navbar">
		<div class="navbar__logo-outer">
			<a href="https://blix.pl/">
				<img alt="Blix logo" src="<?php echo get_stylesheet_directory_uri() . '/assets/img/blix-logo.svg'; ?>" class="navbar__logo" width="86" height="40">
			</a>
		</div>
		<button class="search__btn-show btn-show-search btn-circle">
			<img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/search-icon.svg'; ?>" alt="Szukaj">
		</button>
		<div class="navbar__menu-outer">
			<nav class="navbar__menu">
				<button class="navbar__burger-btn"></button>
				<div class="navbar__menu-items-wrapper">
					<ul class="navbar__menu-items">
						<?php
						foreach ($menuMainItems as $mainItem) {
							$hasChildren = $mainItem->classes[0] == 'has-children';
							if ($hasChildren) { ?>
								<li class="navbar__menu-item<?php echo ' ' . $mainItem->classes[0]; ?>">
									<div class="navbar__menu-item-inner-wrapper">
										<a href="<?php echo $mainItem->url; ?>"><span><?php echo $mainItem->post_title ?></span></a>
										<button class="menu-item-caret"></button>
									</div>
									<div class="submenu">
										<ul class="submenu__list">
											<?php
											$menuSubItems = array_filter($menuItems, function ($v) use ($mainItem) {
												return $v->menu_item_parent == $mainItem->ID;
											});
											foreach ($menuSubItems as $subItem) {
											?>
												<li class="navbar__menu-item">
													<div class="navbar__menu-item-inner-wrapper">
														<a class="main-category ga-menu-cat-brand" href="<?php echo $subItem->url; ?>">
															<img src="https://static.blix.pl/blix/navbar-icons/<?php echo sanitize_title($subItem->post_title); ?>.svg" alt="<?php echo $subItem->post_title; ?>" width="32" height="32" loading="lazy" />
															<?php echo $subItem->post_title; ?>
															<button class="menu-item-caret"></button>
														</a>
														<div class="keywords">
															<?php
															$menuKeywordItems = array_filter($menuItems, function ($l) use ($subItem) {
																return $l->menu_item_parent == $subItem->ID;
															});
															foreach ($menuKeywordItems as $keywordItem) {
															?>
																<a href="<?php echo $keywordItem->url; ?>" class="ga-menu-item-brand"><span><?php echo $keywordItem->post_title; ?></span></a>
															<?php } ?>
														</div>
													</div>
												</li>
											<?php } ?>
										</ul>
										<div class="navbar__promo-offers navbar-promo-offers"></div>
										<div class="all-categories">
											<a href="<?php echo $mainItem->url; ?>">Wszystkie <?php echo $mainItem->post_title; ?> <button class="menu-item-caret"></button></a>
										</div>
									</div>
								</li>
							<?php } else { ?>
								<li class="navbar__menu-item">
									<div class="navbar__menu-item-inner-wrapper">
										<a href="<?php echo $mainItem->url; ?>"><?php echo $mainItem->post_name; ?><button class="menu-item-caret"></button></a>
									</div>
								</li>
						<?php }
						} ?>
					</ul>
				</div>
				<div class="navbar__overlay overlay"></div>
			</nav>
		</div>
		<div id="overlay_search" class="search-overlay overlay"></div>

		<div class="search-container d-none d-lg-block">
			<form class="search navbar__search" action="https://blix.pl/szukaj/" method="POST" autocomplete="off">
				<input type="text" name="szukaj" class="search__input" placeholder="Wyszukaj w Blix np. masło, jaja" autocomplete="off" tabindex="-1">
				<button type="button" class="button search__button-close"><img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/x-icon.svg'; ?>"></button>
				<button class="button button--green search__button"><img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/search-icon.svg'; ?>"></button>
			</form>
			<div class="autocomplete">
				<div class="autocomplete__bg">
					<div class="products">
						<span class="title_bar"></span>
						<ul></ul>
					</div>
					<div class="brands">
						<span class="title_bar"></span>
						<ul></ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>