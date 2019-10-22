<?php
/**
 * Intenso Premium Theme
 *
 * @category    Itactica
 * @package     Itactica_FeaturedProducts
 * @copyright   Copyright (c) 2014-2017 Itactica (http://www.itactica.com)
 * @license     http://getintenso.com/license
 */

$this->startSetup();

$this->getConnection()->addColumn(
    $this->getTable('itactica_featuredproducts/slider'),
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
