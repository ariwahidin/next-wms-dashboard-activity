import { queryDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const activity = await getOutboundActivty();
    return NextResponse.json({
        activity: activity,
    });
}

export async function getOutboundActivty() {
  const sql = `WITH ob AS 
    (SELECT 
    a.id, a.outbound_no, a.shipment_id, c.customer_name, a.outbound_date, a.[status],
    SUM(b.quantity) AS quantity_req
    FROM outbound_headers a
    LEFT JOIN outbound_details b ON a.id = b.outbound_id
    LEFT JOIN customers c ON a.customer_code = c.customer_code
    WHERE a.[status] <> 'cancel' 
    GROUP BY a.id, a.outbound_no, a.shipment_id, c.customer_name, a.outbound_date, a.[status]),
    obc AS (
        SELECT outbound_id, SUM(quantity) AS quantity 
        FROM outbound_barcodes
        GROUP BY outbound_id
    ),
    obp AS (
        SELECT outbound_id, SUM(quantity) AS quantity 
        FROM outbound_pickings
        GROUP BY outbound_id
    )
    SELECT ob.*,
    obp.quantity AS quantity_pick,
    ISNULL(obc.quantity, 0) AS quantity_scan
    FROM ob
    LEFT JOIN obc ON ob.id = obc.outbound_id
    LEFT JOIN obp ON ob.id = obp.outbound_id`;
  return queryDB(sql);
}