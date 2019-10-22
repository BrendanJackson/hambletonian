<?php

/**
 * Product:       Xtento_OrderExport (1.9.27)
 * ID:            +ILKmsIgAlDNubYeeJo2xDbvutd+ZnXtgjQ9TypQsn0=
 * Packaged:      2018-04-19T20:13:54+00:00
 * Last Modified: 2016-02-27T12:47:35+01:00
 * File:          app/code/local/Xtento/OrderExport/Model/Export/Data/Shipment/Comments.php
 * Copyright:     Copyright (c) 2018 XTENTO GmbH & Co. KG <info@xtento.com> / All rights reserved.
 */

class Xtento_OrderExport_Model_Export_Data_Shipment_Comments extends Xtento_OrderExport_Model_Export_Data_Abstract
{
    public function getConfiguration()
    {
        return array(
            'name' => 'Shipment Comments',
            'category' => 'Shipment',
            'description' => 'Export any comments added to shipments, retrieved from the sales_flat_shipment_comment table.',
            'enabled' => true,
            'apply_to' => array(Xtento_OrderExport_Model_Export::ENTITY_SHIPMENT),
        );
    }

    public function getExportData($entityType, $collectionItem)
    {
        // Set return array
        $returnArray = array();
        $this->_writeArray = & $returnArray['shipment_comments'];
        // Fetch fields to export
        $shipment = $collectionItem->getObject();

        if (!$this->fieldLoadingRequired('shipment_comments')) {
            return $returnArray;
        }

        if ($shipment) {
            $commentsCollection = $shipment->getCommentsCollection();
            if ($commentsCollection) {
                foreach ($commentsCollection->getItems() as $shipmentComment) {
                    $this->_writeArray = & $returnArray['shipment_comments'][];
                    $this->writeValue('comment', $shipmentComment->getComment());
                    $this->writeValue('created_at', $shipmentComment->getCreatedAt());
                }
            }
        }
        $this->_writeArray = & $returnArray;
        // Done
        return $returnArray;
    }
}