import { queryDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const receipt_id = searchParams.get("receipt");

  if (!receipt_id) {
    return NextResponse.json(
      { message: "receipt id is required" },
      { status: 400 }
    );
  }

  const activity = await getInboundActivityByReceipt(receipt_id);

  return NextResponse.json({
    activity,
  });
}

export async function getInboundActivityByReceipt(
  receipt_id: string
): Promise<InboundActivityDetail[]> {
  const sql = `
    SELECT 
        a.id as outbound_id,
        a.receipt_id,
        b.supplier_name,
        a.inbound_date,
        a.[status],
        a.created_at,
        a.updated_at,
        c.item_code AS item_id,
        c.quantity,
        d.item_name as product_name,
        c.item_code as sku
        FROM inbound_headers a
        LEFT JOIN suppliers b ON a.supplier_id = b.id
        LEFT JOIN inbound_details c ON a.id  = c.inbound_id
        LEFT JOIN products d ON c.item_code = d.item_code
        WHERE a.receipt_id = @receipt_id
        ORDER BY a.created_at DESC
        `;

  const rows = await queryDB(sql, {
    receipt_id, // parameter binding
  });

  const result: Record<string, InboundActivityDetail> = {};

  for (const row of rows) {
    if (!result[row.outbound_id]) {
      result[row.outbound_id] = {
        id: row.outbound_id,
        receipt_id: row.receipt_id,
        supplier_name: row.supplier_name,
        inbound_date: row.inbound_date,
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
