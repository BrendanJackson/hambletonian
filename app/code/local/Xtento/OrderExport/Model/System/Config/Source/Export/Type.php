<?php

/**
 * Product:       Xtento_OrderExport (1.9.27)
 * ID:            +ILKmsIgAlDNubYeeJo2xDbvutd+ZnXtgjQ9TypQsn0=
 * Packaged:      2018-04-19T20:13:54+00:00
 * Last Modified: 2012-11-29T18:03:45+01:00
 * File:          app/code/local/Xtento/OrderExport/Model/System/Config/Source/Export/Type.php
 * Copyright:     Copyright (c) 2018 XTENTO GmbH & Co. KG <info@xtento.com> / All rights reserved.
 */

class Xtento_OrderExport_Model_System_Config_Source_Export_Type
{

    public function toOptionArray()
    {
        return Mage::getSingleton('xtento_orderexport/export')->getExportTypes();
    }

}