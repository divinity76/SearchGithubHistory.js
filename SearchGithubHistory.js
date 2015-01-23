function SearchGithubHistory($NeedleRex, $commitsURL, $startFrom, $maxPages, $maxXHRs) {
  if ($startFrom == undefined) $startFrom = 1;
  if ($maxPages == undefined) $maxPages = Infinity;
  if ($maxXHRs == undefined) $maxXHRs = 99;
  if (!($maxXHRs < Infinity)) {
    throw new Error('$maxXHRs must be <Infinity!');
  }
  var $i = 0,
  $xhrs = 0,
  $pagesChecked = 0,
  $stop = false;
  var check = function () {
    var tmpi = $pagesChecked;
    var $tmpurl = '';
    if ($stop != false) {
      console.log('Stopping because $stop!=false.');
      return;
    }
    if ($pagesChecked >= $maxPages) {
      console.log('Stopping because $pagesChecked>=$maxPages.');
      return;
    }
    ++$pagesChecked;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function (ev) {
//      if ($stop && ev.target.readyState != 4) {
//        console.log('aborting xhr because $stop..');
//        ev.target.abort();
//      }
      if (ev.target.readyState != 4) {
        //console.log("not yet..");
        return;
      }
      //console.log('loadend called!');

      var xhr = ev.target;
      if (xhr.status != 200) {
        //console.log('setting stop to true because xhr.status was not 200...');
        $stop = true;
        return;
      }
      if ($NeedleRex.test(xhr.responseText)) {
        console.log('found at ' + xhr.x_url);
      }
      check();
      return;
    });
    xhr.x_url = $commitsURL + '?page=' + tmpi;
    xhr.open('GET', xhr.x_url, true);
    xhr.send();
    return;
  };
  console.log('maxxhrs:' + $maxXHRs);
  for ($i = 0; $i < $maxXHRs; ++$i) {
//    console.log('running check!...');
    check();
  }
  return 'starting..';
};
SearchGithubHistory(/7\.7/gi, 'https://github.com/opentibia/server/commits/master');
