<?php
 
/* @var $installer Mage_Core_Model_Resource_Setup */
 
$installer = $this;
 
$installer->startSetup();

$installer->addAttribute('catalog_product', 'liquifire_product_enabled',  array(
    'type'     => 'int',
    'label'    => 'Enable Liquid Pixels',
    'input'    => 'select',
    'source'   => 'eav/entity_attribute_source_boolean',
    'global'   => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_GLOBAL,
    'required' => false,
    'default'  => 0,
    'user_defined'  => 1,
    'group' => 'Liquid Pixels'
));

$installer->addAttribute('catalog_product', 'liquifire_chain', array(
    'type' => 'varchar',
    'input' => 'text',
    'label'    => 'Image Chain',
    'global'    => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_GLOBAL,
    'visible'    => true,
    'required' => 0,
    'unique' => 0,
    'user_defined' => true,
    'visible_on_front' => true,
    'used_for_price_rules' => false,
    'position' => 20,
    'group' => 'Liquid Pixels'
));

$installer->endSetup();



