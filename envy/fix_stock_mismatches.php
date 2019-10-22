<html>
<head>
<title>Configurable product checks - only error items</title>
<style>
	table {margin:25px 0px;}
	td {padding:10px 5px;}
	.green {color:green;}
	.red {color:red;}
</style>
</head>
<body>
<div style="width:960px;margin:25px auto;">
<h1>Stock Status of Configurable Products</h1>
<p>This page shows all the products that have mismatched stock status. 


<table border="1"><tr><th>Item Name</th><th>Magento ID Number</th><th>Saleable</th><th>Config Product Status</th><th>Associated Product Stock</th></tr>
<?php
require_once('../app/Mage.php'); //Path to Magento
umask(0);
Mage::app();

$collectionConfigurable = Mage::getResourceModel('catalog/product_collection')->addAttributeToFilter('type_id', array('eq' => 'configurable'));

foreach ($collectionConfigurable as $_configurableproduct) {
    /**
    * Load product by product id
    */
    $product = Mage::getModel('catalog/product')->load($_configurableproduct->getId());
	$stock = $product->getStockItem();
	$childProducts = Mage::getModel('catalog/product_type_configurable')->getUsedProducts(null,$product);
	   
	$instock_childrenisinstock = false;
	
	foreach ($childProducts as $childProduct) {
		$qty = Mage::getModel('cataloginventory/stock_item')->loadByProduct($childProduct)->getQty();
		if ($qty > 0) {
			$instock_childrenisinstock = true;
		}
	}
	
	if ($product->isSaleable() && $stock->getIsInStock()) {
	
	} else if (!$stock->getIsInStock() && !$instock_childrenisinstock) {
	
	} else {
	
	echo "<tr><td>".$product->getName()." - " . $product->getSku() . "</td><td>".$product->getId()."</td>"; 
	
	
    if ($product->isSaleable()) {
		echo "<td class='green'>Saleable</td>";
		} else {
		echo "<td class='red'>Out of Stock</td>";
	}

	
		$config_in_stock = false;
		$children_in_stock = false;
	if ($stock->getIsInStock()) {
		echo "<td class='green'>Product In Stock</td>";
		$config_in_stock = true;
		} else {
		echo "<td class='red'>Product Out of Stock</td>";
		$config_in_stock = false;
		}
	
	if ($instock_childrenisinstock) {
		echo "<td class='green'>Sub-Products in-stock</td>";
				$children_in_stock = true;

	} else {
		echo "<td class='red'>Sub-Products out-of-stock</td>";
				$children_in_stock = false;

	}
	
	echo "</tr>";
		if(!$config_in_stock AND $children_in_stock){
			$stockItem = Mage::getModel('cataloginventory/stock_item')->loadByProduct($product);
			$stockItem->setData('is_in_stock', 1);
			$stockItem->save();
			$product->save();
		} else if ($config_in_stock AND !$children_in_stock){
			$stockItem = Mage::getModel('cataloginventory/stock_item')->loadByProduct($product);
			$stockItem->setData('is_in_stock', 0);
			$stockItem->save();
			$product->save();		
		}	
	
	 }
  }
?>
</table>
</div>
</body>
</html>