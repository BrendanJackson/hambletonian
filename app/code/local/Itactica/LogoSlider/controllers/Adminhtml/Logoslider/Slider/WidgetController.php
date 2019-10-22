<?php
/**
 * Intenso Premium Theme
 * 
 * @category    Itactica
 * @package     Itactica_LogoSlider
 * @copyright   Copyright (c) 2014-2017 Intenso (https://www.getintenso.com)
 * @license     http://getintenso.com/license
 */

class Itactica_LogoSlider_Adminhtml_Logoslider_Slider_WidgetController extends Mage_Adminhtml_Controller_Action
{
    /**
     * Chooser Source action
     * @access public
     * @return void
     */
    public function chooserAction(){
        $uniqId = $this->getRequest()->getParam('uniq_id');
        $grid = $this->getLayout()->createBlock('itactica_logoslider/adminhtml_slider_widget_chooser', '', array(
            'id' => $uniqId,
        ));
        $this->getResponse()->setBody($grid->toHtml());
    }
}
