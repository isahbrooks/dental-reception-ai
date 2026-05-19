import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        patient_name: body.patient_name,
        phone_number: body.phone_number,
        reason_for_visit: body.reason_for_visit,
        appointment_date: body.appointment_date,
        appointment_time: body.appointment_time,
        doctor_name: body.doctor_name,
        status: body.status ?? "requested",
        notes: body.notes,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment: data,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}