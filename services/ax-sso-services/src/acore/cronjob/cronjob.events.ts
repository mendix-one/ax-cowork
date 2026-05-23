// Single event name shared by the scheduler (producer) and the workers (consumer).
// Payload is the job's `uuid` (string); the listener uses it to claim the job via `CronjobManager.start`.
export const CRONJOB = 'CRONJOB'
