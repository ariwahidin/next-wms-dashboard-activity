type OutboundActivity = {
    id?: string;
    outbound_no?: string;
    customer_name?: string;
    outbound_date?: string;
    quantity_req?: string;
    quantity_pick?: string;
    quantity_scan?: string;
    shipment_id?: string;
    status?: string;
};


interface OutboundActivityDetail {
  id: string
  shipment_id: string
  customer_name: string
  outbound_date: string
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