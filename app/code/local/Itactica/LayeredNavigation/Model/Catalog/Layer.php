<?php
/**
 * Intenso Premium Theme
 *
 * @category    Itactica
 * @package     Itactica_LayeredNavigation
 * @copyright   Copyright (c) 2014-2017 Intenso (https://www.getintenso.com)
 * @license     http://getintenso.com/license
 */

class Itactica_LayeredNavigation_Model_Catalog_Layer extends Mage_Catalog_Model_Layer
{

    /**
     * Get collection of all filterable attributes for layer products set
     *
     * @return Mage_Catalog_Model_Resource_Eav_Mysql4_Attribute_Collection
     */
    public function getFilterableAttributes()
    {
        if (!Mage::helper('itactica_layerednavigation')->isEnabled()
            || Mage::getSingleton('core/design_package')->getPackageName() != 'intenso') {
            return parent::getFilterableAttributes();
        }

        $collection = parent::getFilterableAttributes();

        if ($collection instanceof Mage_Catalog_Model_Resource_Product_Attribute_Collection) {
            // Prealoads all needed attributes at once
            $attrUrlKeyModel = Mage::getResourceModel('itactica_layerednavigation/attribute_urlkey');
            $attrUrlKeyModel->preloadAttributesOptions($collection);
        }

        return $collection;
    }

}
