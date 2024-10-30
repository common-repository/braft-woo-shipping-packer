<?php
/*
Plugin Name: BRAFT Woo Shipping Packer
Plugin URI: https://braft.pl
Version: 1.0.1
Author: <a href="https://braft.pl">BRAFT</a>
Description: Woocommerce addon to calculate shipping container and costs.
Text Domain: braft-woo-shipping-packer
Domain Path: /languages
License: GPLv3
*/
require plugin_dir_path( __FILE__ ) . '/vendor/autoload.php';
use DVDoug\BoxPacker\Packer;
use DVDoug\BoxPacker\VolumePacker;
use DVDoug\BoxPacker\ItemList;
use DVDoug\BoxPacker\Test\TestBox;  // use your own `Box` implementation
use DVDoug\BoxPacker\Test\TestItem;

defined( 'ABSPATH' ) or die();
$abspath = str_replace ( '\\' , '/' , ABSPATH );
require_once( $abspath . 'wp-admin/includes/upgrade.php' );

function braftwsp_activation(){
  $files_list = array( 'braft-woo-shipping-packer-pl_PL.mo', 'braft-woo-shipping-packer-pl_PL.po' );
  $files_count = count($files_list);
  for($i=0; $i<$files_count; $i++){
    copy( plugin_dir_path( __FILE__ ) . '/languages/' . $files_list[$i] , WP_CONTENT_DIR . '/languages/plugins/' . $files_list[$i] );
  }

  register_uninstall_hook( __FILE__, 'braftwsp_uninstall' );
}
register_activation_hook( __FILE__, 'braftwsp_activation' );

function braftwsp_uninstall(){
  $options = array(
    'wc_settings_tab_packer_languages_description',
    'wc_settings_tab_packer_description',
    'wc_settings_tab_packer_thresholds_description'
  );
  for( $i = 0; $i < count( $options ); $i++ ){
    delete_option( $options[$i] );
  }
}

/****************************** ADD PACKER TAB TO WC SETTINGS ***************/
add_filter( 'woocommerce_settings_tabs_array','braftwsp_add_settings_tab', 50 );
function braftwsp_add_settings_tab( $settings_tabs ) {
  $settings_tabs['settings_tab_packer'] = __( 'Packer', 'braft-woo-shipping-packer' );
  return $settings_tabs;
}

add_action( 'woocommerce_settings_tabs_settings_tab_packer', 'braftwsp_settings_tab' );

function braftwsp_settings_tab() {
  woocommerce_admin_fields( braftwsp_get_settings() );
}

function braftwsp_get_settings() {
  include plugin_dir_path( __FILE__ ) . '/inc/braftwsp-settings.php';
  return apply_filters( 'wc_settings_tab_packer_settings', $settings );
}

add_action( 'woocommerce_update_options_settings_tab_packer', 'braftwsp_update_settings' );
function braftwsp_update_settings() {
  woocommerce_update_options( braftwsp_get_settings() );
}

/******************************* BOX TYPE ADMIN EMAIL ***********************/
add_action('woocommerce_checkout_create_order', 'braftwsp_before_checkout_create_order', 20, 2);
function braftwsp_before_checkout_create_order( $order, $data ) {
  $retrived_group_input_value = WC()->session->get( 'braftwsp_box_name' );
  $order->update_meta_data( '_braftwsp_box_name', $retrived_group_input_value );
}

add_action( 'woocommerce_email_after_order_table', 'braftwsp_add_package_type_to_order_email', 10, 2 );
function braftwsp_add_package_type_to_order_email( $order, $is_admin_email ) {
  if( $is_admin_email ){
    echo '<h2>' .  __('Box type: ', 'braft-woo-shipping-packer' ) . $order->get_meta( '_braftwsp_box_name' ) . '</h2>';
  }
}

