<?php

$categories = get_categories();
$current_term = get_queried_object();
$is_category = isset($current_term) && $current_term->taxonomy == "category";

if ($is_category) {
    $ancestors = get_ancestors($current_term->term_id, 'category');
    $top_ancestor;
    $top_ancestor_children;

    if (count($ancestors) == 0) {
        $top_ancestor = $current_term;
    } else {
        $top_ancestor = get_category(end($ancestors));
    }

    foreach ($categories as $category) {
        if ($category->parent == $top_ancestor->term_id) {
            $top_ancestor_children[] = $category;
        }
    }
}

?>

<section class="section pills pb-0 d-lg-flex justify-between items-center">
    <?php include "search.php"; ?>
    <div class="pills__wrapper">
        <div class="pills__track">
            <div class="pills__overlay pills__overlay--left">
                <button class="pills__button pills__button--left">
                    <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>" />
                </button>
            </div>
            <a href="/" class="pill pill--blue<?php if (is_front_page()) echo " active"; ?>">Strona Główna</a>
            <?php foreach ($categories as $category) : ?>
                <?php if ($category->parent == 0) : ?>
                    <a href="<?php echo get_category_link($category); ?>" class="pill pill--blue<?php if ($is_category && $top_ancestor->term_id == $category->term_id) echo " active" ?>"><?php echo $category->name; ?></a>
                <?php endif ?>
            <?php endforeach ?>
            <div class="pills__overlay pills__overlay--right">
                <button class="pills__button pills__button--right">
                    <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>" />
                </button>
            </div>
        </div>
    </div>
</section>

<?php if (isset($vars->header)) : ?>
    <section class="section<?php if (!isset($top_ancestor_children)) echo " pb-0"; ?>">
        <h1 class="mb-0"><?php echo $vars->header; ?></h1>
    </section>
<?php endif ?>

<?php if (isset($top_ancestor_children)) : ?>
    <section class="section pills py-0">
        <div class="pills__wrapper">
            <div class="pills__track">
                <div class="pills__overlay pills__overlay--left">
                    <button class="pills__button pills__button--left">
                        <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>" />
                    </button>
                </div>
                <a href="<?php echo get_category_link($top_ancestor); ?>" class="pill pill<?php if ($current_term->term_id == $top_ancestor->term_id) echo " active" ?>">Wszystko</a>
                <?php foreach ($top_ancestor_children as $subcategory) : ?>
                    <a href="<?php echo get_category_link($subcategory); ?>" class="pill<?php if ($current_term->term_id == $subcategory->term_id) echo " active" ?>"><?php echo $subcategory->name; ?></a>
                <?php endforeach ?>
                <div class="pills__overlay pills__overlay--right">
                    <button class="pills__button pills__button--right">
                        <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>" />
                    </button>
                </div>
            </div>
        </div>
    </section>
<?php endif ?>