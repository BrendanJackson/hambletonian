<?php
 
/* @var $installer Mage_Core_Model_Resource_Setup */
 
$installer = $this;
 
$installer->startSetup();
 
$installer->getConnection()->addColumn(
	$installer->getTable('catalog/product_option'), 
	'liquifire_argument', 
	'VARCHAR(128) NULL'
	);
 
$installer->endSetup();

