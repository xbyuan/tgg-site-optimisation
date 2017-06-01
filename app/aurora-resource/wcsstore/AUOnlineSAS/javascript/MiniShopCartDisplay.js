//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2011, 2017 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

/** 
 * @fileOverview This file provides the common functions which are specific to the Mini Shopping cart
 */

/**
 * map order_updated to all the services that result in changes to an order
 * @static
 */
var order_updated = {
    'AjaxAddOrderItem': 'AjaxAddOrderItem',
    'AddOrderItem': 'AddOrderItem',
    'AjaxAddOrderItemWithShipingInfo': 'AjaxAddOrderItemWithShipingInfo',
    'AjaxDeleteOrderItem': 'AjaxDeleteOrderItem',
    'AjaxUpdateOrderItem': 'AjaxUpdateOrderItem',
    'AjaxUpdateOrderShippingInfo': 'AjaxUpdateOrderShippingInfo',
    'AjaxOrderCalculate': 'AjaxOrderCalculate',
    'AjaxLogoff': 'AjaxLogoff',
    'AjaxSetPendingOrder': 'AjaxSetPendingOrder',
    'AjaxUpdatePendingOrder': 'AjaxUpdatePendingOrder',
    'AjaxSingleOrderCancel': 'AjaxSingleOrderCancel',
    'AjaxUpdateRewardOption': 'AjaxUpdateRewardOption',
    'AjaxAddOrderItem1': 'AjaxAddOrderItem1',
    'AjaxPromotionCodeManage': 'AjaxPromotionCodeManage',
    'TGGOrderItemAddressShipMethodUpdate': 'TGGOrderItemAddressShipMethodUpdate',
    'TGGOrderItemDeliveryShipModeUpdateFinal': 'TGGOrderItemDeliveryShipModeUpdateFinal',
    'AjaxTGGFindDelivery': 'AjaxTGGFindDelivery',
    'TGGDeliveryChangeMethod': 'TGGDeliveryChangeMethod',
    'TGGOrderItemDeliveryAddressUpdate': 'TGGOrderItemDeliveryAddressUpdate'
};

var duplicate_update = {
    'AjaxPromotionCodeManage': 'AjaxPromotionCodeManage',
    'TGGOrderItemDeliveryAddressUpdate': 'TGGOrderItemDeliveryAddressUpdate'
};


/** This variable indicates whether the mini cart drop down is updated or not. */
var dropdownUpdated = false;
/** This is variable indicates wether the mini cart drop down is being initialized. */
var dropdownInit = false;
/** This variable keeps track of the mouseover on the mini cart. */
var timer;

/** This variable is used for checking cookies update when item is add in cart */
var isUpdateCookie = false;

var productAddedList = new Object();

var cartHeight = 0;

var cartTimeOut = 0;

/**
 * Declares a new render context for the Mini Shopping Cart.
 */
//wc.render.declareContext("MiniShoppingCartContext",{status:"init"},"");

/**
 * Declares a new render context for the Mini Shopping Cart contents.
 */
wc.render.declareContext("MiniShopCartContentsContext", { status: "init", relativeId: "", contentId: "", contentType: "" }, "");

/**
 * Declares a new render context for the Mini Shopping Cart dropdown contents.
 */
wc.render.declareContext("MiniShopCartDropDownContext", null, "");

/**
 * 
 * Displays the dropdown content of the mini shopping cart when keyboard keys are used to expand/collapse the dropdown.
 *
 * @param {object} event The event to retrieve the input keyboard key
 * @param {string} relativeId The id of a placeholder element to position the dropdown relatively
 * @param {string} contentId The id of the content pane containing the mini shopping cart dropdown contents
 * @param {string} contentType The content that will be shown in the expanded mini shopping cart dropdown.
 */
function showMiniShopCartDropDownEvent(event, relativeId, contentId, contentType) {
    console.debug(event.keyCode);
    if (event.keyCode == dojo.keys.DOWN_ARROW || event.keyCode == dojo.keys.ENTER) {
        showMiniShopCartDropDown(relativeId, contentId, contentType, '');
        dojo.stopEvent(event);
    }
}

