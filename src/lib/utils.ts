import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function generateIssueCode(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `CP-${year}-${num}`;
}

export function getSeverityColor(severity: string | null): string {
  switch (severity) {
    case "critical":
      return "#FF3B3B";
    case "high":
      return "#FF3B3B";
    case "medium":
      return "#FFB800";
    case "low":
      return "#00FF88";
    default:
      return "#7A8BAD";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "open":
      return "#FF3B3B";
    case "in-progress":
      return "#FFB800";
    case "resolved":
      return "#00FF88";
    default:
      return "#7A8BAD";
  }
}

export function getCategoryIcon(category: string | null): string {
  switch (category) {
    case "pothole":
      return "🕳️";
    case "garbage":
      return "🗑️";
    case "lighting":
      return "💡";
    case "water":
      return "💧";
    case "road_damage":
      return "🚧";
    case "flooding":
      return "🌊";
    case "graffiti":
      return "🎨";
    default:
      return "📋";
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#00FF88";
  if (score >= 50) return "#FFB800";
  return "#FF3B3B";
}
