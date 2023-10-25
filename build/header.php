<!DOCTYPE html>
<html lang="pl-PL">

<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">

	<title><?php wp_title('') ?></title>

	<?php if(is_single() && in_category('przepisy')) : ?>
		<script src="https://www.google.com/recaptcha/api.js?render=6LfyoAYoAAAAAOiSqybJkDqsng6R4U0PlzQCKQzI" defer></script>

		<?php
			$processed_ingredients = print_processed_ingredients(get_field("ingredients"));
			$processed_preparation = print_processed_preparation(get_field("preparation"))
		?>

		<script type="application/ld+json">
			{
				"@context": "http://schema.org",
				"@type": "Recipe",
				"author": "<?php echo get_the_author_meta('display_name') ?>",
				"cookTime": "PT<?php echo get_field("preparation_time_micro") ?>",
				"description": "<?php echo get_the_content(); ?>",
				"image": "<?php echo get_the_post_thumbnail_url($post, "full"); ?>",
				"recipeIngredient": [<?php echo $processed_ingredients; ?>],
				"name": "<?php echo $post->post_title; ?>",
				"prepTime": "PT<?php echo get_field("preparation_time_micro") ?>",
				"recipeInstructions": "<?php echo $processed_preparation; ?>"
				<?php if(get_field('rating') != 0) : ?>
					,"aggregateRating": {
						"@type": "AggregateRating",
						"ratingValue": "<?php echo number_format(get_field('rating')); ?>",
						"reviewCount": "<?php echo number_format(get_field('rating_count')); ?>"
					}
				<?php endif; ?>
			}
		</script>

	<?php endif;?>


	<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-KHZQ77B');</script>

	<?php wp_head(); ?>
</head>

<?php include 'partials/navbar.php'; ?>

<body>
	<?php include 'partials/breadcrumbs.php'; ?>