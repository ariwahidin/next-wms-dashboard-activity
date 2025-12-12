type InboundActivity = {
    id?: string;
    inbound_no?: string;
    supplier_name?: string;
    inbound_date?: string;
    quantity_req?: string;
    quantity_scan?: string;
    quantity_rcvd?: string;
    receipt_id?: string;
    status?: string;
};


interface InboundActivityDetail {
  id: string
  receipt_id: string
  supplier_name: string
  inbound_date: string
  status: "open" | "picking" | "complete"
  items?: Array<{
    id: string
    product_name: string
    quantity: number
    sku: string
  }>
  created_at?: string
  updated_at?: string
}