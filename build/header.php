<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">
	<link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri() . "/assets/css/app-base.css" ?>">
	<link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri() . "/assets/css/app-ui.css" ?>">
	<link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri() . "/assets/css/app-navbar.css" ?>">
	<link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri() . "/assets/css/app-footer.css" ?>">
	<?php if(in_category("przepisy")) : ?><link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri() . "/assets/css/app-recipe.css" ?>"><?php endif; ?>
	<?php wp_head(); ?>
</head>

<?php include 'partials/navbar.php'; ?>

<body>
	<?php include 'partials/breadcrumbs.php'; ?>