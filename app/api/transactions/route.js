import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// GET all transactions
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("finance_tracker")

    const transactions = await db.collection("transactions").find({}).sort({ date: -1 }).toArray()

    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST a new transaction
export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db("finance_tracker")
    const data = await request.json()

    // Add timestamp
    data.createdAt = new Date()

    const result = await db.collection("transactions").insertOne(data)

    return NextResponse.json(
      {
        message: "Transaction created successfully",
        id: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
