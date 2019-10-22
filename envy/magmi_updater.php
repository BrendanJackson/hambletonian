<?php
//Set no caching
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

if ($_GET['mode']){
	$mode = $_GET['mode'];
}
else if (count($argv))
{
	parse_str($argv[1], $params);
	$mode = $params['mode'];
}

$sitecode = 'hs';
$sitedir = '/srv';
$parentdir = $sitedir . '/public_html';
$envydir = $parentdir . '/envy';

$csvdir = $sitedir . '/ngc/test/' . $sitecode . '/export';
$imagedir = $sitedir . '/ngc/test/' . $sitecode . '/export/images';
$magmi_log_file = $parentdir . '/magmi/state/progress.txt';
$magmi_state_file = $parentdir . '/magmi/state/magmistate';
$magmi_path = $parentdir . '/magmi/cli/magmi.cli.php';
$magmi_state = file_get_contents($magmi_state_file);

//Make sure magmi not already running
if ($magmi_state=='idle') {
	//Make sure it's the correct mode
	if ($mode=='i' OR $mode=='n') {
		//echoStatus('Checking mode');
		if ($mode=='i') {
			$lastrun = $envydir . '/lastrun-inventory.info';
			$error_log = $envydir . '/error-inventory.log';
			$ok_log = $envydir . '/ok-inventory.log';
			$magmi_mode = 'update';
			$profile = 'NGCInventory';
		} else if ($mode=='n') {
			$lastrun = $envydir . '/lastrun.info';
			$error_log = $envydir . '/error.log';
			$ok_log = $envydir . '/ok.log';	
			$magmi_mode = 'create';
			$profile = 'NGCImportNew';
		}
		//Give it all the time it needs.
		ignore_user_abort(true);
		set_time_limit(0);
		//$last_run_start = getTimeRan();
		//echoStatus('Getting last run file');
		$last_file = getLastFile();
		
		//echoStatus('Getting newest file');
		// find latest csv
		$files = scandir($csvdir,1);
		$new_file = filterArray($files,$mode);
		
		$csv_file_path = $csvdir . '/' . $new_file;
		$new_file_modtime = filemtime($csv_file_path);
		$image_dir_modtime = filemtime($imagedir . '/.');
		// check is new
		
		//echoStatus('Comparing files');
		if ($last_file!=$new_file) {		
			write_log('New csv found: ' . $new_file);
			//echoStatus('New csv found');
			saveLastFile($new_file);
		}
		else
		{
			write_log('No new csv. Last file present: ' . $new_file,true);		
			exit('No new csv. Last file present: ' . $new_file);
		}
		// check is uploaded
		//echoStatus('Checking new file upload complete');
		$file_is_uploaded = false;
		$file_is_uploaded_count = 0;
		$last_new_file_mod_time = $new_file_modtime;
		$loopcount = 0;
		while(!$file_is_uploaded AND $file_is_uploaded_count>=5){
			//echoStatus('Checking');
			if ($loopcount<=500) {
				$check_new_file_mod_time = filemtime($csv_file_path);
				if ($last_new_file_mod_time==$check_new_file_mod_time){
					$file_is_loaded = true;
					$file_is_uploaded_count++;
					write_log('New file has completed upload');
				}
				else
				{
					$last_new_file_mod_time = $check_new_file_mod_time;
					$file_is_loaded = false;
					$file_is_uploaded_count = 0;
				}
				$loopcount++;	
			} else {
				write_error('File upload may be stalled');
			}
		}
		//echoStatus('File uploaded');
		//echoStatus('Checking images uploaded');
		// check files done uploading
		$image_is_uploaded = false;
		$image_is_uploaded_count = 0;
		$last_new_image_mod_time = $image_dir_modtime;
		$image_loopcount = 0;
		while(!$image_is_uploaded AND $image_is_uploaded_count>=5){
			//echoStatus('Checking');
			if ($image_loopcount<=500) {
				$check_new_image_mod_time = filemtime($imagedir . '/.');
				if ($last_new_image_mod_time==$check_new_image_mod_time){
					$image_is_loaded = true;
					$image_is_uploaded_count++;
					write_log('New images have completed upload');
				}
				else
				{
					$last_new_image_mod_time = $check_new_image_mod_time;
					$image_is_loaded = false;
					$image_is_uploaded_count = 0;
				}
				$image_loopcount++;
			} else {
				write_error('Image upload may be stalled');
			}
		}
		
		
		//echoStatus('Images uploaded');
		// open file and import to magmi
		//echoStatus('Running Magmi');
		$cmd = 'php ' . $magmi_path . ' -profile=' . $profile  . ' -mode=' . $magmi_mode . ' -CSV:filename="' . $csv_file_path . '"';
		//echo $cmd;
		exec($cmd);
		$warnings = getLineWithString($magmi_log_file, 'skip:');
		$warnings .= getLineWithString($magmi_log_file, 'warning');
		if ($warnings) {
			$warnings .= "\n\r\n\r------------------------\n\r\n\r";
			$lines = file($magmi_log_file);
			foreach ($lines as $lineNumber => $line) {
				$warnings .= $line . "\n\r";
            }
			$warnings .= "\n\r\n\r------------------------\n\r\n\r";
			write_warning($warnings);
		}		
	}
	else
	{
		write_error('Invalid access (' . $_SERVER['REMOTE_ADDR']  . ')',true);
	}
}
else
{
		write_error('Magmi not idle: ' . $magmi_state . ' (' . $parentdir . ')',true);	
}

