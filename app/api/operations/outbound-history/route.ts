import { queryDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// tipe filter yang diizinkan
type FilterType =
    | "shipmentId"
    | "customer"
    | "itemCode"
    | "ean"
    | "serialNumber"

// mapping filter -> kolom DB
const FILTER_COLUMN_MAP: Record<FilterType, string> = {
    shipmentId: "shipment_id",
    customer: "customer",
    itemCode: "item_code",
    ean: "ean",
    serialNumber: "serial_number",
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const filterType = searchParams.get("filterType") as FilterType | null
    const keyword = searchParams.get("keyword")

    if (!filterType || !keyword) {
        return NextResponse.json(
            { message: "filterType dan keyword wajib diisi" },
            { status: 400 }
        )
    }

    // validasi whitelist (INI PENTING)
    const column = FILTER_COLUMN_MAP[filterType]
    if (!column) {
        return NextResponse.json(
            { message: "Filter tidak valid" },
            { status: 400 }
        )
    }

    try {
        // const pool = await sql.connect(sqlConfig)

        const query = `
        WITH  ob AS (
        SELECT
        a.shipment_id, d.quantity,
        a.outbound_date, a.outbound_no, b.customer_name as customer,
        e.[name] as [pic_scan], CONVERT(varchar(16), d.created_at, 120) AS [tanggal_scan], 
        f.order_no as [spk_number], g.load_date as delivery_date, g.driver, g.transporter_name, 
        g.truck_size, g.truck_no, f.remarks as [remarks_spk_dtl],
        c.item_code, c.barcode as ean, d.serial_number 
        --j.inbound_no, k.receipt_id, k.inbound_date, l.supplier_name as [supplier], 
        FROM outbound_headers a
        INNER JOIN customers b on a.customer_code = b.customer_code
        INNER JOIN outbound_details c on a.id = c.outbound_id
        LEFT JOIN outbound_barcodes d on d.outbound_detail_id = c.id
        LEFT JOIN users e on d.created_by = e.id
        LEFT JOIN order_details f on a.shipment_id = f.shipment_id 
        LEFT JOIN order_headers g on f.order_id = g.id
        --INNER JOIN outbound_pickings h on h.outbound_detail_id = c.id 
        --INNER JOIN inventories i on h.inventory_id = i.id 
        --INNER JOIN inbound_details j on j.id = i.inbound_detail_id and h.inventory_id = i.id
        --INNER JOIN inbound_headers k on j.inbound_id = k.id
        --INNER JOIN suppliers l on l.supplier_code = k.supplier
        )
        SELECT * FROM ob WHERE ${column} LIKE @keyword
    `
        const rows = await queryDB(query, {
            keyword: `%${keyword}%`
        })

        if (rows.length === 0) {

            // Get from old data 
            const oldQuery = `SELECT *, transporter as transporter_name FROM outbound_history_1 WHERE ${column} LIKE @keyword`
            const oldRows = await queryDB(oldQuery, {
                keyword: `%${keyword}%`
            })

            return NextResponse.json({ success: true, data: oldRows })
        }


        return NextResponse.json({ success: true, data: rows })
    } catch (err) {
        console.error("API logistics error:", err)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
