type InventoryItem = {
  id?: number;
  barcode: string;
  item_code: string;
  item_name: string;
  location: string;
  category: string;
  rec_date: string;
  owner_code: string;
  whs_code: string;
  qa_status: string;
  qty_in?: number;
  qty_onhand?: number;
  qty_available?: number;
  qty_allocated?: number;
  qty_out?: number;
  cbm_pcs?: number;
  cbm_total?: number;
};