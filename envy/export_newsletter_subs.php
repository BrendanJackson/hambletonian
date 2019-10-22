<?php
/*
Extension Name: Magento CSV Export Newsletter Subscribers
Description: Export a list of subscribers of the Magento Newsletter in CSV format
Version: 	0.1
License: 	GPL
Author: 	TargetIMC
Author URI: http://targetimc.com
*/
/* Paste this file in root directory and run it manually*/
 ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
ini_set('max_execution_time', 600);
ini_set('memory_limit', '1024M');
 
require '../app/Mage.php';
$app = Mage::app('');
 
$myFile = "../var/export/tgt-magento-subscribers.csv";
$fp = fopen($myFile, 'w');
 
$columns = array('customers_firstname','customers_lastname','customers_email_address');
fputcsv($fp,$columns);
 
/* get Newsletter Subscriber whose status is equal to "Subscribed"    */
 
$sql = "SELECT * FROM newsletter_subscriber WHERE subscriber_status = 1";
$connection = Mage::getSingleton('core/resource')->getConnection('core_read');
foreach ($connection->fetchAll($sql) as $arr_row) {
 
$loademail = $arr_row['subscriber_email'];
 
$customer = Mage::getModel('customer/customer');
$customer->setWebsiteId(Mage::app()->getStore()->getWebsiteId());
$customer->loadByEmail($loademail);
 
$fname = explode(',', $customer->getData('firstname'));
$lname = explode(',', $customer->getData('lastname'));
$email = explode(',', $customer->getData('email'));
$fname = $fname[0];
$lname = $lname[0];
$email = $email[0];
if ($fname=="" && $lname=="")
{
$fname="--";
$lname="--";
$email=$arr_row['subscriber_email'];
}
$subscribers = array('firstname'=>$fname,'lastname'=>$lname,'email'=>$email);
fputcsv($fp,$subscribers);
}
 
fclose($fp);
header('Content-disposition: attachment; filename=' . $myFile);
header('Content-type: application/text');
//readfile($myFile);
exit;
?>