/**
 * Intenso Theme Library
 * https://www.getintenso.com
 * Copyright (c) 2014-2017 Intenso (https://www.getintenso.com)
 * http://getintenso.com/license
 */

var ConfigurableSwatchesList = {
    swatchesByProduct: {},

    init: function()
    {
        var that = this;
        $j('.item-info .configurable-swatch-list li').each(function() {
            that.initSwatch(this);
            var $swatch = $j(this);
            if ($swatch.hasClass('filter-match')) {
                that.handleSwatchSelect($swatch);
            }
        });
    },

    initSwatch: function(swatch)
    {
        var that = this;
        var $swatch = $j(swatch);
        var productId;
        $j($swatch).hover(function() {
            /**
             *
             * - Preview the stock status
             **/
            var swatchUl = $swatch.parent();
            swatchUl.find('.x').each(function(){
                if (!$j(this).closest('ul').is('#configurable_swatch_color')) {
                    $j(this).show();
                    $j(this).closest('li').addClass('not-available');
                }
            });
        });
        if (productId = $swatch.data('product-id')) {
            if (typeof(this.swatchesByProduct[productId]) == 'undefined') {
                this.swatchesByProduct[productId] = [];
            }
            this.swatchesByProduct[productId].push($swatch);

            $swatch.find('a').off().on('click', function(e) {
                e.preventDefault();
                that.handleSwatchSelect($swatch);
            });
        }
    },

    handleSwatchSelect: function($swatch)
    {
        var productId = $swatch.data('product-id');
        var label;
        if (label = $swatch.data('option-label')) {
            ConfigurableMediaImages.swapListImageByOption(productId, label);
        }

        $j.each(this.swatchesByProduct[productId], function(key, $productSwatch) {
            $productSwatch.removeClass('selected');
        });

        $swatch.addClass('selected');
    }
};

$j(document).on('configurable-media-images-init', function(){
    ConfigurableSwatchesList.init();
});
