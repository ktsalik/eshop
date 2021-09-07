<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Application extends CI_Controller {

  function __construct() {
    parent::__construct();
  }

	public function index() {
		$this->load->view('app');
	}

  public function get_products_feed() {
    $xml_data = file_get_contents('https://tradesor.gr/catalogue.xml');
    $xml = simplexml_load_string($xml_data);
    $categories = [];
    
    foreach ($xml->products->product as $xml_product) {
      $category_clues = explode('>', $xml_product->category);

      $category_clues[0] = str_replace('&', 'ΚΑΙ', $category_clues[0]);
      if (!in_array($category_clues[0], $categories)) {
        array_push($categories, $category_clues[0]);
      }
      
      if (count($category_clues) > 1) {
        $category_clues[1] = str_replace('&', 'και', $category_clues[1]);
        if (!in_array($category_clues[1], $categories)) {
          array_push($categories, $category_clues[0] . '.' . $category_clues[1]);
        }
      }
    }
    
    $this->load->database();
    
    foreach ($categories as $category_name) {
      $category_clues = explode('.', $category_name);
      if (count($category_clues) > 1) {
        $count = $this->db->select('COUNT(*) as count')->from('categories')->where(["name" => $category_clues[0]])->get()->row()->count;
        if ($count == 0) {
          $this->db->insert('categories', [
            "name" => $category_clues[0],
          ]);
        }
      }
    }

    foreach ($categories as $category_name) {
      $category_clues = explode('.', $category_name);
      $name = $category_clues[0];
      if (count($category_clues) > 1) {
        $name = $category_clues[1];
      }
      $count = $this->db->select('COUNT(*) as count')->from('categories')->where(["name" => $name])->get()->row()->count;
      if ($count == 0) {
        $parent = NULL;
        if (count($category_clues) > 1) {
          $parent = $this->db->get_where('categories', ["name" => $category_clues[0]])->row()->id;
        }
        $this->db->insert('categories', [
          "name" => $name,
          "parent" => $parent,
        ]);
      }
    }

    $result = $this->db->select('supplier_id')->from('products')->get()->result();
    $product_supplier_ids = [];
    foreach ($result as $row) {
      array_push($product_supplier_ids, $row->supplier_id);
    }

    $this->db->trans_start();
    foreach ($xml->products->product as $xml_product) {
      $category_clues = explode('>', $xml_product->category);
      $category_clues[0] = str_replace('&', 'ΚΑΙ', $category_clues[0]);
      $category_name = $category_clues[0];
      if (count($category_clues) > 1) {
        $category_clues[1] = str_replace('&', 'και', $category_clues[1]);
        $category_name = $category_clues[1];
      }
      $result = $this->db->get_where('categories', ["name" => $category_name]);
      if (!$result->row()) {
        continue;
      }
      $category_id = $result->row()->id;
      if (!in_array($xml_product->id, $product_supplier_ids)) {
        $name = $this->db->escape($xml_product->name);
        $description = $this->db->escape($xml_product->Content);
        $this->db->query("
          INSERT INTO products (supplier_id, name, description, price, discount_price, category, mpn, sku, manufacturer, weight)
          VALUES (
            $xml_product->id,
            $name,
            $description,
            $xml_product->SuggestedRetailPrice,
            $xml_product->RegularPrice,
            $category_id,
            '$xml_product->mpn',
            '$xml_product->Sku',
            '$xml_product->manufacturer',
            $xml_product->weight
          )
        ");
                
        $this->db->query("
          INSERT INTO product_images (product_id, image)
          VALUES ($xml_product->id, '$xml_product->image')
        ");
      } else {

      }
    }
    $this->db->trans_complete();
  }
}
