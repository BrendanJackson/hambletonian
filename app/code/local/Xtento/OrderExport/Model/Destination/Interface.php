<?php

/**
 * Product:       Xtento_OrderExport (1.9.27)
 * ID:            +ILKmsIgAlDNubYeeJo2xDbvutd+ZnXtgjQ9TypQsn0=
 * Packaged:      2018-04-19T20:13:54+00:00
 * Last Modified: 2012-11-23T19:26:35+01:00
 * File:          app/code/local/Xtento/OrderExport/Model/Destination/Interface.php
 * Copyright:     Copyright (c) 2018 XTENTO GmbH & Co. KG <info@xtento.com> / All rights reserved.
 */

interface Xtento_OrderExport_Model_Destination_Interface
{
    public function testConnection();
    public function saveFiles($fileArray);
}