function toggleMiniShopCartDropDownEvent(event, relativeId, contentId, contentType) {
    console.debug(event.keyCode);
    if (event.keyCode == dojo.keys.DOWN_ARROW || event.keyCode == dojo.keys.ENTER) {
        toggleMiniShopCartDropDown(relativeId, contentId, contentType);
        dojo.stopEvent(event);
    }
}

/**
 * Displays the dropdown content of the mini shopping cart when the user hovers over the 
 * mini shopping cart if the contents are up-to-date or retrieve the latest contents from server.
 *
 * @param {string} relativeId The id of a placeholder element to position the dropdown relatively
 * @param {string} contentId The id of the content pane containing the mini shopping cart dropdown contents
 * @param {string} contentType The content that will be shown in the expanded mini shopping cart dropdown.
 */
function showMiniShopCartDropDown(relativeId, contentId, contentType, actionId) {
    if (!dropdownInit) {
        dropdownInit = true;
        if (!dropdownUpdated) {
            destroyDialog();
            var params = {};
            params["status"] = 'load';
            params["relativeId"] = relativeId;
            params["contentId"] = contentId;
            params["contentType"] = contentType;
            params["page_view"] = 'dropdown';
            wc.render.updateContext("MiniShopCartContentsContext", params);
        } else {
            positionMiniShopCartDropDown(relativeId, contentId, contentType, actionId);

        }
    }

}

function toggleMiniShopCartDropDown(relativeId, contentId, contentType) {
    if (dojo.hasClass(relativeId, "selected")) {
        var content = dijit.byId(contentId);
        if (content) {
            content.hide();
        }
    } else {
        showMiniShopCartDropDown(relativeId, contentId, contentType, "");
    }
}

require([
        "dojo/mouse",
        "dojo/query",
        "dojo/on",
        "dojo/dom",
        "dojo/_base/event",
        "dojo/touch",
        "dojo/NodeList-dom",
        "dojo/NodeList-traverse",
        "dojo/domReady!"
    ],
    function(mouse, query, on, dom, event, touch) {
        var deviceDetection = new DeviceDetection();
        if (dojo.byId("MiniShoppingCart"))
            cartHeight = dojo.coords(dojo.byId("MiniShoppingCart")).h;
        /****************************************************************************************
         *Customized code is being used for showing the mini-shopcart on mouseover
         *****************************************************************************************/
        if ((deviceDetection.isTablet() && screen.width >= 768 && screen.width <= 1024) || deviceDetection.isTablet()) // For tablet resolution
        {
            // only for tab
            on(query("#minicartSection"), "click", function() {
                var content1 = dijit.byId('quick_cart_container');
                if (content1) {
                    var cs1 = dojo.getComputedStyle(dojo.byId("quick_cart_container"));
                    if ((cs1.opacity && cs1.opacity > 0) && (cs1.display && cs1.display == 'block')) {
                        content1.hide();
                    } else {
                        showMiniShopCartDropDown('minicartSection', 'quick_cart_container', 'orderItemsListAutoClose', "");
                    }
                } else {
                    showMiniShopCartDropDown('minicartSection', 'quick_cart_container', 'orderItemsListAutoClose', "");
                }
            });

            //var orientation= window.orientation;

            if (typeof window.orientation === 'undefined') {
                var test = window.matchMedia("(orientation: portrait)");
                test.addListener(function(m) {
                    /* if(m.matches) {
                       // Changed to portrait
                       alert('portrait');
                     }else {
                       // Changed to landscape
                       alert('landscape');
                     }*/
                    setTimeout(callOnOrientationChange, 250);
                });
            } else {
                window.addEventListener('orientationchange', function(evt) {
                    setTimeout(callOnOrientationChange, 250);

                });
            }


        }
        if (deviceDetection.isDesktop() && screen.width >= 1024) {
            // only for tab
            on(query("#minicartSection"), mouse.enter, function() {
                showMiniShopCartDropDown('minicartSection', 'quick_cart_container', 'orderItemsListAutoClose', "");
            });
        }
    });
