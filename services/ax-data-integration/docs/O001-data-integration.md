> Translated from the original Vietnamese conversation with the manager.

This is the work assignment conversation from my manager:

Let's start on the Data Integration part. In the long run, Data Integration will likely have 3 forms:

1. **aPlanner (us) actively pulls data from external systems**:
   - Read Excel files, CSV files
   - Connect directly to databases (Oracle, MySQL, MSSQL, PostgreSQL, …)
   - Call external APIs: SOAP, REST, GraphQL

2. **Webhook event-based**:
   - External system calls our webhook to create an event with a payload
   - We call back their APIs to fetch additional details
   - …

3. **Event-based adapter** (this comes later):
   - We develop an adapter — for example, listening to MQTT events from IoT devices
   - From there, fire events into our system to trigger other actions

For now, focus on #1 first.

The immediate task is simple: build a job that reads files / reads databases / reads APIs and writes the raw data directly into our MongoDB.

This can run as a cronjob / time interval / schedule for now, but we need to solve the problems of not running duplicate jobs and not creating duplicate data. Whatever raw data we get, store it as-is for now — we will handle transform / ingestion later for the analysis or rule-based engine use cases.

Our data will have 3 types:

1. **Metadata**:
   - Excel/CSV structure (header): how many fields, what data type each field is
   - External database schema: tables, columns, data types, …
   - API response schema: JSON structure, …

2. **Raw data**:
   - The actual data captured at each sync

3. **Sync history**:
   - Trace the sync history
   - Each run must figure out which data is insert / update / delete
   - Keep detailed history so issues can be traced

On system design: we will later deploy via Docker (compose or k8s). The sync job part should be a separate container. If you use NestJS, create a project under `services/` containing workers to run sync, plus services exposing APIs/GraphQL for admin data (trace, history, job config, …). Our services are internal, so authentication can be as simple as API-Key. Authorization will be upgraded later — for now focus on functionality.
