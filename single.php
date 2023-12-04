<?php get_header(); ?>
<?php
if (has_post_thumbnail( $post->ID ) ){
    echo 'T';
}else{
    echo 'F';
}
?>
<section class="section">
    <? the_content(); ?>
</section>

<? get_footer(); ?>