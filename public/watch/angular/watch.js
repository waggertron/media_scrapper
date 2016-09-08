let initial, watched;
$.getJSON('/videos', (data) => {
  initial = data;
});
$.getJSON('/watched', (data) => {
  watched = data;
});