/******************************** SHIPPING RATES FILTER ********************/
add_filter( 'woocommerce_package_rates', 'braftwsp_change_shipping_value' );
function braftwsp_change_shipping_value( $rates, $packages = array() ) {
  $shipping_packages = WC()->cart->get_shipping_packages();
  $flat_rates = [];
  $index = 0;
  foreach( array_keys( $shipping_packages ) as $key ) {
    if( $shipping_for_package = WC()->session->get('shipping_for_package_'.$key) ) {
      if( isset($shipping_for_package['rates']) ) {
        // Loop through customer available shipping methods
        foreach ( $shipping_for_package['rates'] as $rate_key => $rate ) {
          $rate_id = $rate->id; // the shipping method rate ID (or $rate_key)
          $flat_rates[$index] = $rate_id;
          $index++;
        }
      }
    }
  }

  global $woocommerce;
  $shipping_methods = WC()->shipping->get_shipping_methods();
  $chosen_shipping_method = WC()->session->get('chosen_shipping_methods');
  $current_locale = get_locale();
  $w_unit = get_option('woocommerce_weight_unit');
  $d_unit = get_option('woocommerce_dimension_unit');

  // prepare available boxes
  $boxes_decoded = json_decode( get_option( 'wc_settings_tab_packer_description', true ), true );
  $box_count = ( $boxes_decoded ) ? count( $boxes_decoded ) : 0;
  $boxes = array();
  for( $i = 0; $i < $box_count; $i++ ){
    $box_name = $boxes_decoded[$i]['name'];
    $box_params = explode( ',', $boxes_decoded[$i]['parameters'] );

    $boxes[$i] = new TestBox(
      $box_name, floatval( $box_params[0] ), floatval( $box_params[1] ), floatval( $box_params[2] ), floatval( $box_params[3] ),
      floatval( $box_params[4] ), floatval( $box_params[5] ), floatval( $box_params[6] ), floatval( $box_params[7] )
    );
  }

  // prepare available items
  $cart_items = $woocommerce->cart->get_cart();
  $items = new ItemList();
  foreach ( $cart_items as $item_id => $values ) {
    for( $a = 0; $a < $values['quantity']; $a++){
      $_product = $values['data'];
      $length = $_product->length;
      $width = $_product->width;
      $height = $_product->height;
      $weight = $_product->weight;
      $items->insert(new TestItem(
        'Item ' . $values['slug'] .  $a,
        floatval( $length ),
        floatval( $width ),
        floatval( $height ),
        floatval( $weight ),
        true)
      );
    }
  }
  // get available thresholds
  $thresh_decoded = json_decode( get_option( 'wc_settings_tab_packer_thresholds_description', true ), true );
  $thresh_count = ( $thresh_decoded ) ? count( $thresh_decoded ) : 0;
  $boxes_vol = array();
  /*
  for( $ia = 0; $ia < $box_count; $ia++){
  $volumePacker = new VolumePacker($boxes[$ia], $items);
  $packedBox = $volumePacker->pack();
  $vol_util = $packedBox->getVolumeUtilisation();
  $itemsInTheBox = $packedBox->getItems();
  $cart_items_count = $woocommerce->cart->cart_contents_count;
  $packed_items_count = count( $itemsInTheBox );
  if( intval( $cart_items_count ) === intval( $packed_items_count ) ){
  $boxes_vol[$ia] = $vol_util;
}
else{
$boxes_vol[$ia] = 0;
}
}
*/
//$best_vol = array_search( max( $boxes_vol ), $boxes_vol );
//$box_name = $boxes_decoded[$best_vol]['name'];
//$box_price = $boxes_decoded[$best_vol]['box_price_' . $current_locale];
$cart_total_weight = $woocommerce->cart->cart_contents_weight;
// loop through boxes, count items
for( $ia = 0; $ia < $box_count; $ia++){
  $volumePacker = new VolumePacker($boxes[$ia], $items);
  $packedBox = $volumePacker->pack();
  $vol_util = $packedBox->getVolumeUtilisation();
  $itemsInTheBox = $packedBox->getItems();
  $cart_items_count = $woocommerce->cart->cart_contents_count;
  $packed_items_count = count( $itemsInTheBox );
  //test if cart items = packed items
  if( intval( $cart_items_count ) === intval( $packed_items_count ) ){
    $box_dimensions = explode( ',', $boxes_decoded[$ia]['parameters'] );
    $box_type = $boxes_decoded[$ia]['name'] .
    ' (' .
    $box_dimensions[0] . $d_unit . 'x' .
    $box_dimensions[1] . $d_unit . 'x' .
    $box_dimensions[2] . $d_unit .
    ')';
    // prepare box type for admin email
    WC()->session->set( 'braftwsp_box_name', $box_type );
    $box_name = $boxes_decoded[$ia]['name'];
    $box_price = $boxes_decoded[$ia]['box_price_' . $current_locale];
    //loop through available shipping rates
    for( $i2 = 0; $i2 < $thresh_count; $i2++ ){
      $rate_name = $thresh_decoded[$i2]['name'];
      $rate_name_global = $rate_name;
      $flat_rates[$i2] = $rate_name;
      // loop through available thresholds of current rate
      for( $c = 0; $c < count( $thresh_decoded[$i2]['parameters'] ); $c++ ){
        // sorting dimensions for comparison
        $box_dim = array( $box_dimensions[0], $box_dimensions[1], $box_dimensions[2] );
        sort( $box_dim );
        $thresh_dimensions = explode( ',', $thresh_decoded[$i2]['parameters'][$c]['max_dimensions'] );
        sort( $thresh_dimensions );
        $thresh_weight = $thresh_decoded[$i2]['parameters'][$c]['max_weight'];
        if(
          floatval( $box_dim[0] ) <= floatval( $thresh_dimensions[0] ) &&
          floatval( $box_dim[1] ) <= floatval( $thresh_dimensions[1] ) &&
          floatval( $box_dim[2] ) <= floatval( $thresh_dimensions[2] ) &&
          floatval( $cart_total_weight ) <= floatval( $thresh_weight )
        ){
          $package_price = $thresh_decoded[$i2]['parameters'][$c]['price_' . $current_locale];
          //stop the loop if box fits the threshold
          break;
        }
        else{
          $package_price = 999999;
        }
      }
      // apply calculated price to current shipping rate
      $rates[$rate_name]->cost = floatval( $box_price ) + floatval( $package_price );
    }
    // stop loop if items fit the box
    break;
  }
  for( $x = 0; $x < count( $flat_rates ); $x++ ){
    $rates[$flat_rates[$x]]->cost = 1000000;
  }
}
// return modified rates
return $rates;
}

