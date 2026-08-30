import { supabaseServer, requireUser } from '@/lib/supabase/server';
import ApprovalsQueue, { type ApprovalCard } from '@/components/dash/ApprovalsQueue';

export const dynamic = 'force-dynamic';

export default async function ApprovalsPage() {
  const user = await requireUser();
  if (!user) return null;

  const sb = supabaseServer();

  const { data: approvals } = await sb
    .from('ct_approvals')
    .select('id, run_id, preview, created_at')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  const runIds = (approvals ?? []).map((a: { run_id: string }) => a.run_id).filter(Boolean);

  const { data: runs } = runIds.length
    ? await sb.from('ct_runs').select('id, is_demo').in('id', runIds)
    : { data: [] as { id: string; is_demo: boolean }[] };

  const demo = new Map<string, boolean>(
    (runs ?? []).map((r: { id: string; is_demo: boolean }) => [r.id, Boolean(r.is_demo)])
  );

  const cards: ApprovalCard[] = (approvals ?? []).map((a: any) => ({
    id: a.id,
    templateName: String(a.preview?.template ?? 'Automation output'),
    output: typeof a.preview?.output === 'string' ? a.preview.output : '',
    actions: Array.isArray(a.preview?.actions) ? a.preview.actions.map(String) : [],
    created_at: a.created_at,
    isDemo: demo.get(a.run_id) ?? false,
  }));

  return (
    <>
      <div className="dash-head">
        <div>
          <span className="eyebrow">Approvals</span>
          <h1>Waiting on your nod</h1>
          <p>
            Read what the automation wants to send, then approve it or turn it down.
            Nothing leaves CazoTask until you decide.
          </p>
        </div>
      </div>

      <ApprovalsQueue approvals={cards} />
    </>
  );
}