/**
 * Displays the dropdown content of the mini shopping cart.
 *
 * @param {string} relativeId The id of a placeholder element to position the dropdown relatively
 * @param {string} contentId The id of the content pane containing the mini shopping cart dropdown contents
 * @param {string} contentType The content that will be shown in the expanded mini shopping cart dropdown.
 */
function callOnOrientationChange() {
    var content = dijit.byId('quick_cart_container');
    if (content) {
        //var parentContainerId = query(evt.target).parents("#quick_cart_container").attr("id");
        var cs = dojo.getComputedStyle(dojo.byId("quick_cart_container"));
        if ((cs.opacity && cs.opacity == 1) && (cs.display && cs.display == 'block')) {
            var t1 = dojo.byId("minicartSection");
            var p1 = dojo.position(t1, true);
            var cartBox = dojo.contentBox(t1);
            //alert("W: "+cartBox.w);
            var totalWidth = 250 - cartBox.w; // 250 is fixed with of cart container with 10 px border


            var x1 = p1.x - totalWidth + 265;
            var y1 = 0;
            if (screen.width < 1200) {
                y1 = cartHeight + 20; // 50 is margin
            } else {
                y1 = cartHeight + 20;
            }
            dojo.style(dojo.byId("quick_cart_container"), {
                left: 1000 + "px",
                top: y1 + "px"
            });
        }
    }
}

