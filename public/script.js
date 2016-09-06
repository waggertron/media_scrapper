
$('body').on('click', '#explore', (e) => {
  e.preventDefauit();
  $.post(
    "/scrape",
    { subreddit: $('.searchBar').val() },
    function () {
      setTimeout(() => {
        window.location.replace("/Admin/index");
      }, 10000);
    }
  );
})