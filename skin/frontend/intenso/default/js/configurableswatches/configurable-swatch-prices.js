/**
 * Intenso Theme Library
 * http://getintenso.com/
 * Copyright (c) 2014-2017 Intenso (https://www.getintenso.com)
 * http://getintenso.com/license
 */

var ConfigurableSwatchPrices = Class.create({
    initialize: function(config) {
        this.swatchesPrices = [];
        this.generalConfig = config.generalConfig;
        this.products = config.products;

        this.addObservers();
    },

    addObservers: function() {
        $$('.swatch-link').each(function(e) {
            $(e).stopObserving('click');
        });
        $(document).on('click', '.swatch-link', this.onSwatchClick.bind(this));
    },

    onSwatchClick: function(e) {
        var element = Event.findElement(e);
        var swatchElement = element.up('[data-product-id]');
        var productId = parseInt(swatchElement.getAttribute('data-product-id'), 10);
        var swatchLabel = swatchElement.getAttribute('data-option-label');
        var optionsPrice = this.optionsPrice(productId);
        var swatchTarget = this.getSwatchPriceInfo(productId, swatchLabel);

        if(swatchTarget) {
            optionsPrice.changePrice('config', {price: swatchTarget.price, oldPrice: swatchTarget.oldPrice});
            optionsPrice.reload();
            // if we are in list mode and infinite scroll is enabled, update cloned price element
            var grid = $$('.category-products.infinite-scroll.list');
            if (Array.isArray(grid) && grid.length > 0) {
                var originalPriceBox = element.up('.item-info').down('.price-box', 0);
                var actionsSection = element.up('.item-info').next('.actions');
                actionsSection.down('.price-box').remove();
                actionsSection.insert({
                    top: originalPriceBox.clone(true)
                });
            }
        }
    },

    getSwatchPriceInfo: function(productId, swatchLabel) {
        if (!this.products) return;
        var productInfo = this.products[productId];
        if(productInfo && productInfo.swatchPrices[swatchLabel]) {
            return productInfo.swatchPrices[swatchLabel];
        }
        return 0;
    },

    optionsPrice: function(productId) {
        if(this.swatchesPrices[productId]) {
            return this.swatchesPrices[productId];
        }
        if (!this.products) return;
        this.swatchesPrices[productId] = new Product.OptionsPrice(this.getProductConfig(productId));

        return this.swatchesPrices[productId];
    },

    getProductConfig: function(productId) {
        var generalConfigClone = Object.extend({}, this.generalConfig);

        return Object.extend(generalConfigClone, this.products[productId]);
    }
});
