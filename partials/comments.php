<div class="comments-bottomsheet">
    <div class="comments-bottomsheet__bg"></div>
    <div class="comments-bottomsheet__content">
        <div class="comments-bottomsheet__drag-outer">
            <div class="comments-bottomsheet__drag"></div>
        </div>
        <div class="comments-bottomsheet__inner-wrapper">
            <div class="comments-bottomsheet__header-wrapper">
                <button class="back-btn">
                    <img src="<?php echo get_stylesheet_directory_uri() . '/assets/img/caret.svg';?>" alt="Strzałka">
                    <span>Wstecz</span>
                </button>
                <h2>Komentarze</h2>
                <button class="close-btn"></button>
            </div>
            <div class="left-col">
                <div class="message-box d-none">
                    <div class="message-box__response response d-none">
                        <span class="response__message">Odpowiedź dla użytkownika <span class="response__author"></span></span>
                        <button class="response__clear-btn"></button>
                    </div>
                    <div class="message-box__success success d-none">
                        <span class="success__message">Dziękujemy! Twój komentarz został wysłany do weryfikacji.</span>
                    </div>
                    <div class="message-box__error error d-none">
                        <span class="success__message">Coś poszło nie tak.</span>
                    </div>
                </div>
                <form data-post-id="<?php echo $post->ID; ?>">
                    <label for="comment">Dodaj komentarz*</label>
                    <textarea name="comment" placeholder="Wpisz swój komentarz" minlength="5" required></textarea>
                    <label for="name">Podaj imię*</label>
                    <input type="text" name="name" minlength="3" required/>
                    <button class="button button--green">Opublikuj komentarz</button>
                </form>
            </div>
            <div class="right-col">
                <?php if(get_comments_number() > 0) : ?>
                    <div class="comments-wrapper">
                        <?php foreach(get_comments($post) as $comment) :
                            if($comment->comment_approved == 1 && $comment->comment_parent == 0) : ?>
                            <div class="single-comment" data-comment-id="<?php echo $comment->comment_ID; ?>" data-comment-author="<?php echo $comment->comment_author; ?>">
                                <?php echo get_avatar('', 48); ?>
                                <strong class="single-comment__author"><?php echo $comment->comment_author; ?></strong>
                                <span class="single-comment__data"><?php echo date_format(date_create($comment->comment_date), 'd.m.Y'); ?></span>
                                <span class="single-comment__content"><?php echo $comment->comment_content; ?></span>
                                <button class="single-comment__respond">Odpowiedz</button>
                                <?php foreach(get_comments() as $commentInner) :
                                if($commentInner->comment_approved == 1 && $commentInner->comment_parent == $comment->comment_ID) : ?>
                                    <div class="single-comment single-comment--inner">
                                        <?php echo get_avatar('', 48); ?>
                                        <strong class="single-comment__author"><?php echo $commentInner->comment_author; ?></strong>
                                        <span class="single-comment__data"><?php echo date_format(date_create($commentInner->comment_date), 'd.m.Y'); ?></span>
                                        <span class="single-comment__content"><?php echo $commentInner->comment_content; ?></span>
                                    </div>
                                <?php endif; endforeach; ?>
                            </div>
                        <?php endif; endforeach; ?>
                    </div>
                <?php else : ?>
                    <h2>Ten przepis nie ma jeszcze komentarzy.</h2>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>