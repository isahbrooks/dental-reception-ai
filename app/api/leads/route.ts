import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("leads")
      .insert({
        caller_name: body.caller_name,
        phone_number: body.phone_number,
        reason_for_visit: body.reason_for_visit,
        preferred_time: body.preferred_time,
        emergency: body.emergency ?? false,
        call_summary: body.call_summary,
      })
      .select()
      .single();

      if (error) {
        console.error("SUPABASE INSERT ERROR:", error);
      
        return NextResponse.json(
          {
            error: error.message,
            details: error,
          },
          { status: 500 }
        );
      }

    return NextResponse.json({ success: true, lead: data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}