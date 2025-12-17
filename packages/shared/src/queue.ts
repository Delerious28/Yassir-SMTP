export const SEND_QUEUE = 'sendQueue';
export const IMAP_QUEUE = 'imapQueue';
export const PLANNER_QUEUE = 'plannerQueue';

export const JOB_NAMES = {
  SEND_EMAIL: 'send-email',
  SYNC_IMAP: 'sync-imap',
  PLAN_STEPS: 'plan-steps'
} as const;
