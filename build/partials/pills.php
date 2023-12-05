<?php
$tags = get_tags();
$term = get_queried_object();

if ($term->taxonomy == "category") {
    $active_category = $term;

    foreach ($tags as $tag) {
        $tag_category = get_field('cat', $tag);

        if ($tag_category->term_id == $active_category->term_id) {
            $all_tags[] = $tag;
        }
    }
} else if ($term->taxonomy == "post_tag") {
    $active_category = get_field('cat', $term);
    $active_term = $term;

    foreach ($tags as $tag) {
        $tag_category = get_field('cat', $tag);

        if ($tag_category->term_id == $active_category->term_id) {
            $all_tags[] = $tag;
        }
    }
}
?>

<section class="section pills py-0">
    <div class="pills__track">
        <a href="/" class="pill pill--blue<?php if (is_front_page()) echo " active"; ?>">Strona Główna</a>
        <?php foreach (get_categories() as $category) : ?>
            <a href="<?php echo get_category_link($category); ?>" class="pill pill--blue<?php if (isset($active_category) && $active_category->term_id == $category->term_id) echo " active" ?>"><?php echo $category->name; ?></a>
        <?php endforeach ?>
    </div>
</section>

<?php if (isset($all_tags)) : ?>
    <section class="section pills pb-0">
        <div class="pills__track">
            <a href="<?php echo get_category_link($active_category); ?>" class="pill<?php if (!isset($active_term)) echo " active" ?>">Wszystko</a>
            <?php foreach ($all_tags as $tag) : ?>
                <a href="<?php echo get_tag_link($tag); ?>" class="pill<?php if (isset($active_term) && $active_term->term_id == $tag->term_id) echo " active" ?>"><?php echo $tag->name; ?></a>
            <?php endforeach ?>
        </div>
    </section>
<?php endif ?>