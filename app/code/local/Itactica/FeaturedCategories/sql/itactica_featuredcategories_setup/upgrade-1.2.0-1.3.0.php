<?php
/**
 * Intenso Premium Theme
 *
 * @category    Itactica
 * @package     Itactica_FeaturedCategories
 * @copyright   Copyright (c) 2014-2017 Itactica (http://www.getintenso.com)
 * @license     http://getintenso.com/license
 */

$this->startSetup();

// add number_items_mobile field
$this->getConnection()->addColumn(
    $this->getTable('itactica_featuredcategories/slider'),
    'number_items_mobile',
    array(
        'type'      => Varien_Db_Ddl_Table::TYPE_SMALLINT,
        'unsigned'  => true,
        'nullable'  => false,
        'default'   => '1',
        'comment'   => 'Number of Items on Mobile'
    )
);

$this->endSetup();
