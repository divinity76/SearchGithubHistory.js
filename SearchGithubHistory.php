
declare(strict_types = 1);
require_once ('hhb_.inc.php');
$hc = new hhb_curl ();
$hc->_setComfortableOptions ();
// $hc->setopt(CURLOPT_USERAGENT,"Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0");
// var_dump ( $domd );

$current = 'https://github.com/opentibia/server/commits/master';
while ( true ) {
	$hc->exec ( $current );
	if ($hc->getinfo ( CURLINFO_HTTP_CODE ) !== 200) {
		var_dump ( 'did not get 200, got ', $hc->getinfo ( CURLINFO_HTTP_CODE ) );
		echo "sleeping 10 seconds...", PHP_EOL;
		sleep ( 15 );
		continue;
	}
	$domd = @DOMDocument::loadHTML ( $hc->getResponseBody () );
	
	if (preg_match ( '/7\.7/', $domd->textContent )) {
		echo ' matches!: ', $current, PHP_EOL;
	} else {
		// echo $current, PHP_EOL;
		echo ".";
	}
	
	$next = NULL;
	foreach ( $domd->getElementsByTagName ( "a" ) as $a ) {
		if ($a->textContent === 'Older') {
			$next = 'https://github.com' . $a->getAttribute ( "href" );
			break;
		}
	}
	// var_dump ( $next );
	if ($next === NULL) {
		echo ("reached end of page! url: " . $current);
		var_dump ( $hc->getStdErr (), $hc->getResponseBody () );
		die ();
	}
	$current = $next;
	sleep ( 1 ); // github will block you if you request too fast, sigh
}
