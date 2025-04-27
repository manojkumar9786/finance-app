import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET a single transaction
export async function GET(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db("finance_tracker")

    const transaction = await db.collection("transactions").findOne({ _id: new ObjectId(params.id) })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT (update) a transaction
export async function PUT(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db("finance_tracker")
    const data = await request.json()

    // Add updated timestamp
    data.updatedAt = new Date()

    const result = await db.collection("transactions").updateOne({ _id: new ObjectId(params.id) }, { $set: data })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Transaction updated successfully" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE a transaction
export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db("finance_tracker")

    const result = await db.collection("transactions").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
