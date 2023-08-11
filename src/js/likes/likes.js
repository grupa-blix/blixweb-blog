jQuery(document).ready(function () {
  jQuery.ajax({
    type: "post",
    dataType: "json",
    url: myAjax.ajaxurl,
    data: { action: "article_like" },
    success: function (response) {
      console.log(response);
      if (response.type == "success") {
        console.log(response);
      } else {
        console.log("No");
      }
    },
  });
});
