<?php get_header();

if(in_category("przepisy")) include "partials/post-types/recipe.php";
else include "partials/post-types/article.php";

get_footer(); ?>