function positionMiniShopCartDropDown(relativeId, contentId, contentType, actionId) {
    var dialog = null;
    var otherDialog = null;
    if (contentType == 'orderItemsList' || contentType == 'orderItemsListAutoClose') {
        dialog = dropDownDlg;
        otherDialog = productAddedDropDownDlg;
    } else if (contentType == 'orderItemAdded') {
        dialog = productAddedDropDownDlg;
        otherDialog = dropDownDlg;
    }

    //Calculate the X and Y co-ordinates for the dialog. We don't want it to be at the center of the screen.
    var t1 = dojo.byId(relativeId);
    var p1 = dojo.position(t1, true);
    var cartBox = dojo.contentBox(t1);
    var totalWidth = 250 - cartBox.w - 265; // 250 is fixed with of cart container with 10 px border


    var x1 = p1.x - totalWidth;
    var y1 = 0;
    if (screen.width < 1200) {
        y1 = cartHeight + 20; // 50 is margin
    } else {
        y1 = cartHeight + 20;
    }
    /*By default, the content of the mini shop cart will be displayed immediately after the mini shop cart title.
     *But we want the content to display under the mini shop cart title. So we'll need to get the width
     *of the shop cart and then shift it*/
    var cartWidth = dojo.coords(dojo.byId('widget_minishopcart'), true).w;

    if (dojo.isIE == 8) {
        cartWidth = dojo.coords(dojo.byId('widget_minishopcart'), true).w
    } else if (dojo.isIE >= 7 && dojo.isIE < 8) {
        cartWidth = dojo.coords(dojo.byId('miniShopCartBody'), true).w;
    } else if (dojo.isIE < 7) {
        cartWidth = originalMiniCartWidth;
    }

    //dojo.style(dojo.byId("quick_cart"), "width", cartWidth+'px');

    /* If the Dialog is already created, then just set the X and Y co-ordinates for this dialog. Sometimes,
    if the browser is resized, the (x,y) co-ordinates will change from the initial values. So every time before calling Dialog.show() method reset the (x,y) co-ordinates. 
    The Dialog.show() method will internally call _rePosition() method which repositions the dialog.
    */
    var dlgX = x1; //this value is good for ff3, IE8 & languages

    /*if(dojo.isIE){ // this is not being used in current flow.
    	dlgX = x1 + dojo.contentBox(dojo.byId(relativeId)).w-cartWidth;
    }
    */
    if (dojo.locale == 'ar-eg' || dojo.locale == 'iw-il') {
        dlgX = dlgX + 50;
    }
    if (dialog) {
        dialog.y = y1;
        dialog.x = dlgX;
    }

    var show = function() {
        //deactivate(document.getElementById("header"));// commented deactivating is used for hide all the popup but in tgg mouseout is using.
        dojo.addClass("widget_minishopcart", "selected");
    };
    var hide = function() {
        dojo.removeClass("widget_minishopcart", "selected");
    };

    /* Dialog is not yet created..Create one */
    if (!dialog) {
        var pane = document.getElementById(contentId);
        var dialogTitleElement = document.getElementById(contentId + "_ACCE_Label");
        if (dialogTitleElement != null) {
            dialog = new wc.widget.WCDialog({ relatedSource: relativeId, x: x1, y: y1, title: dialogTitleElement.innerHTML, onShow: show, onHide: hide }, pane);
        } else {
            dialog = new wc.widget.WCDialog({ relatedSource: relativeId, x: x1, y: y1, onShow: show, onHide: hide }, pane);
        }

        dialog.x = dlgX;
        //if(contentType != 'orderItemAdded' && 
        //	(dojo.locale != 'ar-eg' && dojo.locale != 'iw-il')){
        //	dialog.x += 130;
        //}
    }

    var status = null;
    if (otherDialog) {
        status = otherDialog.displayStatus;
    }

    if (!dialog.displayStatus && (status == null || !status)) {
        //If not displaying the dialog, then change the contents based on the contentType.. 
        //If we are displaying the dialog, then do not change the content of the dialog widget..

        dialog.closeOnTimeOut = false; // Do not close the dialog on timeout.
        dialog.autoClose = false; // Do not close the dialog when it loses focus. Use the Close button.
        if (contentType == 'orderItemsList' || contentType == 'orderItemsListAutoClose') {
            dropdownDisplayed = true;
            if (contentType == 'orderItemsListAutoClose') {
                dialog.autoClose = true;
            }
            dropDownDlg = dialog;
            if (actionId != 'AddOrderItemAccessory') {
                setTimeout(dojo.hitch(dropDownDlg, "show", null), 5);
            }
        } else if (contentType == 'orderItemAdded') {
            dojo.byId("MiniShopCartProductAddedWrapper").style.display = "block";
            productAddedDropDownDlg = dialog;
            setTimeout(dojo.hitch(productAddedDropDownDlg, "show", null), 5);
        }
        setTimeout(dojo.hitch(this, "hideUnderlayWrapper", ""), 5);
    }
    if (dojo.isIE < 7) {
        dialog.style.display = "block";
    }
    dropdownInit = false;

    if (contentType == 'orderItemsList') //will execute when order item is added.
    {
        cartTimeOut = setTimeout(
            function() {
                var content = dijit.byId(contentId);
                if (content) {
                    content.hide();
                }
            }, 5000);
    }
}
/** 
 * Declares a new refresh controller for the Mini Shopping Cart contents.
 */
