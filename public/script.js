
$(document).ready(function () {
  $('.signupForm').hide();
  $('.signupTitle a').on('click', function (e) {
    e.preventDefault();
    $('.loginForm').slideUp(300);
    $('.signupForm').slideDown(300);
  });
  $('.loginTitle a').on('click', function (e) {
    e.preventDefault();
    $('.signupForm').slideUp(300);
    $('.loginForm').slideDown(300);
  });
});
