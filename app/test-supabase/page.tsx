import { supabase } from "@/lib/supabase";

export default async function TestSupabase() {
  const { data, error } = await supabase
    .from("driver")
    .select("id")
    .limit(1);

  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Supabase Connection Test</h1>

      {error ? (
        <>
          <h2>❌ Connection error</h2>
          <pre>{error.message}</pre>
        </>
      ) : (
        <>
          <h2>✅ Supabase connected</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      )}
    </main>
  );
}