/***************************** DEBUG ****************************/
add_action('wp_footer', 'braftwsp_debug');
function braftwsp_debug(){
  global $woocommerce;

  $items = $woocommerce->cart->get_cart();
  foreach ( $items as $item_id => $values ) {

    $_product = $values['data'];
    $width = $_product->depth;
    //echo var_dump( $values['quantity'] );
  }
  $chosen_shipping_methods = WC()->session->get('chosen_shipping_methods');
  //WC()->session->set( 'braftwsp_box_name', 'test' );
  //$braftwsp_box_name = WC()->session->get('braftwsp_box_name');


  $shipping_methods = WC()->shipping->get_shipping_methods();
  $cart_contents_weight = $woocommerce->cart->cart_contents_weight;
  global $wpdb;
  $query = 'SELECT * FROM ' . $wpdb->prefix . 'options WHERE option_name LIKE "woocommerce_flat_rate%"';
  $result = $wpdb->get_results( $query, ARRAY_N );
  $count_rates = ( count( $result ) ) ? count( $result ) : 0;
  $html_select = '<select class="braftwsp_thresh_rates">';
  for( $i = 0; $i < $count_rates; $i++){
    $rate_name = explode( 'woocommerce_', $result[$i][1] );
    $rate_name2 = explode( '_settings', $rate_name[1] );
    $rate_data = maybe_unserialize( $result[$i][2] );
    $rate_title = $rate_data['title'];
    $html_select .= '<option value="' . $rate_name2[0] . '">' . $rate_title . '</option>';
  }
  $html_select .= '</select>';
  $decoded = json_decode( get_option( 'wc_settings_tab_packer_thresholds_description', true ),true );
  $current_locale = get_locale();
  $package_price = $decoded[$i2]['parameters'][$c]['price_' . $current_locale];


  echo '<div>';
  echo var_dump( $flat_rates );
  echo '</div>';
}

/**************************** ADMIN SCRIPTS AND JS OBJECTS ********************/
function braftwsp_settings_scripts(){
  global $wpdb;
  $query = 'SELECT * FROM ' . $wpdb->prefix . 'options WHERE option_name LIKE "woocommerce_flat_rate%"';
  $result = $wpdb->get_results( $query, ARRAY_N );
  $count_rates = ( count( $result ) ) ? count( $result ) : 0;
  $rate_titles = '[{';
    $html_select = '<select class="braftwsp_thresh_rates">';
    for( $i = 0; $i < $count_rates; $i++){
      $rate_name = explode( 'woocommerce_', $result[$i][1] );
      $rate_name2 = explode( '_settings', $rate_name[1] );
      $rate_name3 = str_replace( 'flat_rate_', 'flat_rate:', $rate_name2[0] );
      $rate_data = maybe_unserialize( $result[$i][2] );
      $rate_title = $rate_data['title'];
      $is_selected = ( $i === 0 ) ? 'selected="selected"' : '';
      $html_select .= '<option value="' . $rate_name3 . '" ' . $is_selected . '>' . $rate_title . '</option>';
      $rate_titles .= '"' . $rate_name3 . '":"' . $rate_title . '",';
    }
    $html_select .= '</select>';
    $rate_titles .= '}]';
    $rates_titles = str_replace( ',}]', '}]', $rate_titles );
    wp_register_style(
      'braftwsp-settings-css',
      plugins_url( '/css/braftwsp-settings.css', __FILE__ ),
      array(),
      '1.0.1'
    );
    wp_enqueue_style( 'braftwsp-settings-css' );

    wp_register_script(
      'braftwsp-settings-js',
      plugins_url( '/js/braftwsp-settings.js', __FILE__ ),
      array( 'jquery', 'wp-i18n' ),
      '1.0.1',
      true
    );
    wp_enqueue_script( 'braftwsp-settings-js' );
    wp_localize_script( 'braftwsp-settings-js',
    'braftwsp_settings_obj',
    array(
      'ajax_url' => admin_url( 'admin-ajax.php' ),
      'close_icon_url' => plugins_url( 'braft-woo-shipping-packer/images/close.svg' ),
      'check_icon_url' => plugins_url( 'braft-woo-shipping-packer/images/check.svg' ),
      'flat_rates_select_list' => $html_select,
      'flat_rates_titles' => $rates_titles,
      'select_locale_markup' => wp_dropdown_languages( array( 'echo' => 0 ) ),
      'weight_unit' => get_option('woocommerce_weight_unit'),
      'dimension_unit' => get_option('woocommerce_dimension_unit')
    )
  );
  wp_set_script_translations( 'braftwsp-settings-js', 'braft-woo-shipping-packer', plugin_dir_path( __FILE__ ) . 'languages' );
}
add_action('admin_enqueue_scripts', 'braftwsp_settings_scripts');
