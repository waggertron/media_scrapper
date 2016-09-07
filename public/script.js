$(document).ready(() => {
  $('#explore').on('click', (e) => {
    e.preventDefault();
    let val = $('.searchBar').val();
    $('#title').addClass("change");
    $('.search').fadeOut(800);
    $.post(
      "/scrape",
      { subreddit: val },
      function () {
        setTimeout(() => {
          window.location.replace("/watch");
        }, 10000);
      }
    );
  })
});