<?php

/**
 * Product:       Xtento_OrderExport (1.9.27)
 * ID:            +ILKmsIgAlDNubYeeJo2xDbvutd+ZnXtgjQ9TypQsn0=
 * Packaged:      2018-04-19T20:13:54+00:00
 * Last Modified: 2013-02-09T23:40:23+01:00
 * File:          app/code/local/Xtento/OrderExport/Block/Adminhtml/Tools/Export.php
 * Copyright:     Copyright (c) 2018 XTENTO GmbH & Co. KG <info@xtento.com> / All rights reserved.
 */

class Xtento_OrderExport_Block_Adminhtml_Tools_Export extends Mage_Adminhtml_Block_Template
{
    public function getProfiles()
    {
        $profileCollection = Mage::getModel('xtento_orderexport/profile')->getCollection();
        $profileCollection->getSelect()->order('name ASC');
        return $profileCollection;
    }

    public function getDestinations()
    {
        $destinationCollection = Mage::getModel('xtento_orderexport/destination')->getCollection();
        $destinationCollection->getSelect()->order('name ASC');
        return $destinationCollection;
    }
}