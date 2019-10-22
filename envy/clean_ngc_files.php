<?php
  $files = glob('/srv/ngc/test/us/export/*');
  $now   = time();

  foreach ($files as $file) {
    if (is_file($file)) {
      if ($now - filemtime($file) >= 60 * 60 * 24 * 14) { // 14 days
		echo $file . '<br>';
        unlink($file);
	  }
	 }
	}
?>