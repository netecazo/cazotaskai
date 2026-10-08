import { supabaseServer, requireUser } from '@/lib/supabase/server';
import LibraryBrowser, { type LibraryTemplate } from '@/components/dash/LibraryBrowser';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  const user = await requireUser();
  if (!user) return null;

  const sb = await supabaseServer();

  const [{ data: templates }, { data: mine }] = await Promise.all([
    sb.from('ct_templates')
      .select('slug, name, description, category, trigger_type, required_providers, est_minutes_saved, availability, sort_order')
      .order('sort_order', { ascending: true }),
    sb.from('ct_automations').select('template_slug').eq('user_id', user.id),
  ]);

  const list = (templates ?? []) as LibraryTemplate[];
  const addedSlugs = Array.from(
    new Set((mine ?? []).map((a: { template_slug: string }) => a.template_slug))
  );

  return (
    <>
      <div className="dash-head">
        <div>
          <span className="eyebrow">Library</span>
          <h1>Ready-to-run automations</h1>
          <p>
            Add one and it appears in your automations, pre-filled with sensible defaults.
            You can change the schedule, the wording and the approval rules afterwards.
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="glass dash-empty">
          <h3>The library is empty</h3>
          <p>No templates came back from the database. Refresh the page, and if it stays empty the seed data has not been loaded on this deployment.</p>
        </div>
      ) : (
        <LibraryBrowser templates={list} addedSlugs={addedSlugs} />
      )}
    </>
  );
}
