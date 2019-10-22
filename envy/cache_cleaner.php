<?php

if($_GET['access_ok']){
	//define('MAGENTO', realpath('../'));
	require_once '../app/Mage.php';
	umask( 0 );
	Mage::app( "default" ); // if getting error change this line to Mage::app(Mage::app()->getStore());  
	$ver = Mage::getVersion();
	$userModel = Mage::getModel( 'admin/user' );
	$userModel -> setUserId( 0 );
	Mage::getSingleton( 'admin/session' )->setUser( $userModel );

	//echo "Refreshing cache...\n";
	Mage::app()->cleanCache();
	$enable = array();
	foreach ( Mage::helper( 'core' )->getCacheTypes() as $type => $label ) {
		$enable[$type] = 1;
		} 

	Mage::app()->saveUseCache( $enable ); 
	refresh_cache(); // call refresh function 
}

function refresh_cache($mode='images') 
    {    
        //echo 'Refreshing cache';
        if ($mode=='urls'){
			try {
				Mage :: getSingleton( 'catalog/url' ) -> refreshRewrites();
				echo 'Catalog Rewrites was refreshed successfully';
				} 
			catch ( Exception $e ) {
				echo $e -> getMessage();
				}
		}
		if ($mode=='index'){		
			try {
				Mage :: getSingleton( 'catalog/index' ) -> rebuild();
				echo 'Catalog Index was rebuilt successfully';
				} 
			catch ( Exception $e ) {
				echo $e -> getMessage();
				}
		}
		if ($mode=='index_flag'){
			try {
				$flag = Mage :: getModel( 'catalogindex/catalog_index_flag' ) -> loadSelf();
				if ( $flag -> getState() == Mage_CatalogIndex_Model_Catalog_Index_Flag :: STATE_RUNNING ) {
					$kill = Mage :: getModel( 'catalogindex/catalog_index_kill_flag' ) -> loadSelf();
					$kill -> setFlagData( $flag -> getFlagData() ) -> save();
					} 
				$flag -> setState( Mage_CatalogIndex_Model_Catalog_Index_Flag :: STATE_QUEUED ) -> save();
				Mage :: getSingleton( 'catalogindex/indexer' ) -> plainReindex();
				echo 'Layered Navigation Indices was refreshed successfully';
				} 
			catch ( Exception $e ) {
				echo $e -> getMessage();
				}
		}
		if ($mode=='images'){
			try {
				Mage :: getModel( 'catalog/product_image' ) -> clearCache();
				//echo 'Image cache was cleared successfully';
				Mage::log('Image cache was cleared successfully.',null,'cache_cleaner.log');
				//mail('kirsten@upperrm.com','Cache Clean','Ok');
				} 
			catch ( Exception $e ) {
				Mage::log($e -> getMessage(),null,'cache_cleaner.log');
				}
		}
		if ($mode=='search'){				
			try {
				Mage :: getSingleton( 'catalogsearch/fulltext' ) -> rebuildIndex();
				echo 'Search Index was rebuilded successfully';
				} 
			catch ( Exception $e ) {
				echo $e -> getMessage();
				}
		}
		if ($mode=='inventory'){
			try {
				Mage :: getSingleton( 'cataloginventory/stock_status' ) -> rebuild();
				echo 'CatalogInventory Stock Status was rebuilded successfully';
				} 
			catch ( Exception $e ) {
				echo $e -> getMessage();
				}
		}
		if ($mode=='flat_cats'){
			try {
				Mage :: getResourceModel( 'catalog/category_flat' ) -> rebuild();
				echo 'Flat Catalog Category was rebuilt successfully';
				} 
			catch ( Exception $e ) {
				echo $e -> getMessage();
				}
		}
		if ($mode=='flat_index'){
			try {
				Mage :: getResourceModel( 'catalog/product_flat_indexer' ) -> rebuild();
				echo 'Flat Catalog Product was rebuilt successfully';
				} 
			catch ( Exception $e ) {
				echo $e -> getMessage();
				}
		}
    }  


?>