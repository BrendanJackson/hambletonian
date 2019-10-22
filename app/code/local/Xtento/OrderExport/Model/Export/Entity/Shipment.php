<?php

/**
 * Product:       Xtento_OrderExport (1.9.27)
 * ID:            +ILKmsIgAlDNubYeeJo2xDbvutd+ZnXtgjQ9TypQsn0=
 * Packaged:      2018-04-19T20:13:54+00:00
 * Last Modified: 2012-12-07T18:54:59+01:00
 * File:          app/code/local/Xtento/OrderExport/Model/Export/Entity/Shipment.php
 * Copyright:     Copyright (c) 2018 XTENTO GmbH & Co. KG <info@xtento.com> / All rights reserved.
 */

class Xtento_OrderExport_Model_Export_Entity_Shipment extends Xtento_OrderExport_Model_Export_Entity_Abstract
{
    protected $_entityType = Xtento_OrderExport_Model_Export::ENTITY_SHIPMENT;

    protected function _construct()
    {
        $collection = Mage::getResourceModel('sales/order_shipment_collection')
            ->addAttributeToSelect('*');
        $this->_collection = $collection;
        parent::_construct();
    }
}