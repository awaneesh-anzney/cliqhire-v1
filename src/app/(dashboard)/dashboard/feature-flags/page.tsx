'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Flag, Info, RotateCcw, Loader2, Search } from 'lucide-react';
import { featureFlagsApi } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { cn } from '@/lib/utils';
import type { FeatureFlag } from '@/types';

// Flags grouped exactly as in the backend Excel
const FLAG_GROUPS: { label: string; scope: string; keys: string[] }[] = [
  {
    label: 'Agency Features', scope: 'Agency',
    keys: ['client_management', 'contracts', 'fee_tracking', 'client_portal', 'vendor_management',
      'freelancer_mode', 'executive_mode', 'blind_profiles', 'milestone_billing', 'bulk_hiring_mode',
      'rpo_mode', 'sla_tracking', 'candidate_submission', 'team_management', 'commission_split'],
  },
  {
    label: 'Company Features', scope: 'Company',
    keys: ['career_page', 'approval_workflow', 'department_management', 'offer_management',
      'onboarding', 'employee_referral', 'internal_mobility', 'background_check',
      'assessment_integration', 'hris_integration'],
  },
  {
    label: 'Common Features', scope: 'Common',
    keys: ['custom_fields', 'custom_pipeline', 'email_templates', 'interview_scorecards',
      'calendar_integration', 'sms_notifications', 'whatsapp_integration', 'advanced_reports',
      'data_export', 'api_access', 'ai_resume_parsing', 'ai_matching', 'multi_language',
      'gdpr_tools', 'two_factor_auth', 'sso_login', 'form_builder', 'activity_logs', 'file_uploads'],
  },
];

const FLAG_DESCRIPTIONS: Record<string, string> = {
  client_management: 'Client CRUD, contacts, account management',
  contracts: 'Contract creation, tracking, milestone billing',
  client_portal: 'Separate login for clients to view submissions',
  vendor_management: 'Sub-contractor recruiters with job assignment',
  blind_profiles: 'Hide candidate PII from certain users',
  career_page: 'Public job board / career page',
  approval_workflow: 'Job and offer approval chains',
  offer_management: 'Offer letters, status flow, approvals',
  onboarding: 'Post-hire onboarding task checklists',
  employee_referral: 'Referral submission, tracking, bonus',
  custom_fields: 'Custom field definitions on candidates, jobs',
  calendar_integration: 'Google / Outlook calendar sync (OAuth2 required)',
  api_access: 'Public REST API key access for integrations',
  ai_resume_parsing: 'AI-based resume parsing on upload (credits)',
  two_factor_auth: 'TOTP 2FA for users (per-user AND tenant level)',
  sso_login: 'SSO via SAML / OIDC',
  activity_logs: 'Action audit trail in activities table',
  file_uploads: 'Document / resume upload to Cloudinary',
  data_export: 'CSV / PDF export of data',
};

export default function FeatureFlagsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: flags = [], isLoading } = useQuery({
    queryKey: queryKeys.featureFlags.all(),
    queryFn: featureFlagsApi.list,
  });

  const flagMap = Object.fromEntries(flags.map((f) => [f.key, f]));

  const updateMutation = useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      featureFlagsApi.update(key, enabled),
    onSuccess: (_, { key, enabled }) => {
      qc.invalidateQueries({ queryKey: queryKeys.featureFlags.all() });
      toast.success(`${key.replace(/_/g, ' ')} ${enabled ? 'enabled' : 'disabled'}`);
    },
    onError: () => toast.error('Failed to update flag'),
  });

  const resetMutation = useMutation({
    mutationFn: (key: string) => featureFlagsApi.resetToDefault(key),
    onSuccess: (_, key) => {
      qc.invalidateQueries({ queryKey: queryKeys.featureFlags.all() });
      toast.success(`${key.replace(/_/g, ' ')} reset to plan default`);
    },
  });

  const filtered = (keys: string[]) =>
    keys.filter((k) => !search || k.includes(search.toLowerCase()) || FLAG_DESCRIPTIONS[k]?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold flex items-center gap-2">
            <Flag className="w-5 h-5 text-primary" /> Feature Flags
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Toggle features for your workspace. Changes apply immediately.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-accent-muted/30 border border-accent/20 rounded-xl">
        <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Flags marked <span className="text-foreground font-medium">Plan Default</span> are controlled by your subscription plan.
          Overrides take precedence over plan defaults.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search flags…"
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface border border-border text-sm
                     placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Flag Groups */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 skeleton rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {FLAG_GROUPS.map((group) => {
            const groupKeys = filtered(group.keys);
            if (!groupKeys.length) return null;
            return (
              <div key={group.label} className="bg-surface border border-border rounded-xl overflow-hidden">
                {/* Group Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/20">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{group.label}</h3>
                    <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      {group.scope}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {groupKeys.filter((k) => flagMap[k]?.enabled).length}/{groupKeys.length} enabled
                  </span>
                </div>

                {/* Flags List */}
                <div className="divide-y divide-border">
                  {groupKeys.map((key) => {
                    const flag = flagMap[key];
                    const enabled = flag?.enabled ?? false;
                    const isOverride = flag?.source === 'override';
                    const isPending = updateMutation.isPending && updateMutation.variables?.key === key;

                    return (
                      <div
                        key={key}
                        className={cn(
                          'flex items-center justify-between px-5 py-3.5 transition-colors',
                          enabled && 'bg-success-muted/10',
                        )}
                      >
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium font-mono">{key}</span>
                            {isOverride && (
                              <span className="text-[9px] bg-warning-muted text-warning px-1.5 py-0.5 rounded font-medium uppercase tracking-wide">
                                Override
                              </span>
                            )}
                            {!flag && (
                              <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium uppercase tracking-wide">
                                Plan Default
                              </span>
                            )}
                          </div>
                          {FLAG_DESCRIPTIONS[key] && (
                            <p className="text-xs text-muted-foreground mt-0.5">{FLAG_DESCRIPTIONS[key]}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Reset to plan default */}
                          {isOverride && (
                            <button
                              onClick={() => resetMutation.mutate(key)}
                              disabled={resetMutation.isPending}
                              className="h-7 px-2 rounded text-muted-foreground hover:text-foreground hover:bg-muted text-xs flex items-center gap-1 transition-colors"
                              title="Reset to plan default"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Reset
                            </button>
                          )}

                          {/* Toggle Switch */}
                          <button
                            onClick={() => updateMutation.mutate({ key, enabled: !enabled })}
                            disabled={isPending}
                            className={cn(
                              'relative w-11 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                              enabled ? 'bg-success' : 'bg-muted',
                              isPending && 'opacity-60 cursor-wait',
                            )}
                          >
                            {isPending ? (
                              <Loader2 className="w-3 h-3 animate-spin absolute top-1.5 left-1/2 -translate-x-1/2 text-white" />
                            ) : (
                              <span className={cn(
                                'absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all',
                                enabled ? 'left-6' : 'left-1',
                              )} />
                            )}
                          </button>

                          <span className={cn(
                            'text-xs font-medium w-12 text-right',
                            enabled ? 'text-success' : 'text-muted-foreground',
                          )}>
                            {enabled ? 'ON' : 'OFF'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
