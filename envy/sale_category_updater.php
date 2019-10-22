<?
$sale_cat_id = 3;
$live = true;

error_reporting(E_ALL);
ini_set('display_errors', '1');

// Load Up Magento Core
define('MAGENTO', realpath('../'));

require_once('../app/Mage.php');

$app = Mage::app();


$sale_collection = Mage::getResourceModel('catalogsearch/advanced_collection')
->addAttributeToSelect(Mage::getSingleton('catalog/config')->getProductAttributes())
->addMinimalPrice()
->addStoreFilter();
Mage::getSingleton('catalog/product_status')->addVisibleFilterToCollection($sale_collection);
Mage::getSingleton('catalog/product_visibility')->addVisibleInSearchFilterToCollection($sale_collection); 
$todayDate = date('m/d/y');
$tomorrow = mktime(0, 0, 0, date('m'), date('d'), date('y'));
$tomorrowDate = date('m/d/y', $tomorrow); 
$sale_collection->addAttributeToFilter('special_from_date', array('date' => true, 'to' => $todayDate))
->addAttributeToFilter('special_to_date', array('or'=> array(
0 => array('date' => true, 'from' => $tomorrowDate),
1 => array('is' => new Zend_Db_Expr('null')))
), 'left'); 
$sale_collection->addAttributeToFilter('special_price', array('gt' => 0));

$sale_products_ids = $sale_collection->getAllIds();
if(!$live){
	echo '<pre>';
	print_r($sale_products_ids);
}
/* Now catalog price rule sales */
$rules = Mage::getResourceModel('catalogrule/rule_collection')->load();
// read: if there are active rules
if($rules->getData()) {
	$rule_ids = array(); // i used this down below to style the products according to which rule affected
	$cprIds[] = array(); // this will hold the ids of the products

	foreach($rules as $rule) {	
		$rule_ids[] = $rule->getId();
		$catalog_rule = Mage::getModel('catalogrule/rule')->load($rule->getId());
		$today = strtotime('Today');
			if ($catalog_rule->getIsActive() AND strtotime($catalog_rule->getData('to_date')) >= $today AND strtotime($catalog_rule->getData('from_date')) <= $today) {
				//$cprIds = array_merge($cprIds,$rule->getMatchingProductIds());
				//print_r($rule->getMatchingProductIds()) . '<hr/>';
				array_push($cprIds,$rule->getMatchingProductIds());
			}
	}
	
	if (count($cprIds)){
		foreach ($cprIds as $key=>$value){
			foreach ($cprIds[$key] as $subkey=>$subvalue){
				if ($subvalue[1]){
					array_push($sale_products_ids,$subkey);
				}
			}
		}
	}
}

$sale_products_ids = array_unique($sale_products_ids);

if ($live) {
	$sale_products = array_fill_keys($sale_products_ids, '1');
	$sale_category = Mage::getModel('catalog/category')->load($sale_cat_id);
	$sale_category->setPostedProducts($sale_products);
	$sale_category->save();
}
else
{
	print_r($sale_products_ids);
}