wc.render.declareRefreshController({
    id: "MiniShopCartContentsController",
    renderContext: wc.render.getContextById("MiniShopCartContentsContext"),
    url: "",
    formId: ""

    /** 
     * Indicate that the mini cart contents are out of date upon an order change action.
     * This function is called when a modelChanged event is detected. 
     * 
     * @param {string} message The model changed event message
     * @param {object} widget The registered refresh area
     */
    ,
    modelChangedHandler: function(message, widget) {
        var controller = this;
        var renderContext = this.renderContext;
        if (message.actionId in order_updated || message.actionId == 'AjaxDeleteOrderItemForShippingBillingPage') {
            if (message.actionId == 'AddOrderItem' || message.actionId == 'AjaxAddOrderItem') {
                /* param.addedOrderItemId = message.orderItemId + "";
                            showDropdown = true;
                            var availableInfoOrderItemIds = "";
                            for(productId in productAddedList){
                            	if(availableInfoOrderItemIds != ""){ 
                            		availableInfoOrderItemIds += ",";
                            	}
                            	availableInfoOrderItemIds += productId;
                            }
                            param.availableInfoOrderItemIds = availableInfoOrderItemIds;
                         */
                renderContext.properties.status = "load";
                renderContext.properties.relativeId = "minicartSection";
                renderContext.properties.contentId = "quick_cart_container";
                renderContext.properties.contentType = "orderItemsList";
                renderContext.properties.page_view = "dropdown";
                renderContext.properties.flag = "true"
                renderContext.properties.deleteCartCookie = true;
                renderContext.properties.fetchCartContents = true;
                renderContext.properties.serviceId = message.serviceId;
                widget.refresh(renderContext.properties);
                isUpdateCookie = true;
                dropdownUpdated = true;
            }
            if (renderContext.properties.refreshCart == 'true') {
                delete renderContext.properties['load'];
                delete renderContext.properties['relativeId'];
                delete renderContext.properties['contentId'];
                delete renderContext.properties['contentType'];
                delete renderContext.properties['page_view'];
                delete renderContext.properties['flag'];
                delete renderContext.properties['fetchCartContents'];
                renderContext.properties.deleteCartCookie = true;
                widget.refresh(renderContext.properties);
            }

        }
    }


    /** 
     * Refreshes the mini shopping cart contents since it is out of date.
     * This function is called when a render context changed event is detected. 
     * 
     * @param {string} message The model changed event message
     * @param {object} widget The registered refresh area
     */
    ,
    renderContextChangedHandler: function(message, widget) {
        var controller = this;
        var renderContext = this.renderContext;
        if (renderContext.properties.refreshCart == 'true') {
            if (controller.testForChangedRC(["status"])) {
                renderContext.properties.deleteCartCookie = true;
                widget.refresh(renderContext.properties);
            }
        } else {
            if (!dropdownUpdated) {
                renderContext.properties.fetchCartContents = true;
                dropdownUpdated = true;
                widget.refresh(renderContext.properties);
            }
        }

    }

    /** 
     * Displays and positions the mini shop cart contents.
     * This function is called after a successful refresh. 
     * 
     * @param {object} widget The registered refresh area
     */
    ,
    postRefreshHandler: function(widget) {
            var controller = this;
            var renderContext = this.renderContext;
            destroyDialog("quick_cart_container");
            if (renderContext.properties.refreshCart == 'true') {
                if (!multiSessionEnabled) {
                    if (screen.width <= 768)
                        updateOrderItemsCount("true");
                    updateCartCookie();
                    resetDeleteCartCookie();
                    delete renderContext.properties['refreshCart'];
                    dropdownUpdated = false;
                }
            } else {
                if (isUpdateCookie) {
                    if (!multiSessionEnabled) {
                        updateCartCookie();
                    }
                    if (!multiSessionEnabled) {
                        resetDeleteCartCookie();
                    }
                    isUpdateCookie = false;
                    if (screen.width <= 768)
                        updateOrderItemsCount("false");
                    showMiniShopCartDropDown(renderContext.properties.relativeId, renderContext.properties.contentId, renderContext.properties.contentType, renderContext.properties.serviceId);
                } else if (!isUpdateCookie) {
                    loadMiniCart(tggCurrencyId, tggLangId);
                    positionMiniShopCartDropDown(renderContext.properties.relativeId, renderContext.properties.contentId, renderContext.properties.contentType, renderContext.properties.serviceId);
                }
            } // Closing top else statement

        } // closing post refresh
})

/**
 * Store the current mini cart information in the mini cart cookie.
 */
