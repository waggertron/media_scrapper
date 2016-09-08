let initial, watched;
$.getJSON('/videos', (data) => {
  initial = data;
});
$.getJSON('/watched', (data) => {
  console.log('data from getjsob', data);
  watched = data;
});