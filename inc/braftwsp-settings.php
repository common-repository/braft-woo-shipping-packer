<?php
$settings = array(
  'languages_section_title' => array(
      'name'     => __( 'Languages', 'braft-woo-shipping-packer' ),
      'type'     => 'title',
      'desc'     => '',
      'id'       => 'wc_settings_tab_packer_languages_section_title'
  ),
  'languages_description' => array(
      'name' => __( 'Language codes', 'braft-woo-shipping-packer' ),
      'type' => 'textarea',
      'desc' => __( 'example JSON: [{"lang_code":"pl_PL","lang_title":"Polski"},{"lang_code":"en_US","lang_title":"English"}]',
        'braft-woo-shipping-packer' ),
      'id'   => 'wc_settings_tab_packer_languages_description',
      'readonly' => 'readonly'
  ),
  'languages_section_end' => array(
       'type' => 'sectionend',
       'id' => 'wc_settings_tab_packer_languages_section_end'
  ),
    'section_title' => array(
        'name'     => __( 'Packages parameters', 'braft-woo-shipping-packer' ),
        'type'     => 'title',
        'desc'     => '',
        'id'       => 'wc_settings_tab_packer_section_title'
    ),
    'description' => array(
        'name' => __( 'Packages parameters', 'braft-woo-shipping-packer' ),
        'type' => 'textarea',
        'desc' => __( 'example JSON: [{"name":"My package",
          "parameters":"outer width,outer length,outer height,empty weight,inner width,inner length,inner height,max weight",
          "box_price_pl_PL":"the price", "box_price_en_US":"the price"}]',
          'braft-woo-shipping-packer' ),
        'id'   => 'wc_settings_tab_packer_description'
    ),
    'section_end' => array(
         'type' => 'sectionend',
         'id' => 'wc_settings_tab_packer_section_end'
    ),
    'section_title2' => array(
        'name'     => __( 'Shipping thresholds', 'braft-woo-shipping-packer' ),
        'type'     => 'title',
        'desc'     => '',
        'id'       => 'wc_settings_tab_packer_section_thresholds_title'
    ),
    'description2' => array(
        'name' => __( 'Shipping thresholds', 'braft-woo-shipping-packer' ),
        'type' => 'textarea',
        'desc' => __( 'example JSON: [{"name":"InPost",
          "parameters":[{"name":"A", "max_dimensions":"outer width,outer length,outer depth", "max_weight":"grams",
            "price_pl_PL":"the price", "price_en_US":"the price"}]}]',
          'braft-woo-shipping-packer' ),
        'id'   => 'wc_settings_tab_packer_thresholds_description'
    ),
    'section_end2' => array(
         'type' => 'sectionend',
         'id' => 'wc_settings_tab_packer_thresholds_section_end'
    ),
    'backup_title' => array(
        'name'     => __( 'Backup', 'braft-woo-shipping-packer' ),
        'type'     => 'title',
        'desc'     => '',
        'id'       => 'wc_settings_tab_packer_section_backup_title'
    ),
    'backup_description' => array(
        'name' => __( 'Backup JSON', 'braft-woo-shipping-packer' ),
        'type' => 'textarea',
        'desc' => __( '',
          'braft-woo-shipping-packer' ),
        'id'   => 'wc_settings_tab_packer_backup_description'
    ),
    'backup_section_end' => array(
         'type' => 'sectionend',
         'id' => 'wc_settings_tab_packer_backup_section_end'
    )
);
?>
