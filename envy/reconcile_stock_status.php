<?php
require_once('../app/Mage.php'); //Path to Magento
umask(0);
Mage::app();    
	
	$collection = Mage::getResourceModel('cataloginventory/stock_item_collection');
    $outQty = Mage::getStoreConfig('cataloginventory/item/options_min_qty');
    $collection->addFieldToFilter('qty', array('gt' => $outQty));
    $collection->addFieldToFilter('is_in_stock', 0);

    foreach($collection as $item) {
        $item->setData('is_in_stock', 1);
    }
    $collection->save();
	
    $collection = Mage::getResourceModel('cataloginventory/stock_item_collection');
    $outQty = Mage::getStoreConfig('cataloginventory/item/options_min_qty');
    $collection->addFieldToFilter('manage_stock', 0);
    $collection->addFieldToFilter('is_in_stock', 0);

    foreach($collection as $item) {
        $item->setData('is_in_stock', 1);
    }
    $collection->save();	