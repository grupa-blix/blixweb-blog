<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">
	<title><?php wp_title(''); ?></title>

	<?php if(is_single() && in_category('przepisy')) : ?>
		<script src="https://www.google.com/recaptcha/api.js?render=6LfyoAYoAAAAAOiSqybJkDqsng6R4U0PlzQCKQzI" defer></script>
	<?php endif;?>

	<?php wp_head(); ?>
</head>

<?php include 'partials/navbar.php'; ?>

<body>
	<?php include 'partials/breadcrumbs.php'; ?>