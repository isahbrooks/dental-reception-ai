import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    console.log("🔥 VAPI WEBHOOK HIT:", new Date().toISOString());
    const body = await request.json();
    
    // Vapi sends different message types - we care about end-of-call-report
    const messageType = body.message?.type;
    
    // Handle end of call report (contains full call summary)
    if (messageType === "end-of-call-report") {
      const call = body.message;
      
      // Extract caller info
      const callerNumber = call.customer?.number || "Unknown";
      const callSummary = call.summary || "";
      const transcript = call.transcript || "";
      
      // Extract any tool calls made during the conversation (like booking)
      const toolCalls = call.toolCalls || [];
      const bookingCall = toolCalls.find(
        (tc: any) => tc.name === "bookAppointment" || tc.name === "book_appointment"
      );
      
      // Create lead
      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .insert({
          caller_name: bookingCall?.args?.patient_name || "Unknown Caller",
          phone_number: callerNumber,
          reason_for_visit: bookingCall?.args?.reason_for_visit || "General Inquiry",
          preferred_time: bookingCall?.args?.preferred_time || null,
          emergency: false,
          call_summary: callSummary || transcript.slice(0, 500),
        })
        .select()
        .single();

      if (leadError) {
        console.error("Lead insert error:", leadError);
      }

      // If an appointment was booked, create it
      if (bookingCall) {
        const { error: apptError } = await supabase
          .from("appointments")
          .insert({
            patient_name: bookingCall.args?.patient_name || "Unknown",
            phone_number: callerNumber,
            reason_for_visit: bookingCall.args?.reason_for_visit || "General",
            appointment_date: bookingCall.args?.appointment_date || null,
            appointment_time: bookingCall.args?.appointment_time || null,
            doctor_name: bookingCall.args?.doctor_name || "Dr. Smith",
            status: "requested",
            notes: callSummary,
          });

        if (apptError) {
          console.error("Appointment insert error:", apptError);
        }
      }

      return NextResponse.json({ success: true, lead });
    }

    // For other message types (status-update, speech-update, etc), just acknowledge
    return NextResponse.json({ success: true, message: "Received" });
    
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Also handle GET for webhook verification
export async function GET() {
  return NextResponse.json({ status: "Vapi webhook active" });
}