function updateCartCookie() {
    //Save current order information into cookie
    if (document.getElementById("currentOrderQuantity") != null && document.getElementById("currentOrderAmount") != null && document.getElementById("currentOrderCurrency") != null && document.getElementById("currentOrderId") != null && document.getElementById("currentOrderLanguage") != null) {
        var cartQuantity = document.getElementById("currentOrderQuantity").value;
        var cartAmount = document.getElementById("currentOrderAmount").value;
        var cartCurrency = document.getElementById("currentOrderCurrency").value;
        var cartLanguage = document.getElementById("currentOrderLanguage").value;
        var cartOrderId = document.getElementById("currentOrderId").value;

        //Clear out previous cookies
        var orderIdCookie = getCookie("WC_CartOrderId_" + WCParamJS.storeId);
        if (orderIdCookie != null) {
            dojo.cookie("WC_CartOrderId_" + WCParamJS.storeId, null, { expires: -1, path: '/' });
            var cartTotalCookie = getCookie("WC_CartTotal_" + orderIdCookie);
            if (cartTotalCookie != null) {
                dojo.cookie("WC_CartTotal_" + orderIdCookie, null, { expires: -1, path: '/' });
            }
        }
        dojo.cookie("WC_CartOrderId_" + WCParamJS.storeId, cartOrderId, { path: '/' });
        if (cartOrderId != "") {
            dojo.cookie("WC_CartTotal_" + cartOrderId, cartQuantity + ";" + cartAmount + ";" + cartCurrency + ";" + cartLanguage, { path: '/' });
        }
    }
}

function setProductAddedList(newProductAddedList) {
    productAddedList = newProductAddedList;
}
/**
 * Populates the Product Added dropdown upon an add to cart action.
 */
