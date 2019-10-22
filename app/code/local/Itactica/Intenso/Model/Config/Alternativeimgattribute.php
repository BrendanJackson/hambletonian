<?php
/**
 * Intenso Premium Theme
 *
 * @category    Itactica
 * @package     Itactica_Intenso
 * @copyright   Copyright (c) 2014-2017 Intenso (https://www.getintenso.com)
 * @license     http://getintenso.com/license
 */
class Itactica_Intenso_Model_Config_Alternativeimgattribute
{
    public function toOptionArray()
    {
        return array(
            array('value' => 'label',
                  'label' => Mage::helper('itactica_intenso')->__('Label')),

            array('value' => 'position',
                  'label' => Mage::helper('itactica_intenso')->__('Position'))
        );
    }
}
