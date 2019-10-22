<?php
require_once '../app/Mage.php';
umask( 0 );
Mage::app( "default" ); // if getting error change this line to Mage::app(Mage::app()->getStore());  
$ver = Mage::getVersion();
$userModel = Mage::getModel( 'admin/user' );
$userModel -> setUserId( 0 );
Mage::getSingleton( 'admin/session' )->setUser( $userModel );


$methods = Mage::getSingleton('shipping/config')->getActiveCarriers();
$shipping = array();
foreach($methods as $_ccode => $_carrier) {
    if($_methods = $_carrier->getAllowedMethods())  {
        if(!$_title = Mage::getStoreConfig("carriers/$_ccode/title"))
            $_title = $_ccode;
        foreach($_methods as $_mcode => $_method)   {
            $_code = $_ccode . '_' . $_mcode;
            $shipping[$_code]=array('title' => $_method,'carrier' => $_title);
        }
    }
}
echo "<pre>";print_r($shipping);
?>