<?php

/**
 * Intenso Premium Theme
 *
 * @category    Itactica
 * @package     Itactica_Intenso
 * @copyright   Copyright (c) 2014-2017 Intenso (https://www.getintenso.com)
 * @license     http://getintenso.com/license
 */

class Itactica_Intenso_Model_Config_Displaytype
{
    /**
     * @return array
     */
    public function toOptionArray()
    {
        return array(
            array('value' => '1',
                'label' => Mage::helper('itactica_intenso')->__('Slider')),

            array('value' => '0',
                'label' => Mage::helper('itactica_intenso')->__('Grid'))
        );
    }
}