$(document).on('click', '.jc-cart-remove', function(e){
    e.preventDefault();
    var updates = {};
    $(this).data('properties').forEach((property, index) => {
        if (index !=0 ){
            const variantID = property[1];        
            const key = $(`.item[data-item-id="${variantID}"]`).data('item-key');
            console.log(key, "key")
            updates[key] = 0;
        }
       
    });
    updates[$(this).closest('.item').data('item-key')] = 0;
    $.ajax({
        type: 'POST',
        url: '/cart/update.js',
        data: {
          updates:updates
        },
        dataType: 'json', 
        async:false,  // Be warned, async:false has been deprecated in jQuery for a long time and is not recommended for use. It's generally recommended to use callbacks or promises instead
        success: function(){window.location.href= '/cart';}
       
    });
});

function changeItem(_this) {
    var updates = {};
    let $cartpc = _this.val();
    let mainProductId = _this.closest('.item').data('item-id');
    let palletNum = _this.data('properties')[0][1];
    let subProductId1 = _this.data('properties')[1][1];
    let subProductId2 = _this.data('properties')[2][1];
    let $pallet_val = Math.ceil($cartpc / palletNum);
    let $breaking_val = $cartpc % palletNum;
   

    var key = $(`.item[data-item-id="${subProductId1}"]`).data('item-key');
    updates[key] = 0;

    if($(`.item[data-item-id="${subProductId2}"]`).length > 0) {
        key = $(`.item[data-item-id="${subProductId2}"]`).data('item-key');
        updates[key] = 0;
    }

    updates[_this.closest('.item').data('item-key')] = 0;

    var data = {
        items: [
            {
                id: mainProductId,
                quantity: $cartpc,
                properties: {
                    '_pallet_num': palletNum,
                    '_subproduct_id_0': subProductId1,
                    '_subproduct_id_1': subProductId2
                }
            },
            {
                id: subProductId1,
                quantity: $pallet_val,
                properties: {
                    '_mainproduct_id': mainProductId
                }
            }
        ]
    }

    if ($breaking_val != 0) {
        data = {
            items: [
                {
                    id: mainProductId,
                    quantity: $cartpc,
                    properties: {
                        '_pallet_num': palletNum,
                        '_subproduct_id_0': subProductId1,
                        '_subproduct_id_1': subProductId2
                    }
                },
                {
                    id: subProductId1,
                    quantity: $pallet_val,
                    properties: {
                        '_mainproduct_id': mainProductId
                    }
                },
                {
                    id: subProductId2,
                    quantity: 1,
                    properties: {
                        '_mainproduct_id': mainProductId
                    }
                }
            ]
        }
    }

    itemsUpdate();
    
    function itemsUpdate() {
        $.ajax({
            type: 'POST',
            url: '/cart/update.js',
            data: {
                updates:updates
            },
            dataType: 'json',
            async:false,  // Be warned, async:false has been deprecated in jQuery for a long time and is not recommended for use. It's generally recommended to use callbacks or promises instead
            success: function(){
                $.ajax({
                    type: 'POST',
                    url: '/cart/add.js',
                    data: data,
                    dataType: 'json',
                    async:false,  // Be warned, async:false has been deprecated in jQuery for a long time and is not recommended for use. It's generally recommended to use callbacks or promises instead
                    success: function(){
                        window.location.href= '/cart';
                    }
                });
            }
        })
    }
}

$(document).on('change', '.jc-cart-value', function(e) {
    e.preventDefault();
    changeItem($(this));
})

$('.jc-cart .minus').click(function(e){
    e.preventDefault();
    var $input = $(this).closest('.jc-cart').find('input');
    let qty = $input.val();
    if(qty > 0) {
        $input.val(qty - 1);
        changeItem($input);
    }
});

$('.jc-cart .plus').click(function(e){
    e.preventDefault();
    var $input = $(this).closest('.jc-cart').find('input');
    let qty = $input.val();
    $input.val(Number(qty) + 1);
    changeItem($input);
});