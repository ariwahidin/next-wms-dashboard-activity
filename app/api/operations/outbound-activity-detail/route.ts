import { queryDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shipment_id = searchParams.get("shipment_id");

  if (!shipment_id) {
    return NextResponse.json(
      { message: "shipment_id is required" },
      { status: 400 }
    );
  }

  const activity = await getOutboundActivityByShipmentId(shipment_id);

  return NextResponse.json({
    activity,
  });
}

export async function getOutboundActivityByShipmentId(
  shipment_id: string
): Promise<OutboundActivityDetail[]> {
  const sql = `
    SELECT 
        a.id as outbound_id,
        a.shipment_id,
        b.customer_name,
        a.outbound_date,
        a.[status],
        a.created_at,
        a.updated_at,
        c.item_code AS item_id,
        c.quantity,
        d.item_name as product_name,
        c.item_code as sku
        FROM outbound_headers a
        LEFT JOIN customers b ON a.customer_code = b.customer_code
        LEFT JOIN outbound_details c ON a.id  = c.outbound_id
        LEFT JOIN products d ON c.item_code = d.item_code
        WHERE a.shipment_id = @shipment_id
        ORDER BY a.created_at DESC
        `;

  const rows = await queryDB(sql, {
    shipment_id, // parameter binding
  });

  const result: Record<string, OutboundActivityDetail> = {};

  for (const row of rows) {
    if (!result[row.outbound_id]) {
      result[row.outbound_id] = {
        id: row.outbound_id,
        shipment_id: row.shipment_id,
        customer_name: row.customer_name,
        outbound_date: row.outbound_date,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
        items: [],
      };
    }

    if (row.item_id) {
      result[row.outbound_id].items!.push({
        id: row.item_id,
        product_name: row.product_name,
        quantity: Number(row.quantity),
        sku: row.sku,
      });
    }
  }

  return Object.values(result);
}
