jQuery(document).ready(function($){
  const { __, _x, _n, _nx } = wp.i18n;

  $('#wc_settings_tab_packer_languages_description, #wc_settings_tab_packer_description, #wc_settings_tab_packer_thresholds_description').attr('readonly','readonly');

  /*************************** LANGUAGES SECTION  ******************************/
  var langs_arr;
  function getLangsArray(){
    langs_arr = ($('#wc_settings_tab_packer_languages_description').val()) ? JSON.parse($('#wc_settings_tab_packer_languages_description').val()) : [];
  }
  getLangsArray();

  function braftwspGenLangsTabs(langs_array){

    var item = '';
    if(langs_array !== null){
      for(var i=0; i<langs_array.length; i++){
        lang_code = langs_array[i].lang_code;
        lang_title = langs_array[i].lang_title;
        item += '<span class="braftwsp_langs_item" braftwsp-lang-code="' + lang_code + '" braftwsp-lang-title="' + lang_title + '"><i class="dashicons-before dashicons-no"></i> ' + lang_title + ' - ' + lang_code + '</span>';
        item += '<input type="hidden" class="braftwsp_langs_item_code" value="' + lang_code + '">';
        item += '<input type="hidden" class="braftwsp_langs_item_title" value="' + lang_title + '">';
      }
    }
    else{
      item = '';
    }
    return item;
  }

  function insertLangsContainer(){
    getLangsArray();
    var langs_container = '<div class="braftwsp_langs_container">';
    langs_container += braftwspGenLangsTabs(langs_arr);
    langs_container += '</div>';
    langs_container += braftwsp_settings_obj.select_locale_markup;
    langs_container += '<span class="braftwsp_langs_add dashicons-before dashicons-plus" > ' + __('Add language', 'braft-woo-shipping-packer') + '</span>';
    $('.braftwsp_langs_container + #locale').remove();
    $('.braftwsp_langs_container, .braftwsp_langs_add').remove();
    $(langs_container).insertAfter('#wc_settings_tab_packer_languages_description');
  }
  insertLangsContainer();

  function braftwspUpdateLangsTxt(){
    var count_items = $('.braftwsp_langs_container').find('.braftwsp_langs_item').length;
    var text = '['
    for(var i=0; i<count_items; i++){
      var code = $('.braftwsp_langs_container .braftwsp_langs_item_code').eq(i).val();
      var title = $('.braftwsp_langs_container .braftwsp_langs_item_title').eq(i).val();
      text += '{"lang_code":"' + code + '","lang_title":"' + title + '"},'
    }
    text += ']';
    var txt = text.replace(",]", "]");
    $('#wc_settings_tab_packer_languages_description').val(txt);
  }

  $(document).on('click', '.braftwsp_langs_add', function(){
    var lang_select_code = $('.braftwsp_langs_container + select :selected').val();

    if(lang_select_code === '' || typeof(lang_select_code) === 'undefined' || lang_select_code === null){
      lang_select_code = 'en_US';
    }
    var lang_select_title = $('.braftwsp_langs_container + select :selected').text();
    var element = '<span class="braftwsp_langs_item" braftwsp-lang-code="' + lang_select_code + '" braftwsp-lang-title="' + lang_select_title + '"><i class="dashicons-before dashicons-no"></i> ' + lang_select_title + ' - ' + lang_select_code + '</span>'
    element += '<input type="hidden" class="braftwsp_langs_item_code" value="' + lang_select_code + '">';
    element += '<input type="hidden" class="braftwsp_langs_item_title" value="' + lang_select_title + '">';
    $('.braftwsp_langs_container').append(element);
    braftwspUpdateLangsTxt();
  });

  $(document).on('click', '.braftwsp_langs_item i', function(e){
    e.stopPropagation();
    $(this).parent().find('+ .braftwsp_langs_item_code').remove();
    $(this).parent().find('+ .braftwsp_langs_item_title').remove();
    $(this).parent().remove();
    braftwspUpdateLangsTxt();
  });

  /*************************** BOXES SECTION  **********************************/
  var txt_val, boxes_arr, flat_rates, flat_titles;
  function getBoxesArrays(){
    txt_val = ($('#wc_settings_tab_packer_description').val()) ? $('#wc_settings_tab_packer_description').val() : null;
    boxes_arr = (txt_val !== null) ? JSON.parse(txt_val) : [];
    flat_rates = (braftwsp_settings_obj.flat_rates_titles) ? braftwsp_settings_obj.flat_rates_titles : null;
    flat_titles = (flat_rates !== null) ? JSON.parse(flat_rates) : [];
  }
  getBoxesArrays();

  function braftwspGenBoxTabs(boxes_array, langs_array, status_class){

    var item = '';
    if(boxes_array !== null && langs_array !== null){
      var parameters = boxes_array.parameters.split(",");
      item += '<span class="braftwsp_box_item ' + status_class + '"><i class="dashicons-before dashicons-no"></i> ' + boxes_array.name + '</span>';
      item += '<div class="braftwsp_box_item_wrapper ' + status_class + '">';
      item += '<div class="braftwsp_box_item_inner">';
      item += '<input type="hidden" class="braftwsp_box_index" value="' + parameters[0] + '">';
      item += '<img class="braftwsp_box_item_check" src="' + braftwsp_settings_obj.check_icon_url + '">';
      item += '<img class="braftwsp_box_item_close" src="' + braftwsp_settings_obj.close_icon_url + '">';
      item += '<div>';
      item += '<span>' + __('Box name: ', 'braft-woo-shipping-packer') + '</span>';
      item += '<input type="text" class="braftwsp_box_name" value="' + boxes_array.name + '"><br><hr>';
      item += '<span>' + __('Outer width: ', 'braft-woo-shipping-packer') + '</span>';
      item += '<input type="number" step="0.01" class="braftwsp_box_owidth" value="' + parameters[0] + '"> ' + braftwsp_settings_obj.dimension_unit + ' <br>';
      item += '<span>' + __(' Outer length: ', 'braft-woo-shipping-packer') + '</span>';
      item += '<input type="number" step="0.01" class="braftwsp_box_olength" value="' + parameters[1] + '"> ' + braftwsp_settings_obj.dimension_unit + ' <br>';
      item += '<span>' + __(' Outer height: ', 'braft-woo-shipping-packer') + '</span>';
      item += '<input type="number" step="0.01" class="braftwsp_box_oheight" value="' + parameters[2] + '"> ' + braftwsp_settings_obj.dimension_unit + ' <br>';
      item += '<span>' + __(' Box weight: ', 'braft-woo-shipping-packer') + '</span>';
      item += '<input type="number" step="0.01" class="braftwsp_box_weight" value="' + parameters[3] + '"> ' + braftwsp_settings_obj.weight_unit + ' <br><hr>';
      item += '<span>' + __('Inner width: ', 'braft-woo-shipping-packer') + '</span>';
      item += '<input type="number" step="0.01" class="braftwsp_box_iwidth" value="' + parameters[4] + '"> ' + braftwsp_settings_obj.dimension_unit + ' <br>';
      item += '<span>' + __(' Inner length: ', 'braft-woo-shipping-packer') + '</span>';
      item += '<input type="number" step="0.01" class="braftwsp_box_ilength" value="' + parameters[5] + '"> ' + braftwsp_settings_obj.dimension_unit + ' <br>';
      item += '<span>' + __(' Inner height: ', 'braft-woo-shipping-packer') + '</span>';
      item += '<input type="number" step="0.01" class="braftwsp_box_iheigth" value="' + parameters[6] + '"> ' + braftwsp_settings_obj.dimension_unit + ' <br>';
      item += '<span>' + __(' Max weigth: ', 'braft-woo-shipping-packer') + '</span>';
      item += '<input type="number" step="0.01" class="braftwsp_box_maxweight" value="' + parameters[7] + '"> ' + braftwsp_settings_obj.weight_unit + ' <br><hr>';
      for(var i=0; i<langs_array.length; i++){
        item += '<span>' + __('Box price ', 'braft-woo-shipping-packer') + langs_array[i].lang_title + ' - ' + langs_array[i].lang_code + ': </span>';
        item += '<input type="number" step="0.01" class="braftwsp_box_price ' + langs_array[i].lang_code + '" value="' + boxes_array['box_price_' + langs_array[i].lang_code] + '"> <br>';
      }
      item += '</div>';
      item += '</div>';
      item += '</div>';
    }
    else{
      item = '';
    }
    return item;
  }

  function insertBoxesContainer(){
    getBoxesArrays();
    var box_items = '';
    var boxes_container = '<div class="braftwsp_boxes_container">';
    var count_boxes_arr = (boxes_arr !== null) ? boxes_arr.length : 0;
    for(var i=0; i<count_boxes_arr; i++){
      box_items += braftwspGenBoxTabs(boxes_arr[i], langs_arr, 'exists');
    }
    boxes_container += box_items;
    boxes_container += '</div>';
    boxes_container += '<span class="braftwsp_boxes_add dashicons-before dashicons-plus"> ' + __('Add box', 'braft-woo-shipping-packer') + '</span>';
    $('.braftwsp_boxes_container, .braftwsp_boxes_add').remove();
    $(boxes_container).insertAfter('#wc_settings_tab_packer_description');
  }
  insertBoxesContainer();

  $(document).on('click', '.braftwsp_box_item_close', function(){
    $(this).parent().parent().removeClass('open');
    $('.braftwsp_boxes_container .new').remove();
  });

  function braftwspUpdateTxtarea(){
    var count = $('.braftwsp_box_item_wrapper').length;
    var items = [];
    for(var c=0; c<count; c++){
      var longest = $('.braftwsp_box_item_wrapper').eq(c).find('.braftwsp_box_index').val();
      var tab_obj = $('.braftwsp_box_item').eq(c)
      var wrapper_obj = $('.braftwsp_box_item_wrapper').eq(c);
      items[c] = {"longest":longest,"tab":tab_obj,"item":wrapper_obj};
    }
    items.sort(function(a,b){
      return a.longest - b.longest;
    });
    for(var d=0; d<count; d++){
      $(items[d].tab).appendTo('.braftwsp_boxes_container');
      $(items[d].item).appendTo('.braftwsp_boxes_container');
    }
    var textarea = '[';
    for(var i=0; i<count; i++){
      textarea += '{';
      var inputs = $('.braftwsp_box_item_wrapper').eq(i).find('input');
      textarea += '"name":"' + $('.braftwsp_box_item_wrapper').eq(i).find('input.braftwsp_box_name').val() + '",';

      textarea += '"parameters":"' +
      $('.braftwsp_box_item_wrapper').eq(i).find('input').eq(2).val() + ',' +
      $('.braftwsp_box_item_wrapper').eq(i).find('input').eq(3).val() + ',' +
      $('.braftwsp_box_item_wrapper').eq(i).find('input').eq(4).val() + ',' +
      $('.braftwsp_box_item_wrapper').eq(i).find('input').eq(5).val() + ',' +
      $('.braftwsp_box_item_wrapper').eq(i).find('input').eq(6).val() + ',' +
      $('.braftwsp_box_item_wrapper').eq(i).find('input').eq(7).val() + ',' +
      $('.braftwsp_box_item_wrapper').eq(i).find('input').eq(8).val() + ',' +
      $('.braftwsp_box_item_wrapper').eq(i).find('input').eq(9).val() +
      '",';
      for(var a=0; a<langs_arr.length; a++){
        textarea += '"box_price_' + langs_arr[a].lang_code + '":"' + $('.braftwsp_box_item_wrapper').eq(i).find('input.' + langs_arr[a].lang_code).val() + '",';
      }
      textarea += '},';
      var item_val = $('.braftwsp_box_item_wrapper').eq(i).find('input.braftwsp_box_name').val();
      $('.braftwsp_boxes_container').find('.braftwsp_box_item').eq(i).text(item_val);
      $('.braftwsp_thresh_container').find('.braftwsp_box_item').eq(i).prepend('<i class="dashicons-before dashicons-no"></i>');
    }
    textarea += ']';
    var txt1 = textarea.split(',}').join('}');
    var txt = txt1.replace(",]", "]");

    $('#wc_settings_tab_packer_description').val(txt);
  }

  $(document).on('click', '.braftwsp_box_item_check', function(){
    if($(this).parent().parent().hasClass('new')){
      $('.braftwsp_box_item_wrapper, .braftwsp_box_item').removeClass('new');
    }
    braftwspUpdateTxtarea();
    $(this).parent().parent().removeClass('open');
  });

  $(document).on('click', '.braftwsp_box_item', function(){
    $('+ .braftwsp_box_item_wrapper', this).addClass('open');
  });

  $(document).on('click', '.braftwsp_boxes_add', function(){
    getLangsArray();
    var boxes_arr = [];
    obj = {
      "name":"new_box",
      "parameters":"0,0,0,0,0,0,0,0"
    }
    for(var a=0; a<langs_arr.length; a++){
      var price = 0;
      obj['box_price_' + langs_arr[a].lang_code] = price;
    }
    boxes_arr.push(obj);
    var new_box = braftwspGenBoxTabs(boxes_arr[0], langs_arr, 'new');
    $('.braftwsp_boxes_container').append(new_box);
    $('.braftwsp_boxes_container > div:last-child').addClass('open');
  });

  $(document).on('click', '.braftwsp_box_item i', function(e){
    e.stopPropagation();
    $(this).parent().find('+ .braftwsp_box_item_wrapper').remove();
    $(this).parent().remove();
    braftwspUpdateTxtarea();
  });

  /******************************** THRESHOLDS SECTION ************************/
  var txt_thresh_val, thresh_arr;
  function getThreshArrays(){
    txt_thresh_val = ($('#wc_settings_tab_packer_thresholds_description').val()) ? $('#wc_settings_tab_packer_thresholds_description').val() : null;
    thresh_arr = (txt_thresh_val !== null) ? JSON.parse(txt_thresh_val) : [];
  }
  getThreshArrays();

  function braftwspGenThreshTabs(thresh_array, langs_array, status_class){

    var item = '';
    if(thresh_array !== null){
      item += '<span class="braftwsp_thresh_item ' + status_class + '"><i class="dashicons-before dashicons-no"></i> ' + flat_titles[0][thresh_array.name] + ' - ' + thresh_array.name + '</span>';
      item += '<div class="braftwsp_thresh_item_wrapper ' + status_class + '">';
      item += '<div class="braftwsp_thresh_item_inner">';
      item += '<img class="braftwsp_thresh_item_check" src="' + braftwsp_settings_obj.check_icon_url + '">';
      item += '<img class="braftwsp_thresh_item_close" src="' + braftwsp_settings_obj.close_icon_url + '">';
      item += '<div class="braftwsp_thresh_item_params">';
      item += '<span>' + __('Rate name: ', 'braft-woo-shipping-packer') + '</span>';
      item += braftwsp_settings_obj.flat_rates_select_list;
      item += '<input type="text" class="braftwsp_thresh_name_main" value="' + thresh_array.name + '" readonly><br>';
      item += '<input type="hidden" class="braftwsp_thresh_title" value="' + flat_titles[0][thresh_array.name] + '">';
      var count_params = thresh_array.parameters.length;
      for(var i=0; i<count_params; i++){
        var thresh_name = thresh_array.parameters[i].name;
        var max_dims = thresh_array.parameters[i].max_dimensions.split(',');
        var max_weight = thresh_array.parameters[i].max_weight;
        var price_pl = thresh_array.parameters[i].price_pl;
        var price_en = thresh_array.parameters[i].price_en;
        item += '<hr><span>' + __('Threshold name: ', 'braft-woo-shipping-packer') + '</span>';
        item += '<input type="text" class="braftwsp_thresh_name" value="' + thresh_name + '"><br>';
        item += '<span>' + __('Max width: ', 'braft-woo-shipping-packer') + '</span>';
        item += '<input type="number" step="0.01" class="braftwsp_thresh_owidth" value="' + max_dims[0] + '">' + braftwsp_settings_obj.dimension_unit + ' ';
        item += '<span>' + __(' Max length: ', 'braft-woo-shipping-packer') + '</span>';
        item += '<input type="number" step="0.01" class="braftwsp_thresh_olength" value="' + max_dims[1] + '">' + braftwsp_settings_obj.dimension_unit + ' <br>';
        item += '<span>' + __(' Max height: ', 'braft-woo-shipping-packer') + '</span>';
        item += '<input type="number" step="0.01" class="braftwsp_thresh_oheight" value="' + max_dims[2] + '">' + braftwsp_settings_obj.dimension_unit + ' ';
        item += '<span>' + __(' Max weight: ', 'braft-woo-shipping-packer') + '</span>';
        item += '<input type="number" step="0.01" class="braftwsp_thresh_weight" value="' + max_weight + '">' + braftwsp_settings_obj.weight_unit + ' <br>';
        for(var a=0; a<langs_array.length; a++){
          item += '<span>' + __('Price ', 'braft-woo-shipping-packer') + langs_array[a].lang_title + ' - ' + langs_array[a].lang_code + ': </span>';
          item += '<input type="number" step="0.01" class="braftwsp_box_price ' + langs_array[a].lang_code + '" value="' + thresh_array.parameters[i]['price_' + langs_array[a].lang_code] + '"> <br>';
        }
      }
      item += '<hr></div>';
      item += '<span class="braftwsp_thresh_add_item dashicons-before dashicons-plus"> ' + __('Add threshold', 'braft-woo-shipping-packer') + '</span>';
      item += '</div>';
      item += '</div>';
    }
    else{
      item = '';
    }
    return item;
  }

  function insertThreshContainer(){
    getThreshArrays();
    var thresh_items = '';
    var thresh_container = '<div class="braftwsp_thresh_container">';
    var count_thresh_arr = (thresh_arr !== null) ? thresh_arr.length : 0;
    for(var i=0; i<count_thresh_arr; i++){
      thresh_items += braftwspGenThreshTabs(thresh_arr[i], langs_arr, 'exists');
    }
    thresh_container += thresh_items;
    thresh_container += '</div>';
    thresh_container += '<span class="braftwsp_thresh_add dashicons-before dashicons-plus"> ' + __('Add shipping rate', 'braft-woo-shipping-packer') + '</span>';
    $('.braftwsp_thresh_container, .braftwsp_thresh_add').remove();
    $(thresh_container).insertAfter('#wc_settings_tab_packer_thresholds_description');
  }
  insertThreshContainer();


  $(document).on('click', '.braftwsp_thresh_item_close', function(){
    $(this).parent().parent().removeClass('open');
    $('.braftwsp_thresh_container .new').remove();
  });

  function braftwspUpdateThreshTxtarea(){
    var count = $('.braftwsp_thresh_item_wrapper').length;

    var textarea = '[';
    for(var i=0; i<count; i++){
      textarea += '{';
      var inputs = $('.braftwsp_thresh_item_wrapper').eq(i).find('input');
      textarea += '"name":"' + $('.braftwsp_thresh_item_wrapper').eq(i).find('input.braftwsp_thresh_name_main').val() + '",';
      var thresh_count = $('.braftwsp_thresh_item_wrapper').eq(i).find('input.braftwsp_thresh_name').length;
      var params = [];

      for(var cc=0; cc<thresh_count; cc++){
        var name = $('.braftwsp_thresh_item_wrapper').eq(i).find('input.braftwsp_thresh_name').eq(cc).val();
        var max_width = $('.braftwsp_thresh_item_wrapper').eq(i).find('input.braftwsp_thresh_owidth').eq(cc).val();
        var max_length = $('.braftwsp_thresh_item_wrapper').eq(i).find('input.braftwsp_thresh_olength').eq(cc).val();
        var max_height = $('.braftwsp_thresh_item_wrapper').eq(i).find('input.braftwsp_thresh_oheight').eq(cc).val();
        var max_weight = $('.braftwsp_thresh_item_wrapper').eq(i).find('input.braftwsp_thresh_weight').eq(cc).val();
        var total = max_width * 2 + (max_length + max_height);
        var obj = {
          "index" : total,
          "name" : name,
          "max_width" : max_width,
          "max_length" : max_length,
          "max_height" : max_height,
          "max_weight" : max_weight
        }
        for(var a=0; a<langs_arr.length; a++){
          var price = $('.braftwsp_thresh_item_wrapper').eq(i).find('input.' + langs_arr[a].lang_code).eq(cc).val();
          obj['price_' + langs_arr[a].lang_code] = price;
        }
        params.push(obj);
      }
      params.sort(function(a,b){
        return a.index - b.index;
      });

      textarea += '"parameters":[';
      for(var a=0; a<thresh_count; a++){
        textarea += '{"name":"' + params[a].name + '",';
        textarea += '"max_dimensions":"' +
        params[a].max_width + ',' +
        params[a].max_length + ',' +
        params[a].max_height +
        '",';
        textarea += '"max_weight":"' + params[a].max_weight + '",';
        for(var dd=0; dd<langs_arr.length; dd++){
          textarea += '"price_' + langs_arr[dd].lang_code + '":"' + params[a]['price_' + langs_arr[dd].lang_code] + '",';
        }
        textarea += '},';
      }
      textarea += ']},';

      var title_val = $('.braftwsp_thresh_item_wrapper').eq(i).find('input.braftwsp_thresh_title').val();
      var item_val = $('.braftwsp_thresh_item_wrapper').eq(i).find('input.braftwsp_thresh_name_main').val();
      $('.braftwsp_thresh_container').find('.braftwsp_thresh_item').eq(i).text(title_val + ' - ' + item_val);
      $('.braftwsp_thresh_container').find('.braftwsp_thresh_item').eq(i).prepend('<i class="dashicons-before dashicons-no"></i>');

    }
    textarea += ']';
    var txt = textarea.split('},]').join('}]');
    var txt2 = txt.split(',}').join('}');
    $('#wc_settings_tab_packer_thresholds_description').val(txt2);
  }

  $(document).on('click', '.braftwsp_thresh_item_check', function(){
    if($(this).parent().parent().hasClass('new')){
      $('.braftwsp_thresh_item_wrapper, .braftwsp_thresh_item').removeClass('new');
    }
    braftwspUpdateThreshTxtarea();
    $(this).parent().parent().removeClass('open');
  });

  $(document).on('click', '.braftwsp_thresh_item', function(){
    $('+ .braftwsp_thresh_item_wrapper', this).addClass('open');
    var rate = $('+ .braftwsp_thresh_item_wrapper', this).find('.braftwsp_thresh_name_main').val();
    $('+ .braftwsp_thresh_item_wrapper', this).find('.braftwsp_thresh_rates').val(rate);
  });

  $(document).on('change', '.braftwsp_thresh_item_wrapper .braftwsp_thresh_rates', function(){
    var val = $(this).val();
    $('+ .braftwsp_thresh_name_main', this).val(val);
    var txt = $(this).parent().find('.braftwsp_thresh_rates :selected').text();
    $(this).parent().find('.braftwsp_thresh_title').val(txt);
  });

  $(document).on('click', '.braftwsp_thresh_add', function(){
    getLangsArray();
    var thresh_arr = [];
    obj = {
      "name":"new_rate",
      "parameters":[{
        "name":"new_thresh",
        "max_dimensions":"0,0,0",
        "max_weight":"0"
      }]
    }
    for(var a=0; a<langs_arr.length; a++){
      var price = 0;
      obj['parameters'][0]['price_' + langs_arr[a].lang_code] = price;
    }
    thresh_arr.push(obj);
    var new_rate = braftwspGenThreshTabs(thresh_arr[0], langs_arr, 'new');
    $('.braftwsp_thresh_container').append(new_rate);
    $('.braftwsp_thresh_container > div:last-child').addClass('open');
    var sel_rate = $('.braftwsp_thresh_item_wrapper.new').find('.braftwsp_thresh_rates :selected').val();
    $('.braftwsp_thresh_item_wrapper.new').find('.braftwsp_thresh_name_main').val(sel_rate);
    var sel_rate_txt = $('.braftwsp_thresh_item_wrapper.new').find('.braftwsp_thresh_rates :selected').text();
    var title_val = $('.braftwsp_thresh_item_wrapper.new').find('input.braftwsp_thresh_title').val(sel_rate_txt);
  });

  $(document).on('click', '.braftwsp_thresh_add_item', function(){
    var item = '';
    item += '<hr><span>' + __('Threshold name: ', 'braft-woo-shipping-packer') + '</span>';
    item += '<input type="text" class="braftwsp_thresh_name" value="new_threshold"><br>';
    item += '<span>' + __('Max width: ', 'braft-woo-shipping-packer') + '</span>';
    item += '<input type="number" step="0.01" class="braftwsp_thresh_owidth" value="0">' + braftwsp_settings_obj.dimension_unit + ' ';
    item += '<span>' + __(' Max length: ', 'braft-woo-shipping-packer') + '</span>';
    item += '<input type="number" step="0.01" class="braftwsp_thresh_olength" value="0">' + braftwsp_settings_obj.dimension_unit + ' <br>';
    item += '<span>' + __(' Max height: ', 'braft-woo-shipping-packer') + '</span>';
    item += '<input type="number" step="0.01" class="braftwsp_thresh_oheight" value="0">' + braftwsp_settings_obj.dimension_unit + ' ';
    item += '<span>' + __(' Max weight: ', 'braft-woo-shipping-packer') + '</span>';
    item += '<input type="number" step="0.01" class="braftwsp_thresh_weight" value="0">' + braftwsp_settings_obj.weight_unit + ' <br>';
    for(var a=0; a<langs_arr.length; a++){
      var price = 0;
      obj['parameters'][0]['price_' + langs_arr[a].lang_code] = price;
      item += '<span>' + __('price : ', 'braft-woo-shipping-packer') + langs_arr[a].lang_title + ' - ' + langs_arr[a].lang_code + '</span>';
      item += '<input type="number" step="0.01" class="braftwsp_thresh_price ' + langs_arr[a].lang_code + '" value="0"> <br>';
    }
    $(this).parent().parent().find('.braftwsp_thresh_item_params').append(item);
    var d = $(this).parent();
    d.scrollTop(d.prop("scrollHeight"));
  });

  $(document).on('click', '.braftwsp_thresh_item i', function(e){
    e.stopPropagation();
    $(this).parent().find('+ .braftwsp_thresh_item_wrapper').remove();
    $(this).parent().remove();
    braftwspUpdateThreshTxtarea();
  });

  /***************************** JSON BACKUP **************************/
  function updateBackupJSON(){
    var langs = $('#wc_settings_tab_packer_languages_description').val();

    var obj = '{';
    obj += '"languages":' + langs + ',';
    var boxes  = $('#wc_settings_tab_packer_description').val();
    obj += '"boxes":' + boxes + ',';
    var rates = $('#wc_settings_tab_packer_thresholds_description').val();
    obj += '"rates":' + rates;
    obj += '}';
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    $('.braftwsp_json_backup').remove();
    $('<a class="braftwsp_json_backup" href="data:' + data + '" download="data.json">download JSON</a>').insertAfter('.braftwsp_json_backup_button');
  }

  function updateTextfile(){
    var w_un = braftwsp_settings_obj.weight_unit;
    var d_un = braftwsp_settings_obj.dimension_unit;
    var langs = JSON.parse($('#wc_settings_tab_packer_languages_description').val());
    var obj = '#####################  LANGUAGES  #####################\n';
    for(var i=0; i<langs.length; i++){
      obj += langs[i].lang_title + ' | ';
    }

    var boxes  = JSON.parse($('#wc_settings_tab_packer_description').val());
    obj += '\n\n#####################  BOXES  #####################';
    for(var ii=0; ii<boxes.length; ii++){
      var dimensions = boxes[ii].parameters.split(',');
      obj += '\n* ' + boxes[ii].name + ': ' +
      __('outer dimensions', 'braft-woo-shipping-packer') + ' (' +
      dimensions[0] + d_un + 'x' + dimensions[1] + d_un + 'x' + dimensions[2] + d_un +
      '); ' +
      __('inner dimensions', 'braft-woo-shipping-packer') + ' (' +
      dimensions[4] + d_un + 'x' + dimensions[5] + d_un + 'x' + dimensions[6] + d_un +
      '); ' +
      __('box weight', 'braft-woo-shipping-packer') + ' (' + dimensions[3] + w_un + ');\n  ' +
      __('max weight', 'braft-woo-shipping-packer') + ' (' + dimensions[7] + w_un + '); ';
      for(var a=0; a<langs.length; a++){
        obj += __('box price ', 'braft-woo-shipping-packer') + langs[a].lang_code + ' (' + boxes[ii]['box_price_' + langs[a].lang_code] + '); ';
      }
    }

    var fr_titles = JSON.parse(braftwsp_settings_obj.flat_rates_titles);
    var rates = JSON.parse($('#wc_settings_tab_packer_thresholds_description').val());
    obj += '\n\n#####################  SHIPPING RATES  #####################\n';
    for(var iii=0; iii<rates.length; iii++){
      obj += '  *** ' + fr_titles[0][rates[iii].name] + ' - ' + rates[iii].name + ' ***\n';
      for(var c=0; c<rates[iii].parameters.length; c++){
        obj += '    - ' + rates[iii].parameters[c].name + ' - ';
        var max_d = rates[iii].parameters[c].max_dimensions.split(',');
        var max_w = rates[iii].parameters[c].max_weight;
        obj += __('max dimensions ', 'braft-woo-shipping-packer') + '(' +
        max_d[0] + d_un + 'x' + max_d[1] + d_un + 'x' + max_d[2] + d_un +
        '); ';
        obj += __('max weight', 'braft-woo-shipping-packer') + ' (' + max_w + w_un + '); ';
        for(var aa=0; aa<langs.length; aa++){
          obj += __('price ', 'braft-woo-shipping-packer') + langs[aa].lang_code + ' (' + rates[iii].parameters[c]['price_' + langs[aa].lang_code] + '); ';
        }
        obj += '\n';
      }
      obj += '\n';
    }
    var data = "text/plain;charset=utf-8," + encodeURIComponent(obj);
    $('.braftwsp_json_textfile').remove();
    $('<a class="braftwsp_json_textfile" href="data:' + data + '" download="data.txt">download TXT file</a>').insertAfter('.braftwsp_json_textfile_button');

  }


  $('<div class="braftwsp_json_backup_container"></div>').insertAfter('#wc_settings_tab_packer_backup_description');
  $('<span class="braftwsp_json_backup_button dashicons-before dashicons-download">' + __(' Backup to JSON file', 'braft-woo-shipping-packer') + '</span>').appendTo('.braftwsp_json_backup_container');
  $('<br><br><label for="braftwsp_json_restore" class="braftwsp_json_restore dashicons-before dashicons-upload">' + __(' Restore from JSON file', 'braft-woo-shipping-packer') + '</label><input type="file" id="braftwsp_json_restore" accept="text/json">').appendTo('.braftwsp_json_backup_container');
  $('<br><br><span class="braftwsp_json_textfile_button dashicons-before dashicons-text-page">' + __(' Create TXT file', 'braft-woo-shipping-packer') + '</span>').appendTo('.braftwsp_json_backup_container');

  $(document).on('click', '.braftwsp_json_backup_button', function(){
    updateBackupJSON();
  });

  function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  function onReaderLoad(event){

    var obj = JSON.parse(event.target.result);
    var obj2 = JSON.parse(obj);
    //console.log('obj2: ', obj2);
    //alert_data(JSON.stringify(obj2.languages));
    document.getElementById('wc_settings_tab_packer_languages_description').value = JSON.stringify(obj2.languages);
    document.getElementById('wc_settings_tab_packer_description').value = JSON.stringify(obj2.boxes);
    document.getElementById('wc_settings_tab_packer_thresholds_description').value = JSON.stringify(obj2.rates);
    insertLangsContainer();
    insertBoxesContainer();
    insertThreshContainer();
  }

  function alert_data(obj){
    //alert('obj : ' + obj);
  }

  if($('#braftwsp_json_restore').length > 0){
    document.getElementById('braftwsp_json_restore').addEventListener('change', onChange);
  }


  $(document).on('click', '.braftwsp_json_textfile_button', function(){
    updateTextfile();
  });

});/* end doc ready */