function write_error($text){
	global $lastrun,$last_file,$new_file,$sitecode,$error_log,$ok_log;
	$text = date('c') . ': ' . $text;
	if ($new_file) {
		$text .= ' (File: ' . $new_file . ')';
	}
	file_put_contents($error_log, $text.PHP_EOL , FILE_APPEND);
	saveLastFile($new_file);
	mail('drufty@elinkdesign.com,bhagedorn@elinkdesign.com','URM Import Error: ' . strtoupper($sitecode) . ' - ' . $new_file,$text);
	exit($text);
}

function write_warning($text){
	global $new_file,$sitecode,$error_log,$ok_log;
	$text = date('c') . ': ' . $text . ' (File: ' . $new_file . ')';
	file_put_contents($error_log, $text.PHP_EOL , FILE_APPEND);
	mail('drufty@elinkdesign.com,bhagedorn@elinkdesign.com','URM Import Warning: ' . strtoupper($sitecode) . ' - ' . $new_file,$text);
}

function write_log($text,$email=false) {
	global $new_file,$sitecode,$error_log,$ok_log,$mode;
	$modetrans = array(
		'i'=>'INVENTORY',
		'n'=>'PRODUCT'
	);
	$text = date('c') . ': ' . $text;
	file_put_contents($ok_log, $text.PHP_EOL , FILE_APPEND);	
	if($email){
		mail('drufty@elinkdesign.com,bhagedorn@elinkdesign.com','URM Import Done: ' . strtoupper($sitecode) . ' - ' . $modetrans[$mode] . ' - ' . $new_file,$text);
	}
}

function getLineWithString($fileName, $str) {
    $lines = file($fileName);
    $return = '';
    foreach ($lines as $lineNumber => $line) {
        if (strpos($line, $str) !== false) {
            $return .= $line . "\n\r";
        }
    }
    return $return;
}

function filterArray($arr,$mode){
	if ($mode=='i') {
		$s = 'INVENTORY';
	} else if ($mode=='n') {
		$s = 'PRODUCT';
	}
	$ret = array();
    foreach($arr as $key=>$value){
		if (strpos($arr[$key],$s)===0){
			array_push($ret,$arr[$key]);
		}
	}

	return $ret[0];
}

function getLastFile(){
	global $lastrun;
	return file_get_contents($lastrun);
}

function saveLastFile($filename){
	global $lastrun;
	file_put_contents($lastrun, $filename);
}
function echoStatus($status){
	//echo $status . '...<br/>';
}