import { z } from 'zod';

export const consentStatusSchema = z.enum([
  'unknown',
  'opt_in',
  'unsubscribed',
  'bounced',
  'complaint',
  'replied'
]);

export const emailAccountSchema = z.object({
  name: z.string().min(1),
  smtpHost: z.string().min(1),
  smtpPort: z.number().int().positive(),
  smtpUser: z.string().min(1),
  smtpPassword: z.string().min(1),
  smtpSecure: z.boolean(),
  imapHost: z.string().min(1),
  imapPort: z.number().int().positive(),
  imapUser: z.string().min(1),
  imapPassword: z.string().min(1),
  imapSecure: z.boolean(),
  dailySendLimit: z.number().int().positive().default(50),
  minTimeGapMinutes: z.number().int().positive().default(7),
  jitterMinutes: z.number().int().nonnegative().default(5),
  enabled: z.boolean().default(true)
});

export const leadSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  tags: z.array(z.string()).default([]),
  consentStatus: consentStatusSchema.default('unknown'),
  consentSource: z.string().optional(),
  consentTimestamp: z.date().optional()
});

export const sequenceStepSchema = z.object({
  subjectTemplate: z.string().min(1),
  bodyTemplate: z.string().min(1),
  stepNumber: z.number().int().positive(),
  waitDaysAfterPrev: z.number().int().nonnegative(),
  stopOnReply: z.boolean().default(true)
});

export const campaignSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  campaignDailyLimit: z.number().int().positive().default(200),
  active: z.boolean().default(false)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export type LoginInput = z.infer<typeof loginSchema>;
export type EmailAccountInput = z.infer<typeof emailAccountSchema>;
export type LeadInput = z.infer<typeof leadSchema>;
export type SequenceStepInput = z.infer<typeof sequenceStepSchema>;
export type CampaignInput = z.infer<typeof campaignSchema>;
