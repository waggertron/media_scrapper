let initial;
$.getJSON('/videos', (data) => {
  initial = data;
})