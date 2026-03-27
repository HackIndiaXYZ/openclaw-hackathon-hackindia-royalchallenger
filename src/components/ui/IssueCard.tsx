import { getCategoryIcon, formatTimeAgo } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import type { Issue } from "@/lib/supabase";

type IssueCardProps = {
  issue: Issue;
  compact?: boolean;
};

export default function IssueCard({ issue, compact = false }: IssueCardProps) {
  return (
    <div className="bg-bg-surface border border-border-subtle p-4 hover:border-border-strong transition-all duration-300 group">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getCategoryIcon(issue.category)}</span>
          <div>
            <h4 className="font-body text-[14px] font-semibold text-text-primary group-hover:text-accent-cyan transition-colors line-clamp-1">
              {issue.title}
            </h4>
            {issue.issue_code && (
              <span className="font-data text-[10px] text-text-muted tracking-[0.1em]">
                {issue.issue_code}
              </span>
            )}
          </div>
        </div>
        {issue.severity && (
          <StatusBadge type="severity" value={issue.severity} />
        )}
      </div>

      {/* AI Summary */}
      {issue.ai_summary && !compact && (
        <p className="font-body text-[13px] text-text-secondary mb-3 line-clamp-2">
          {issue.ai_summary}
        </p>
      )}

      {/* Footer Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusBadge type="status" value={issue.status} />
          {issue.area_name && (
            <span className="font-data text-[11px] text-text-muted tracking-[0.05em]">
              📍 {issue.area_name}
            </span>
          )}
        </div>
        <span className="font-data text-[11px] text-text-muted">
          {formatTimeAgo(issue.created_at)}
        </span>
      </div>

      {/* Department */}
      {issue.department && !compact && (
        <div className="mt-2 pt-2 border-t border-border-subtle">
          <span className="font-data text-[10px] text-text-muted tracking-[0.1em]">
            → ROUTED TO: <span className="text-accent-cyan">{issue.department.toUpperCase()}</span>
          </span>
        </div>
      )}
    </div>
  );
}
