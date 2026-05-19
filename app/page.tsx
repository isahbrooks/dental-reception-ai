import { supabase } from "@/lib/supabase";

export default async function HomePage() {
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold">Database Error</h1>
        <p className="text-red-400 mt-4">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-2">Dental Reception AI</h1>

        <p className="text-gray-400 mb-10">
          Live AI receptionist dashboard
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Total Leads</h2>
            <p className="text-4xl font-bold">{leads?.length ?? 0}</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">
              Appointments
            </h2>
            <p className="text-4xl font-bold">
              {appointments?.length ?? 0}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Emergency Calls</h2>
            <p className="text-4xl font-bold text-red-500">
              {leads?.filter((lead) => lead.emergency).length ?? 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold mb-6">Recent Leads</h2>

            <div className="space-y-4">
              {leads?.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-black border border-zinc-800 rounded-xl p-4"
                >
                  <p className="font-semibold">
                    {lead.caller_name || "Unknown Caller"}
                  </p>

                  <p className="text-gray-400">
                    {lead.reason_for_visit || "No reason provided"}
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    {lead.phone_number || "No phone number"} ·{" "}
                    {lead.preferred_time || "No preferred time"}
                  </p>

                  {lead.call_summary && (
                    <p className="text-gray-500 text-sm mt-2">
                      {lead.call_summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold mb-6">Appointments</h2>

            <div className="space-y-4">
              {appointments?.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-black border border-zinc-800 rounded-xl p-4"
                >
                  <p className="font-semibold">
                    {appointment.patient_name || "Unknown Patient"}
                  </p>

                  <p className="text-gray-400">
                    {appointment.reason_for_visit || "No reason provided"}
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    {appointment.appointment_date || "No date"} ·{" "}
                    {appointment.appointment_time || "No time"}
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    Doctor: {appointment.doctor_name || "Unassigned"} · Status:{" "}
                    {appointment.status || "requested"}
                  </p>
                </div>
              ))}

              {appointments?.length === 0 && (
                <p className="text-gray-500">No appointments yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}