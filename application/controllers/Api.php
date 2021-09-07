<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller {

  function __construct() {
    parent::__construct();
  }
  
  public function categories($id = NULL, $get_products = FALSE) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
      if ($id === NULL) {
        $this->load->database();
        $categories = $this->db->get('categories')->result();
        print json_encode($categories);
        exit;
      } else {
        if ($get_products) {
          $this->load->database();
          $products = $this->get_product(NULL, $id, ($_GET['page'] - 1) * 10);
          $products_count = $this->db
            ->select('COUNT(*) AS count')
            ->from('products')
            ->join('categories', 'categories.id = products.category')
            ->where(["category" => $id])
            ->or_where(["categories.parent" => $id])
            ->get()
            ->row()->count;
          $pages_count = ceil($products_count / 10);
          print json_encode([
            "products" => $products,
            "pagesCount" => $pages_count,
          ]);
          exit;
        } else {
          $this->load->database();
          $category = $this->db->get_where('categories', ["id" => $id])->row_array();
          $products = $this->db
            ->select('*')
            ->from('products')
            ->join('product_images', 'products.supplier_id = product_images.product_id')
            ->limit(3)
            ->where(["category" => $id])
            ->get()
            ->result();
          $images = array_map(function($product) {
            return $product->image;
          }, $products);
          $category['images'] = $images;
          if ($category['parent'] !== 0) {
            $category['parent'] = $this->db->get_where('categories', ["id" => $category['parent']])->row();
          }
          print json_encode($category);
          exit;
        }
      }
    }
  }

  public function products($id = NULL) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
      if ($id === NULL) {
        $this->load->database();
        $products = $this->get_product();
        $pages_count = ceil($this->db->select('COUNT(*) AS count')->from('products')->get()->row()->count / 10);
        print json_encode([
          "products" => $products,
          "pagesCount" => $pages_count,
        ]);
        exit;
      } else {
        $this->load->database();
        $product_to_json = json_encode($this->get_product($id));
        if ($product_to_json === NULL) {
          show_404();
        } else {
          print $product_to_json;
        }
        exit;
      }
    }
  }

  public function get_product($id = NULL, $category = NULL, $offset = 0, $limit = 10) {
    $this->load->database();
    if ($id === NULL) {
      $category_data = $this->db->get_where('categories', ["id" => $category])->row();
      
      if ($category_data->parent !== NULL) {
        $parent_category = $this->db->get_where('categories', ["id" => $category_data->parent])->row();
      }

      $this->db
        ->select('products.*, categories.parent as parent_category')
        ->from('products')
        ->join('categories', 'products.category = categories.id')
        ->limit($limit, $offset);

      if ($category !== NULL) {
        if ($category !== '0') {
          if ($category_data->parent === NULL) {
            $this->db->where(["categories.parent" => $category]);
          } else {
            $this->db->where(["category" => $category]);
          }
        }
      }
      
      $result = $this->db->get();
      $products = $result->result_array();
      
      foreach ($products as &$product) {
        $product['category'] = $this->db->get_where('categories', ["id" => $product['category']])->row()->name;
        $product['images'] = [];
        $images_in_database = $this->db->get_where('product_images', ["product_id" => $product['supplier_id']])->result();
        foreach ($images_in_database as $row) {
          array_push($product['images'], $row->image);
        }
      }
      
      return $products;
    } else {
      $result = $this->db->get_where('products', ["id" => $id])->row_array();
      if ($result !== NULL) {
        $product = $result;
      } else {
        return NULL;
      }
      $category = $this->db->get_where('categories', ["id" => $product['category']])->row_array();
      $product['category'] = $category;
      if ($category['parent'] !== 0) {
        $product['category']['parent'] = $this->db->get_where('categories', ["id" => $category['parent']])->row_array();
      }
      $product['images'] = [];
      $images_in_database = $this->db->get_where('product_images', ["product_id" => $product['supplier_id']])->result();
      foreach ($images_in_database as $row) {
        array_push($product['images'], $row->image);
      }
      return $product;
    }
  }

  public function get_statistic_products() {
    $top = [2001, 2002, 2003, 2004, 2005];
    $new = [3001, 3003, 3003, 3004, 3005];
    $best = [4001, 4004, 4003, 4004, 4005];
    $products = [
      "top" => [],
      "new" => [],
      "best" => [],
    ];
    for ($i = 0; $i < 5; $i++) {
      array_push($products['top'], $this->get_product($top[$i]));
      array_push($products['new'], $this->get_product($new[$i]));
      array_push($products['best'], $this->get_product($best[$i]));
    }
    print json_encode($products);
  }
}

?>