function populateProductAddedDropdown() {

    var search = '"';

    var replaceStr = '\\\\"';
    for (productId in productAddedList) {
        var productDetails = productAddedList[productId];

        if (document.getElementById('MiniShopCartAddedProdName_' + productId) != null && productDetails[0] != null) {
            document.getElementById('MiniShopCartAddedProdName_' + productId).innerHTML = productDetails[0];
        }
        if (document.getElementById('MiniShopCartAddedProdImgSrc_' + productId) != null && productDetails[1] != null) {
            document.getElementById('MiniShopCartAddedProdImgSrc_' + productId).src = productDetails[1];
            document.getElementById('MiniShopCartAddedProdImgSrc_' + productId).alt = productDetails[0];
        }
        if (document.getElementById('MiniShopCartAddedProdPrice_' + productId) != null && productDetails[2] != null) {
            document.getElementById('MiniShopCartAddedProdPrice_' + productId).innerHTML = productDetails[2];
        }
        if (document.getElementById('MiniShopCartAddedProdQty_' + productId) != null && productDetails[3] != null) {
            document.getElementById('MiniShopCartAddedProdQty_' + productId).innerHTML = productDetails[3];
        }

        if (document.getElementById('MiniShopCartAddedProdAttr_' + productId) != null && productDetails[4] != null) {
            document.getElementById('MiniShopCartAddedProdAttr_' + productId).innerHTML = "";

            for (attrName in productDetails[4]) {
                attrValue = productDetails[4][attrName]
                if (attrValue != null && attrValue != 'undefined') {
                    attrValue = attrValue.replace(replaceStr, search).replace(/&amp;/g, "&").replace(/&#039;/g, "'").replace(/&#034;/g, '"');
                }
                document.getElementById('MiniShopCartAddedProdAttr_' + productId).innerHTML += '<div>' + attrName + ': ' + attrValue + '</div>';
            }
        }
    }
    dojo.topic.publish("ProductInfo_Reset");
}

/**
 * Loads mini shop cart info upon page load.
 * @param {String} contextCurrency Current currency selected.
 * @param {String} langId Current language selected.
 */
function loadMiniCart(contextCurrency, langId) {
    var updateCart = false;
    var orderIdCookie = getCookie("WC_CartOrderId_" + WCParamJS.storeId);
    var itemsKey = null;

    //if(checkDeleteCartCookie()){
    //updateCart = true;
    //} else 
    if (orderIdCookie != undefined && orderIdCookie == "") {
        var subtotal = document.getElementById("minishopcart_total_price");
        var formattedSubtotal = null;
        if (dojo.locale == 'iw-il') {
            formattedSubtotal = dojo.currency.format(document.getElementById("currentOrderAmount").value, { symbol: 'symbol', currency: contextCurrency, locale: 'he' });
        } else {
            formattedSubtotal = dojo.currency.format(document.getElementById("currentOrderAmount").value, { symbol: 'symbol', currency: contextCurrency });
        }
        if (formattedSubtotal != null) {
            formattedSubtotal = formattedSubtotal.replace(/,/g, "");
            formattedSubtotal = formattedSubtotal.replace('symbol', shoppingActionsJS.currencySymbol);
        } else {
            formattedSubtotal = document.getElementById("currentOrderAmount").value;
        }
        if (subtotal != null) {
            subtotal.innerHTML = "\n " + formattedSubtotal + "\n ";
        }
        var items = document.getElementById("minishopcart_total");
        if (items != null) {
            var itemsMsg = document.getElementById("currentOrderQuantity").value;
            if (itemsKey != null) {
                itemsMsg = dojo.string.substitute(itemsKey, { 0: document.getElementById("currentOrderQuantity").value });
            }
            if (itemsMsg > 1) {
                itemsMsg += "&nbsp;Items";
            } else {
                itemsMsg += "&nbsp;Item";
            }
            items.innerHTML = "\n " + itemsMsg + "\n ";
        }
        var mobitems = document.getElementById("mobile_minishopcart_total");
        if (screen.width <= 768 && mobitems != null) {
            var itemsMsg = document.getElementById("currentOrderQuantity").value;
            if (itemsKey != null) {
                itemsMsg = dojo.string.substitute(itemsKey, { 0: document.getElementById("currentOrderQuantity").value });
            }
            mobitems.innerHTML = "\n " + itemsMsg + "\n ";
        }
    } else if (orderIdCookie != undefined && orderIdCookie != "") {
        var cartCookie = getCookie("WC_CartTotal_" + orderIdCookie);

        if (cartCookie != undefined && cartCookie != null && cartCookie != "") {
            var orderInfo = cartCookie.split(";");
            if (orderInfo != null && orderInfo.length == 4) {
                //console.log(orderInfo[2]);
                //console.log(contextCurrency);
                //console.log(orderInfo[3]);
                //console.log(langId);

                if (orderInfo[2] == contextCurrency && orderInfo[3] == langId) {
                    var subtotal = document.getElementById("minishopcart_total_price");
                    //console.log(subtotal);
                    if (subtotal != null) {
                        var formattedSubtotal = null;
                        if (dojo.locale == 'iw-il') {
                            formattedSubtotal = dojo.currency.format(orderInfo[1].toString(), { symbol: 'symbol', currency: contextCurrency, locale: 'he' });
                        } else {
                            formattedSubtotal = dojo.currency.format(orderInfo[1].toString(), { symbol: 'symbol', currency: contextCurrency });
                        }
                        if (formattedSubtotal != null) {
                            formattedSubtotal = formattedSubtotal.replace(/,/g, "");
                            formattedSubtotal = formattedSubtotal.replace('symbol', shoppingActionsJS.currencySymbol);
                        } else {
                            formattedSubtotal = orderInfo[1].toString();
                        }
                        subtotal.innerHTML = "\n " + formattedSubtotal + "\n ";
                    }

                    var items = document.getElementById("minishopcart_total");
                    if (items != null) {
                        var itemsMsg = orderInfo[0].toString();
                        if (itemsKey != null) {
                            itemsMsg = dojo.string.substitute(itemsKey, { 0: orderInfo[0].toString() });
                        }
                        if (itemsMsg > 1) {
                            itemsMsg += "&nbsp;Items";
                        } else {
                            itemsMsg += "&nbsp;Item";
                        }
                        items.innerHTML = "\n " + itemsMsg + "\n ";

                    }
                    var mobitems = document.getElementById("mobile_minishopcart_total");
                    if (screen.width <= 768 && mobitems != null) {
                        var itemsMsg = orderInfo[0].toString();
                        if (itemsKey != null) {
                            itemsMsg = dojo.string.substitute(itemsKey, { 0: orderInfo[0].toString() });
                        }
                        mobitems.innerHTML = "\n " + itemsMsg + "\n ";
                    }
                } else {
                    updateCart = true;
                }
            } else {
                updateCart = true;
            }
        } else {
            updateCart = true;
        }
    } else {
        updateCart = true;
    }
    if (updateCart == true) {
        //wc.render.updateContext('MiniShoppingCartContext', {'status':'load'});
    }
}

/**
 * Keeps track of the timer on mouseover of the mini cart.
 */
function handleMiniCartHover() {
    dojo.connect(document.getElementById("widget_minishopcart"), "onmouseover", function() {
        timer = setTimeout(function() { showMiniShopCartDropDown('widget_minishopcart', 'quick_cart_container', 'orderItemsListAutoClose', '') }, 1000);
    });
    dojo.connect(document.getElementById("widget_minishopcart"), "onmouseout", function() {
        clearTimeout(timer);
    });
}

/**
 * Turn on the flag to indicate that the mini cart cookies should be refreshed.
 */
function setDeleteCartCookie() {
    dojo.cookie("WC_DeleteCartCookie_" + WCParamJS.storeId, true, { path: '/' });
}
/**
 * Check whether the mini cart cookies need to be updated or not.
 */
function checkDeleteCartCookie() {
    var deleteCartCookieVal = getCookie("WC_DeleteCartCookie_" + WCParamJS.storeId);

    if (deleteCartCookieVal != undefined && deleteCartCookieVal != "") {
        if (deleteCartCookieVal == 'true') {
            return true;
        }
    }
    return false;
}

/**
 * Delete the flag that indicates the mini cart cookie should be refreshed.
 */
function resetDeleteCartCookie() {
    var deleteCartCookieVal = getCookie("WC_DeleteCartCookie_" + WCParamJS.storeId);

    if (deleteCartCookieVal != null) {
        dojo.cookie("WC_DeleteCartCookie_" + WCParamJS.storeId, null, { expires: -1, path: '/' });
    }
}

/**
 * update order items count in mobile view.
 */
function updateOrderItemsCount(flag) {
    var itemsKey;
    var orderIdCookie = getCookie("WC_CartOrderId_" + WCParamJS.storeId);
    if ((orderIdCookie != undefined && orderIdCookie == "") || flag == "true") // flag true will be executed when shopcart dropdown will not be executed.  
    {
        var mobitems = document.getElementById("mobile_minishopcart_total");
        var itemsMsg = document.getElementById("currentOrderQuantity").value;
        if (itemsKey != null) {
            itemsMsg = dojo.string.substitute(itemsKey, { 0: document.getElementById("currentOrderQuantity").value });
        }
        mobitems.innerHTML = "\n " + itemsMsg + "\n ";
    } else if (orderIdCookie != undefined && orderIdCookie != "") {
        var cartCookie = getCookie("WC_CartTotal_" + orderIdCookie);
        if (cartCookie != undefined && cartCookie != null && cartCookie != "") {
            var orderInfo = cartCookie.split(";");
            if (orderInfo != null && orderInfo.length == 4) {
                var mobitems = document.getElementById("mobile_minishopcart_total");
                var itemsMsg = orderInfo[0].toString();
                if (itemsKey != null) {
                    itemsMsg = dojo.string.substitute(itemsKey, { 0: orderInfo[0].toString() });
                }
                mobitems.innerHTML = "\n " + itemsMsg + "\n ";
            }
        }
    }
}

dojo.topic.subscribe("ProductInfo_Added", setProductAddedList);
