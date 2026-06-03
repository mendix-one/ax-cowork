# A2 -- Data Model Specification

> **IRIS — Intelligent Resources Information System**
> **Analysis Handoff Task A2: Data Modeling**

---

| Field           | Value                                                 |
| --------------- | ----------------------------------------------------- |
| **Document ID** | A2                                                    |
| **Product**     | IRIS by Amoza                                         |
| **Client**      | Samsung Electronics — Device Solutions Research (DSR) |
| **AX Phase**    | DESIGN → DEVELOP bridge                               |
| **Owner**       | CXO + CDO                                             |
| **Version**     | 1.0.0                                                 |
| **Date**        | 2026-03-22                                            |
| **Status**      | Draft                                                 |

---

## Table of Contents

1. [Document Purpose](#1-document-purpose)
2. [Architecture Overview](#2-architecture-overview)
3. [Conceptual Data Model](#3-conceptual-data-model)
4. [Logical Schema (3NF)](#4-logical-schema-3nf)
5. [Physical Design — Oracle 19c](#5-physical-design--oracle-19c)
6. [Elasticsearch Index Specifications](#6-elasticsearch-index-specifications)
7. [Denormalization Transform](#7-denormalization-transform)
8. [Data Dictionary](#8-data-dictionary)
9. [Multi-Dimensional Analysis Mapping](#9-multi-dimensional-analysis-mapping)
10. [Data Sync Architecture](#10-data-sync-architecture)
11. [Data Consistency Rules](#11-data-consistency-rules)
12. [Migration Strategy](#12-migration-strategy)

---

## 1. Document Purpose

This document is the **single authoritative reference** for all IRIS data structures. The Development Team must be able to create the complete database schema — Oracle 19c tables, Elasticsearch indices, sync infrastructure, and migration scripts — from this document alone.

### Audience

| Role                         | Usage                                                   |
| ---------------------------- | ------------------------------------------------------- |
| **CDO / Database Engineer**  | Create Oracle DDL, configure ES indices, implement sync |
| **CAO / Backend Developer**  | Understand entity relationships for Mendix domain model |
| **CXO / Frontend Developer** | Understand data shapes for UI binding                   |
| **COO / DevOps**             | Plan storage, partitioning, backup, and monitoring      |

### Dual-Storage Architecture Rule

> **Oracle 19c is the single source of truth.** All writes go to Oracle first. Elasticsearch is a read-optimized projection derived from Oracle data. ES is never written to directly by business logic.

---

## 2. Architecture Overview

```
+===============================================================+
|                    WRITE PATH (Transactional)                  |
|                                                                |
|  Mendix 10 UI  →  Mendix Runtime (Java)  →  Oracle 19c        |
|                                               (ACID COMMIT)    |
|                                                    |           |
|                                          After-Commit Event    |
|                                                    |           |
|                                              SyncQueue         |
|                                              (Oracle table)    |
|                                                    |           |
|                                             Sync Worker        |
|                                             (30s cycle)        |
|                                                    |           |
|                                           Elasticsearch 8.x   |
|                                           (Bulk API index)     |
+===============================================================+

+===============================================================+
|                    READ PATH                                   |
|                                                                |
|  Transactional Reads          Analytical Reads                 |
|  (Forms, editing, approval)   (Dashboards, charts, reports)    |
|          |                            |                        |
|          v                            v                        |
|     Oracle 19c                   Elasticsearch 8.x             |
|     (Mendix ORM)                (M33 REST client)              |
|                                       |                        |
|                                  ECharts / Gantt / WorldMap    |
+===============================================================+
```

### Storage Responsibility Matrix

| Concern           | Oracle 19c                                      | Elasticsearch 8.x                                |
| ----------------- | ----------------------------------------------- | ------------------------------------------------ |
| **Purpose**       | Transactional CRUD, ACID, referential integrity | Multi-dimensional aggregations, full-text search |
| **Data Shape**    | Normalized snowflake (28 tables)                | Denormalized flat documents (4 indices)          |
| **Query Pattern** | Single-entity lookups, joins, writes            | Aggregation across millions of records           |
| **Consistency**   | Strong (ACID)                                   | Eventual (~1-5 seconds)                          |
| **Users**         | Planners editing plans, roadmaps, simulations   | Analysts viewing dashboards, reports             |

---

## 3. Conceptual Data Model

### 3.1 Domain Groupings

The IRIS data model spans 4 domains containing 28 entities.

```
+============================================================+
|                   DOMAIN 1: MASTER DATA                     |
|                   (10 entities, from N-PLM)                 |
|                                                             |
|   Country ◄──── Site                                        |
|                   │                                         |
|   Division ──► BusinessUnit ──► Department ──► Team         |
|                                   │              │          |
|                                   │           Employee      |
|                                   │              │          |
|   ProductFamily ◄── Project ──► ProjectType      │          |
|                       │                          │          |
|                       └──────────────────────────┘          |
+============================================================+
          │                    │                │
          v                    v                v
+============================================================+
|                DOMAIN 2: PLANNING                           |
|                (9 entities)                                  |
|                                                             |
|   ResourceRoadmap ──► RoadmapVersion                        |
|                           │                                 |
|                    RoadmapProjectAllocation                  |
|                                                             |
|   ResourceSimulation ──► SimulationVersion                  |
|                              │                              |
|                       SimulationAllocation                   |
|                                                             |
|   PMPlan ──► PMPlanVersion ──► PMEntry                      |
+============================================================+
          │
          v
+============================================================+
|            DOMAIN 3: HEADCOUNT                              |
|            (2 entities)                                      |
|                                                             |
|   HeadCountPlan ──► HeadCountEntry                          |
+============================================================+
          │
          v
+============================================================+
|         DOMAIN 4: WORKFLOW & CONTROL                        |
|         (7 entities)                                         |
|                                                             |
|   ApprovalRequest ──► ApprovalHistory                       |
|   FactorControlSet ──► FactorControlItem                    |
|   SyncQueue                                                 |
|   SyncRecord                                                |
|   SyncAuditLog                                              |
|   NotificationSchedule                                      |
+============================================================+
```

### 3.2 Entity Relationship Summary

| Relationship                              | Type | Description                                    |
| ----------------------------------------- | ---- | ---------------------------------------------- |
| Country → Site                            | 1:N  | A country has many sites                       |
| Site → Department                         | 1:N  | A site houses many departments                 |
| Division → BusinessUnit                   | 1:N  | A division contains many BUs                   |
| BusinessUnit → Department                 | 1:N  | A BU contains many departments                 |
| Department → Department                   | 1:N  | Self-referencing hierarchy                     |
| Department → Team                         | 1:N  | A department has many teams                    |
| Team → Employee                           | 1:N  | A team has many employees                      |
| Site → Employee                           | 1:N  | An employee is assigned to one site            |
| Employee → Team (lead)                    | 1:1  | A team has one lead                            |
| BusinessUnit → ProductFamily              | 1:N  | A BU owns many product families                |
| ProductFamily → Project                   | 1:N  | A product family has many projects             |
| ProjectType → Project                     | 1:N  | A project type classifies many projects        |
| Employee → Project (owner)                | 1:N  | An employee can own many projects              |
| Site → Project                            | 1:N  | A project is based at one site                 |
| ResourceRoadmap → RoadmapVersion          | 1:N  | A roadmap has many versions                    |
| RoadmapVersion → RoadmapVersion           | 1:N  | Parent-child version chain                     |
| RoadmapVersion → RoadmapProjectAllocation | 1:N  | A version has many allocations                 |
| Project → RoadmapProjectAllocation        | 1:N  | A project appears in many allocations          |
| Employee → RoadmapProjectAllocation       | 1:N  | An employee appears in many allocations        |
| ResourceSimulation → SimulationVersion    | 1:N  | A simulation has many versions                 |
| RoadmapVersion → ResourceSimulation       | 1:N  | A simulation is created from a roadmap version |
| SimulationVersion → SimulationAllocation  | 1:N  | A sim version has many allocations             |
| PMPlan → PMPlanVersion                    | 1:N  | A PM plan has many versions                    |
| PMPlanVersion → PMEntry                   | 1:N  | A version has many entries                     |
| HeadCountPlan → HeadCountEntry            | 1:N  | A HC plan has many entries                     |
| ApprovalRequest → ApprovalHistory         | 1:N  | A request has approval history                 |
| FactorControlSet → FactorControlItem      | 1:N  | A filter set has many filter items             |
| SyncQueue → SyncAuditLog                  | N:1  | Queue items logged in audit                    |

---

## 4. Logical Schema (3NF)

All entities are normalized to Third Normal Form (3NF). Every non-key attribute depends on the key, the whole key, and nothing but the key.

### Naming Conventions

| Convention    | Rule                               | Example                                                |
| ------------- | ---------------------------------- | ------------------------------------------------------ |
| Table names   | UPPER_SNAKE_CASE, singular         | `EMPLOYEE`, `ROADMAP_VERSION`                          |
| Column names  | lower_snake_case                   | `employee_id`, `created_at`                            |
| Primary keys  | `{entity}_id`                      | `site_id`, `team_id`                                   |
| Foreign keys  | `{referenced_entity}_id`           | `country_id`, `bu_id`                                  |
| Audit columns | All tables include 4 audit columns | `created_at`, `created_by`, `updated_at`, `updated_by` |
| Soft delete   | Where applicable                   | `is_deleted`, `deleted_at`                             |

### 4.1 DOMAIN 1: Master Data

#### COUNTRY

| Attribute      | Data Type     | Nullable | Constraints                           | Description                         |
| -------------- | ------------- | -------- | ------------------------------------- | ----------------------------------- |
| `country_id`   | VARCHAR(36)   | NOT NULL | PK                                    | UUID primary key                    |
| `country_name` | VARCHAR(100)  | NOT NULL | UNIQUE                                | Country name (e.g., "Korea", "USA") |
| `country_code` | VARCHAR(3)    | NOT NULL | UNIQUE                                | ISO 3166-1 alpha-3 code             |
| `region`       | VARCHAR(20)   | NOT NULL | CHECK IN ('APAC', 'Americas', 'EMEA') | Geographic region                   |
| `latitude`     | DECIMAL(10,7) | YES      |                                       | Country centroid latitude           |
| `longitude`    | DECIMAL(10,7) | YES      |                                       | Country centroid longitude          |
| `is_active`    | BOOLEAN       | NOT NULL | DEFAULT TRUE                          | Soft-active flag                    |
| `created_at`   | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP             | Record creation time                |
| `created_by`   | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE                         | Creator                             |
| `updated_at`   | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP             | Last update time                    |
| `updated_by`   | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE                         | Last updater                        |

#### SITE

| Attribute    | Data Type     | Nullable | Constraints               | Description                            |
| ------------ | ------------- | -------- | ------------------------- | -------------------------------------- |
| `site_id`    | VARCHAR(36)   | NOT NULL | PK                        | UUID primary key                       |
| `site_name`  | VARCHAR(100)  | NOT NULL |                           | Site name (e.g., "Hwaseong", "Austin") |
| `site_code`  | VARCHAR(20)   | NOT NULL | UNIQUE                    | Site code for integration              |
| `country_id` | VARCHAR(36)   | NOT NULL | FK → COUNTRY              | Country this site belongs to           |
| `latitude`   | DECIMAL(10,7) | YES      |                           | GPS latitude for world map pin         |
| `longitude`  | DECIMAL(10,7) | YES      |                           | GPS longitude for world map pin        |
| `timezone`   | VARCHAR(50)   | NOT NULL |                           | IANA timezone (e.g., "Asia/Seoul")     |
| `is_active`  | BOOLEAN       | NOT NULL | DEFAULT TRUE              | Soft-active flag                       |
| `created_at` | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                        |
| `created_by` | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE             |                                        |
| `updated_at` | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                        |
| `updated_by` | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE             |                                        |

#### DIVISION

| Attribute       | Data Type    | Nullable | Constraints               | Description                                |
| --------------- | ------------ | -------- | ------------------------- | ------------------------------------------ |
| `division_id`   | VARCHAR(36)  | NOT NULL | PK                        | UUID primary key                           |
| `division_name` | VARCHAR(100) | NOT NULL | UNIQUE                    | Division name (e.g., "DS", "DX", "Harman") |
| `division_code` | VARCHAR(20)  | NOT NULL | UNIQUE                    | Division code                              |
| `is_active`     | BOOLEAN      | NOT NULL | DEFAULT TRUE              |                                            |
| `created_at`    | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                            |
| `created_by`    | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE             |                                            |
| `updated_at`    | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                            |
| `updated_by`    | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE             |                                            |

#### BUSINESS_UNIT

| Attribute     | Data Type    | Nullable | Constraints               | Description                                       |
| ------------- | ------------ | -------- | ------------------------- | ------------------------------------------------- |
| `bu_id`       | VARCHAR(36)  | NOT NULL | PK                        | UUID primary key                                  |
| `bu_name`     | VARCHAR(100) | NOT NULL |                           | BU name (e.g., "Memory", "System LSI", "Foundry") |
| `bu_code`     | VARCHAR(20)  | NOT NULL | UNIQUE                    | BU code                                           |
| `division_id` | VARCHAR(36)  | NOT NULL | FK → DIVISION             | Parent division                                   |
| `is_active`   | BOOLEAN      | NOT NULL | DEFAULT TRUE              |                                                   |
| `created_at`  | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                                   |
| `created_by`  | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE             |                                                   |
| `updated_at`  | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                                   |
| `updated_by`  | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE             |                                                   |

#### DEPARTMENT

| Attribute        | Data Type    | Nullable | Constraints               | Description                     |
| ---------------- | ------------ | -------- | ------------------------- | ------------------------------- |
| `dept_id`        | VARCHAR(36)  | NOT NULL | PK                        | UUID primary key                |
| `dept_name`      | VARCHAR(100) | NOT NULL |                           | Department name                 |
| `dept_code`      | VARCHAR(20)  | NOT NULL | UNIQUE                    | Department code                 |
| `bu_id`          | VARCHAR(36)  | NOT NULL | FK → BUSINESS_UNIT        | Parent BU                       |
| `site_id`        | VARCHAR(36)  | NOT NULL | FK → SITE                 | Site location                   |
| `parent_dept_id` | VARCHAR(36)  | YES      | FK → DEPARTMENT (self)    | Parent department for hierarchy |
| `is_active`      | BOOLEAN      | NOT NULL | DEFAULT TRUE              |                                 |
| `created_at`     | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                 |
| `created_by`     | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE             |                                 |
| `updated_at`     | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                 |
| `updated_by`     | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE             |                                 |

#### TEAM

| Attribute      | Data Type    | Nullable | Constraints               | Description                        |
| -------------- | ------------ | -------- | ------------------------- | ---------------------------------- |
| `team_id`      | VARCHAR(36)  | NOT NULL | PK                        | UUID primary key                   |
| `team_name`    | VARCHAR(100) | NOT NULL |                           | Team name                          |
| `dept_id`      | VARCHAR(36)  | NOT NULL | FK → DEPARTMENT           | Parent department                  |
| `team_lead_id` | VARCHAR(36)  | YES      | FK → EMPLOYEE             | Team lead (nullable for new teams) |
| `is_active`    | BOOLEAN      | NOT NULL | DEFAULT TRUE              |                                    |
| `created_at`   | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                    |
| `created_by`   | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE             |                                    |
| `updated_at`   | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                    |
| `updated_by`   | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE             |                                    |

#### EMPLOYEE

| Attribute         | Data Type    | Nullable | Constraints                                                              | Description                                          |
| ----------------- | ------------ | -------- | ------------------------------------------------------------------------ | ---------------------------------------------------- |
| `employee_id`     | VARCHAR(36)  | NOT NULL | PK                                                                       | UUID primary key                                     |
| `employee_number` | VARCHAR(20)  | NOT NULL | UNIQUE                                                                   | Samsung employee number (natural key for N-PLM sync) |
| `name`            | VARCHAR(100) | NOT NULL |                                                                          | Full name                                            |
| `email`           | VARCHAR(200) | NOT NULL | UNIQUE                                                                   | Corporate email                                      |
| `job_title`       | VARCHAR(100) | NOT NULL |                                                                          | Job title                                            |
| `job_grade`       | VARCHAR(10)  | NOT NULL |                                                                          | Grade (e.g., "G5", "G6", "G7", "G8", "G9")           |
| `skill_category`  | VARCHAR(30)  | NOT NULL | CHECK IN ('Design', 'Process', 'Test', 'Package', 'Management', 'Other') | Primary skill area                                   |
| `team_id`         | VARCHAR(36)  | NOT NULL | FK → TEAM                                                                | Assigned team                                        |
| `site_id`         | VARCHAR(36)  | NOT NULL | FK → SITE                                                                | Work site                                            |
| `hire_date`       | DATE         | NOT NULL |                                                                          | Date of hire                                         |
| `is_active`       | BOOLEAN      | NOT NULL | DEFAULT TRUE                                                             | Currently employed                                   |
| `created_at`      | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                                |                                                      |
| `created_by`      | VARCHAR(36)  | NOT NULL |                                                                          |                                                      |
| `updated_at`      | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                                |                                                      |
| `updated_by`      | VARCHAR(36)  | NOT NULL |                                                                          |                                                      |

#### PROJECT_TYPE

| Attribute    | Data Type   | Nullable | Constraints                            | Description                                                        |
| ------------ | ----------- | -------- | -------------------------------------- | ------------------------------------------------------------------ |
| `type_id`    | VARCHAR(36) | NOT NULL | PK                                     | UUID primary key                                                   |
| `type_name`  | VARCHAR(50) | NOT NULL | UNIQUE                                 | Type name (e.g., "R&D", "Production", "Support", "Infrastructure") |
| `category`   | VARCHAR(30) | NOT NULL | CHECK IN ('Core', 'Sustaining', 'New') | Project category                                                   |
| `is_active`  | BOOLEAN     | NOT NULL | DEFAULT TRUE                           |                                                                    |
| `created_at` | TIMESTAMP   | NOT NULL | DEFAULT CURRENT_TIMESTAMP              |                                                                    |
| `created_by` | VARCHAR(36) | NOT NULL |                                        |                                                                    |
| `updated_at` | TIMESTAMP   | NOT NULL | DEFAULT CURRENT_TIMESTAMP              |                                                                    |
| `updated_by` | VARCHAR(36) | NOT NULL |                                        |                                                                    |

#### PRODUCT_FAMILY

| Attribute     | Data Type    | Nullable | Constraints               | Description                                                           |
| ------------- | ------------ | -------- | ------------------------- | --------------------------------------------------------------------- |
| `family_id`   | VARCHAR(36)  | NOT NULL | PK                        | UUID primary key                                                      |
| `family_name` | VARCHAR(100) | NOT NULL | UNIQUE                    | Product family (e.g., "DRAM", "NAND", "Exynos", "ISOCELL", "Foundry") |
| `bu_id`       | VARCHAR(36)  | NOT NULL | FK → BUSINESS_UNIT        | Owning BU                                                             |
| `is_active`   | BOOLEAN      | NOT NULL | DEFAULT TRUE              |                                                                       |
| `created_at`  | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                                                       |
| `created_by`  | VARCHAR(36)  | NOT NULL |                           |                                                                       |
| `updated_at`  | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                                                       |
| `updated_by`  | VARCHAR(36)  | NOT NULL |                           |                                                                       |

#### PROJECT

| Attribute           | Data Type    | Nullable | Constraints                                             | Description                                 |
| ------------------- | ------------ | -------- | ------------------------------------------------------- | ------------------------------------------- |
| `project_id`        | VARCHAR(36)  | NOT NULL | PK                                                      | UUID primary key                            |
| `project_name`      | VARCHAR(200) | NOT NULL |                                                         | Project name                                |
| `project_code`      | VARCHAR(30)  | NOT NULL | UNIQUE                                                  | Project code (e.g., "HBM4-DEV")             |
| `project_type_id`   | VARCHAR(36)  | NOT NULL | FK → PROJECT_TYPE                                       | Project type                                |
| `product_family_id` | VARCHAR(36)  | NOT NULL | FK → PRODUCT_FAMILY                                     | Product family                              |
| `technology_node`   | VARCHAR(20)  | YES      |                                                         | Technology node (e.g., "3nm", "5nm", "7nm") |
| `priority`          | INTEGER      | NOT NULL | CHECK BETWEEN 1 AND 5                                   | Priority 1 (highest) to 5 (lowest)          |
| `start_date`        | DATE         | NOT NULL |                                                         | Planned start                               |
| `target_end_date`   | DATE         | YES      |                                                         | Planned end                                 |
| `status`            | VARCHAR(20)  | NOT NULL | CHECK IN ('Active', 'OnHold', 'Completed', 'Cancelled') | Project status                              |
| `owner_id`          | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE                                           | Project owner                               |
| `site_id`           | VARCHAR(36)  | NOT NULL | FK → SITE                                               | Primary site                                |
| `is_deleted`        | BOOLEAN      | NOT NULL | DEFAULT FALSE                                           | Soft delete                                 |
| `deleted_at`        | TIMESTAMP    | YES      |                                                         | Deletion timestamp                          |
| `created_at`        | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP                               |                                             |
| `created_by`        | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE                                           |                                             |
| `updated_at`        | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP                               |                                             |
| `updated_by`        | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE                                           |                                             |

### 4.2 DOMAIN 2: Planning

#### RESOURCE_ROADMAP

| Attribute      | Data Type    | Nullable | Constraints                              | Description      |
| -------------- | ------------ | -------- | ---------------------------------------- | ---------------- |
| `roadmap_id`   | VARCHAR(36)  | NOT NULL | PK                                       | UUID primary key |
| `roadmap_name` | VARCHAR(200) | NOT NULL |                                          | Roadmap name     |
| `site_id`      | VARCHAR(36)  | NOT NULL | FK → SITE                                | Scope: site      |
| `bu_id`        | VARCHAR(36)  | NOT NULL | FK → BUSINESS_UNIT                       | Scope: BU        |
| `fiscal_year`  | INTEGER      | NOT NULL | CHECK BETWEEN 2020 AND 2040              | Fiscal year      |
| `status`       | VARCHAR(20)  | NOT NULL | CHECK IN ('Draft', 'Active', 'Archived') | Roadmap status   |
| `is_deleted`   | BOOLEAN      | NOT NULL | DEFAULT FALSE                            |                  |
| `deleted_at`   | TIMESTAMP    | YES      |                                          |                  |
| `created_at`   | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP                |                  |
| `created_by`   | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE                            |                  |
| `updated_at`   | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP                |                  |
| `updated_by`   | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE                            |                  |

#### ROADMAP_VERSION

| Attribute           | Data Type     | Nullable | Constraints                                     | Description                        |
| ------------------- | ------------- | -------- | ----------------------------------------------- | ---------------------------------- |
| `version_id`        | VARCHAR(36)   | NOT NULL | PK                                              | UUID primary key                   |
| `roadmap_id`        | VARCHAR(36)   | NOT NULL | FK → RESOURCE_ROADMAP                           | Parent roadmap                     |
| `version_number`    | VARCHAR(10)   | NOT NULL |                                                 | Version label (e.g., "V1", "V2")   |
| `version_type`      | VARCHAR(20)   | NOT NULL | CHECK IN ('Draft', 'Approved', 'PROMIS_Synced') | Version type                       |
| `parent_version_id` | VARCHAR(36)   | YES      | FK → ROADMAP_VERSION (self)                     | Previous version for diff tracking |
| `change_summary`    | VARCHAR(2000) | YES      |                                                 | Auto-generated diff summary        |
| `promis_synced`     | BOOLEAN       | NOT NULL | DEFAULT FALSE                                   | Synced to PROMIS                   |
| `promis_sync_date`  | TIMESTAMP     | YES      |                                                 | When synced                        |
| `approved_by`       | VARCHAR(36)   | YES      | FK → EMPLOYEE                                   | Approver                           |
| `approved_date`     | TIMESTAMP     | YES      |                                                 | Approval date                      |
| `created_at`        | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP                       |                                    |
| `created_by`        | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE                                   |                                    |
| `updated_at`        | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP                       |                                    |
| `updated_by`        | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE                                   |                                    |

**Unique constraint**: `UNIQUE(roadmap_id, version_number)`

#### ROADMAP_PROJECT_ALLOCATION

| Attribute              | Data Type     | Nullable | Constraints                            | Description        |
| ---------------------- | ------------- | -------- | -------------------------------------- | ------------------ |
| `allocation_id`        | VARCHAR(36)   | NOT NULL | PK                                     | UUID primary key   |
| `version_id`           | VARCHAR(36)   | NOT NULL | FK → ROADMAP_VERSION                   | Parent version     |
| `project_id`           | VARCHAR(36)   | NOT NULL | FK → PROJECT                           | Target project     |
| `employee_id`          | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE                          | Allocated employee |
| `period`               | VARCHAR(7)    | NOT NULL | CHECK format 'YYYY-MM'                 | Month period       |
| `allocated_percentage` | DECIMAL(5,2)  | NOT NULL | CHECK BETWEEN 0 AND 100                | Allocation %       |
| `allocated_hours`      | DECIMAL(7,2)  | NOT NULL | CHECK >= 0                             | Monthly hours      |
| `role_in_project`      | VARCHAR(20)   | NOT NULL | CHECK IN ('Lead', 'Member', 'Support') | Role               |
| `notes`                | VARCHAR(1000) | YES      |                                        | Notes              |
| `created_at`           | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP              |                    |
| `created_by`           | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE                          |                    |
| `updated_at`           | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP              |                    |
| `updated_by`           | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE                          |                    |

**Unique constraint**: `UNIQUE(version_id, project_id, employee_id, period)`

#### RESOURCE_SIMULATION

| Attribute                   | Data Type    | Nullable | Constraints                                            | Description            |
| --------------------------- | ------------ | -------- | ------------------------------------------------------ | ---------------------- |
| `simulation_id`             | VARCHAR(36)  | NOT NULL | PK                                                     | UUID primary key       |
| `simulation_name`           | VARCHAR(200) | NOT NULL |                                                        | Simulation name        |
| `source_roadmap_version_id` | VARCHAR(36)  | NOT NULL | FK → ROADMAP_VERSION                                   | Source roadmap version |
| `status`                    | VARCHAR(20)  | NOT NULL | CHECK IN ('Draft', 'Running', 'Completed', 'Archived') | Status                 |
| `created_at`                | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP                              |                        |
| `created_by`                | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE                                          |                        |
| `updated_at`                | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP                              |                        |
| `updated_by`                | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE                                          |                        |

#### SIMULATION_VERSION

| Attribute         | Data Type   | Nullable | Constraints               | Description               |
| ----------------- | ----------- | -------- | ------------------------- | ------------------------- |
| `sim_version_id`  | VARCHAR(36) | NOT NULL | PK                        | UUID primary key          |
| `simulation_id`   | VARCHAR(36) | NOT NULL | FK → RESOURCE_SIMULATION  | Parent simulation         |
| `version_number`  | INTEGER     | NOT NULL | CHECK >= 1                | Sequential version        |
| `parameters_json` | CLOB        | YES      |                           | What-if parameters (JSON) |
| `created_at`      | TIMESTAMP   | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                           |
| `created_by`      | VARCHAR(36) | NOT NULL | FK → EMPLOYEE             |                           |
| `updated_at`      | TIMESTAMP   | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                           |
| `updated_by`      | VARCHAR(36) | NOT NULL | FK → EMPLOYEE             |                           |

**Unique constraint**: `UNIQUE(simulation_id, version_number)`

#### SIMULATION_ALLOCATION

| Attribute              | Data Type    | Nullable | Constraints               | Description                            |
| ---------------------- | ------------ | -------- | ------------------------- | -------------------------------------- |
| `sim_alloc_id`         | VARCHAR(36)  | NOT NULL | PK                        | UUID primary key                       |
| `sim_version_id`       | VARCHAR(36)  | NOT NULL | FK → SIMULATION_VERSION   | Parent version                         |
| `project_id`           | VARCHAR(36)  | NOT NULL | FK → PROJECT              | Target project                         |
| `employee_id`          | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE             | Allocated employee                     |
| `period`               | VARCHAR(7)   | NOT NULL | CHECK format 'YYYY-MM'    | Month period                           |
| `allocated_percentage` | DECIMAL(5,2) | NOT NULL | CHECK BETWEEN 0 AND 100   | Allocation %                           |
| `allocated_hours`      | DECIMAL(7,2) | NOT NULL | CHECK >= 0                | Monthly hours                          |
| `delta_vs_roadmap`     | DECIMAL(7,2) | YES      |                           | Difference from source roadmap (hours) |
| `created_at`           | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                        |
| `created_by`           | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE             |                                        |
| `updated_at`           | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                        |
| `updated_by`           | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE             |                                        |

**Unique constraint**: `UNIQUE(sim_version_id, project_id, employee_id, period)`

#### PM_PLAN

| Attribute        | Data Type   | Nullable | Constraints                                                  | Description                 |
| ---------------- | ----------- | -------- | ------------------------------------------------------------ | --------------------------- |
| `pm_plan_id`     | VARCHAR(36) | NOT NULL | PK                                                           | UUID primary key            |
| `site_id`        | VARCHAR(36) | NOT NULL | FK → SITE                                                    | Plan scope: site            |
| `dept_id`        | VARCHAR(36) | NOT NULL | FK → DEPARTMENT                                              | Plan scope: department      |
| `fiscal_year`    | INTEGER     | NOT NULL | CHECK BETWEEN 2020 AND 2040                                  | Fiscal year                 |
| `fiscal_month`   | INTEGER     | NOT NULL | CHECK BETWEEN 1 AND 12                                       | Fiscal month                |
| `status`         | VARCHAR(20) | NOT NULL | CHECK IN ('Editing', 'Draft', 'PendingApproval', 'Approved') | Plan status                 |
| `lock_owner_id`  | VARCHAR(36) | YES      | FK → EMPLOYEE                                                | Concurrent edit lock holder |
| `lock_timestamp` | TIMESTAMP   | YES      |                                                              | Lock acquisition time       |
| `created_at`     | TIMESTAMP   | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                    |                             |
| `created_by`     | VARCHAR(36) | NOT NULL | FK → EMPLOYEE                                                |                             |
| `updated_at`     | TIMESTAMP   | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                    |                             |
| `updated_by`     | VARCHAR(36) | NOT NULL | FK → EMPLOYEE                                                |                             |

**Unique constraint**: `UNIQUE(site_id, dept_id, fiscal_year, fiscal_month)`

#### PM_PLAN_VERSION

| Attribute        | Data Type   | Nullable | Constraints                                 | Description        |
| ---------------- | ----------- | -------- | ------------------------------------------- | ------------------ |
| `pm_version_id`  | VARCHAR(36) | NOT NULL | PK                                          | UUID primary key   |
| `pm_plan_id`     | VARCHAR(36) | NOT NULL | FK → PM_PLAN                                | Parent plan        |
| `version_number` | INTEGER     | NOT NULL | CHECK >= 1                                  | Sequential version |
| `version_type`   | VARCHAR(20) | NOT NULL | CHECK IN ('AutoSave', 'Draft', 'Permanent') | Version type       |
| `approved_by`    | VARCHAR(36) | YES      | FK → EMPLOYEE                               | Approver           |
| `approved_date`  | TIMESTAMP   | YES      |                                             | Approval date      |
| `created_at`     | TIMESTAMP   | NOT NULL | DEFAULT CURRENT_TIMESTAMP                   |                    |
| `created_by`     | VARCHAR(36) | NOT NULL | FK → EMPLOYEE                               |                    |
| `updated_at`     | TIMESTAMP   | NOT NULL | DEFAULT CURRENT_TIMESTAMP                   |                    |
| `updated_by`     | VARCHAR(36) | NOT NULL | FK → EMPLOYEE                               |                    |

**Unique constraint**: `UNIQUE(pm_plan_id, version_number)`

#### PM_ENTRY

| Attribute       | Data Type    | Nullable | Constraints                                     | Description          |
| --------------- | ------------ | -------- | ----------------------------------------------- | -------------------- |
| `entry_id`      | VARCHAR(36)  | NOT NULL | PK                                              | UUID primary key     |
| `pm_version_id` | VARCHAR(36)  | NOT NULL | FK → PM_PLAN_VERSION                            | Parent version       |
| `employee_id`   | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE                                   | Assigned employee    |
| `project_id`    | VARCHAR(36)  | NOT NULL | FK → PROJECT                                    | Target project       |
| `period`        | VARCHAR(7)   | NOT NULL | CHECK format 'YYYY-MM'                          | Month period         |
| `planned_days`  | DECIMAL(5,2) | NOT NULL | CHECK >= 0                                      | Planned working days |
| `planned_hours` | DECIMAL(7,2) | NOT NULL | CHECK >= 0                                      | Planned hours        |
| `actual_days`   | DECIMAL(5,2) | YES      | CHECK >= 0                                      | Actual working days  |
| `actual_hours`  | DECIMAL(7,2) | YES      | CHECK >= 0                                      | Actual hours         |
| `status`        | VARCHAR(20)  | NOT NULL | CHECK IN ('Planned', 'InProgress', 'Completed') | Entry status         |
| `created_at`    | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP                       |                      |
| `created_by`    | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE                                   |                      |
| `updated_at`    | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP                       |                      |
| `updated_by`    | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE                                   |                      |

**Unique constraint**: `UNIQUE(pm_version_id, employee_id, project_id, period)`

### 4.3 DOMAIN 3: HeadCount

#### HEADCOUNT_PLAN

| Attribute     | Data Type   | Nullable | Constraints                                                   | Description            |
| ------------- | ----------- | -------- | ------------------------------------------------------------- | ---------------------- |
| `hc_plan_id`  | VARCHAR(36) | NOT NULL | PK                                                            | UUID primary key       |
| `site_id`     | VARCHAR(36) | NOT NULL | FK → SITE                                                     | Plan scope: site       |
| `dept_id`     | VARCHAR(36) | NOT NULL | FK → DEPARTMENT                                               | Plan scope: department |
| `fiscal_year` | INTEGER     | NOT NULL | CHECK BETWEEN 2020 AND 2040                                   | Fiscal year            |
| `status`      | VARCHAR(20) | NOT NULL | CHECK IN ('Draft', 'PendingApproval', 'Approved', 'Archived') | Plan status            |
| `created_at`  | TIMESTAMP   | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                     |                        |
| `created_by`  | VARCHAR(36) | NOT NULL | FK → EMPLOYEE                                                 |                        |
| `updated_at`  | TIMESTAMP   | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                     |                        |
| `updated_by`  | VARCHAR(36) | NOT NULL | FK → EMPLOYEE                                                 |                        |

**Unique constraint**: `UNIQUE(site_id, dept_id, fiscal_year)`

#### HEADCOUNT_ENTRY

| Attribute        | Data Type   | Nullable | Constraints                                                              | Description                 |
| ---------------- | ----------- | -------- | ------------------------------------------------------------------------ | --------------------------- |
| `hc_entry_id`    | VARCHAR(36) | NOT NULL | PK                                                                       | UUID primary key            |
| `hc_plan_id`     | VARCHAR(36) | NOT NULL | FK → HEADCOUNT_PLAN                                                      | Parent plan                 |
| `job_grade`      | VARCHAR(10) | NOT NULL |                                                                          | Grade (e.g., "G5", "G7")    |
| `skill_category` | VARCHAR(30) | NOT NULL | CHECK IN ('Design', 'Process', 'Test', 'Package', 'Management', 'Other') | Skill area                  |
| `period`         | VARCHAR(7)  | NOT NULL |                                                                          | Period (YYYY-MM or YYYY-QN) |
| `current_count`  | INTEGER     | NOT NULL | CHECK >= 0                                                               | Current headcount           |
| `planned_count`  | INTEGER     | NOT NULL | CHECK >= 0                                                               | Planned headcount           |
| `target_count`   | INTEGER     | NOT NULL | CHECK >= 0                                                               | Target headcount            |
| `gap`            | INTEGER     | NOT NULL |                                                                          | Computed: target - planned  |
| `action`         | VARCHAR(20) | NOT NULL | CHECK IN ('Hire', 'Transfer', 'Retain', 'Reduce', 'None')                | Recommended action          |
| `created_at`     | TIMESTAMP   | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                                |                             |
| `created_by`     | VARCHAR(36) | NOT NULL | FK → EMPLOYEE                                                            |                             |
| `updated_at`     | TIMESTAMP   | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                                |                             |
| `updated_by`     | VARCHAR(36) | NOT NULL | FK → EMPLOYEE                                                            |                             |

### 4.4 DOMAIN 4: Workflow & Control

#### APPROVAL_REQUEST

| Attribute        | Data Type     | Nullable | Constraints                                               | Description                   |
| ---------------- | ------------- | -------- | --------------------------------------------------------- | ----------------------------- |
| `request_id`     | VARCHAR(36)   | NOT NULL | PK                                                        | UUID primary key              |
| `entity_type`    | VARCHAR(30)   | NOT NULL | CHECK IN ('PMPlan', 'Roadmap', 'Simulation', 'HeadCount') | Type of entity being approved |
| `entity_id`      | VARCHAR(36)   | NOT NULL |                                                           | FK to the versioned entity    |
| `version_id`     | VARCHAR(36)   | NOT NULL |                                                           | Version being approved        |
| `requester_id`   | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE                                             | Who requested approval        |
| `approver_id`    | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE                                             | Designated approver           |
| `status`         | VARCHAR(20)   | NOT NULL | CHECK IN ('Pending', 'Approved', 'Rejected', 'Cancelled') | Approval status               |
| `requested_date` | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                 | Request timestamp             |
| `resolved_date`  | TIMESTAMP     | YES      |                                                           | Resolution timestamp          |
| `comments`       | VARCHAR(2000) | YES      |                                                           | Approval/rejection comments   |
| `created_at`     | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                 |                               |
| `created_by`     | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE                                             |                               |
| `updated_at`     | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                 |                               |
| `updated_by`     | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE                                             |                               |

#### APPROVAL_HISTORY

| Attribute     | Data Type     | Nullable | Constraints                                                              | Description           |
| ------------- | ------------- | -------- | ------------------------------------------------------------------------ | --------------------- |
| `history_id`  | VARCHAR(36)   | NOT NULL | PK                                                                       | UUID primary key      |
| `request_id`  | VARCHAR(36)   | NOT NULL | FK → APPROVAL_REQUEST                                                    | Parent request        |
| `action`      | VARCHAR(20)   | NOT NULL | CHECK IN ('Submitted', 'Approved', 'Rejected', 'Escalated', 'Cancelled') | Action taken          |
| `actor_id`    | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE                                                            | Who performed action  |
| `action_date` | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                                | When action was taken |
| `comments`    | VARCHAR(2000) | YES      |                                                                          | Comments              |
| `created_at`  | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                                |                       |
| `created_by`  | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE                                                            |                       |
| `updated_at`  | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                                |                       |
| `updated_by`  | VARCHAR(36)   | NOT NULL | FK → EMPLOYEE                                                            |                       |

#### FACTOR_CONTROL_SET

| Attribute    | Data Type    | Nullable | Constraints               | Description                        |
| ------------ | ------------ | -------- | ------------------------- | ---------------------------------- |
| `fcs_id`     | VARCHAR(36)  | NOT NULL | PK                        | UUID primary key                   |
| `name`       | VARCHAR(100) | NOT NULL |                           | Filter set name                    |
| `user_id`    | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE             | Owner of saved filter set          |
| `is_default` | BOOLEAN      | NOT NULL | DEFAULT FALSE             | Whether this is user's default set |
| `created_at` | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                    |
| `created_by` | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE             |                                    |
| `updated_at` | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP |                                    |
| `updated_by` | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE             |                                    |

#### FACTOR_CONTROL_ITEM

| Attribute    | Data Type   | Nullable | Constraints                                                                                                                  | Description           |
| ------------ | ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `fci_id`     | VARCHAR(36) | NOT NULL | PK                                                                                                                           | UUID primary key      |
| `fcs_id`     | VARCHAR(36) | NOT NULL | FK → FACTOR_CONTROL_SET                                                                                                      | Parent filter set     |
| `dimension`  | VARCHAR(30) | NOT NULL | CHECK IN ('site', 'department', 'project_type', 'period', 'bu', 'division', 'skill_category', 'job_grade', 'product_family') | Filter dimension      |
| `operator`   | VARCHAR(20) | NOT NULL | CHECK IN ('eq', 'in', 'between', 'not_in', 'gte', 'lte')                                                                     | Filter operator       |
| `value_json` | CLOB        | NOT NULL |                                                                                                                              | Filter values as JSON |
| `created_at` | TIMESTAMP   | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                                                                                    |                       |
| `created_by` | VARCHAR(36) | NOT NULL | FK → EMPLOYEE                                                                                                                |                       |
| `updated_at` | TIMESTAMP   | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                                                                                    |                       |
| `updated_by` | VARCHAR(36) | NOT NULL | FK → EMPLOYEE                                                                                                                |                       |

#### SYNC_QUEUE

| Attribute       | Data Type     | Nullable | Constraints                                                                                       | Description               |
| --------------- | ------------- | -------- | ------------------------------------------------------------------------------------------------- | ------------------------- |
| `queue_id`      | NUMBER        | NOT NULL | PK (auto-increment sequence)                                                                      | Sequential queue ID       |
| `entity_type`   | VARCHAR(30)   | NOT NULL | CHECK IN ('PMPlanVersion', 'RoadmapVersion', 'SimulationVersion', 'HeadCountEntry', 'MasterData') | Changed entity type       |
| `entity_id`     | VARCHAR(36)   | NOT NULL |                                                                                                   | PK of changed entity      |
| `action`        | VARCHAR(10)   | NOT NULL | CHECK IN ('UPSERT', 'DELETE')                                                                     | Sync action               |
| `status`        | VARCHAR(15)   | NOT NULL | CHECK IN ('PENDING', 'PROCESSING', 'COMPLETED', 'RETRY', 'FAILED')                                | Queue item status         |
| `target_index`  | VARCHAR(50)   | NOT NULL |                                                                                                   | Target ES index name      |
| `created_at`    | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                                                         | Queue insertion time      |
| `processed_at`  | TIMESTAMP     | YES      |                                                                                                   | Processing time           |
| `retry_count`   | INTEGER       | NOT NULL | DEFAULT 0, CHECK BETWEEN 0 AND 3                                                                  | Retry attempts            |
| `error_message` | VARCHAR(4000) | YES      |                                                                                                   | Error details on failure  |
| `batch_id`      | VARCHAR(36)   | YES      |                                                                                                   | Batch processing group ID |

#### SYNC_RECORD

| Attribute               | Data Type     | Nullable | Constraints                               | Description                                  |
| ----------------------- | ------------- | -------- | ----------------------------------------- | -------------------------------------------- |
| `sync_id`               | VARCHAR(36)   | NOT NULL | PK                                        | UUID primary key                             |
| `target_system`         | VARCHAR(20)   | NOT NULL | CHECK IN ('PROMIS', 'N-PLM')              | External system                              |
| `entity_type`           | VARCHAR(30)   | NOT NULL |                                           | Synced entity type                           |
| `entity_id`             | VARCHAR(36)   | NOT NULL |                                           | Synced entity PK                             |
| `version_id`            | VARCHAR(36)   | YES      |                                           | Version if applicable                        |
| `sync_status`           | VARCHAR(15)   | NOT NULL | CHECK IN ('Pending', 'Success', 'Failed') | Sync status                                  |
| `sync_date`             | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP                 | Sync timestamp                               |
| `changed_projects_json` | CLOB          | YES      |                                           | List of changed project IDs (for delta sync) |
| `error_message`         | VARCHAR(4000) | YES      |                                           | Error details                                |
| `created_at`            | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP                 |                                              |
| `created_by`            | VARCHAR(36)   | NOT NULL |                                           |                                              |
| `updated_at`            | TIMESTAMP     | NOT NULL | DEFAULT CURRENT_TIMESTAMP                 |                                              |
| `updated_by`            | VARCHAR(36)   | NOT NULL |                                           |                                              |

#### SYNC_AUDIT_LOG

| Attribute             | Data Type     | Nullable | Constraints                                              | Description                       |
| --------------------- | ------------- | -------- | -------------------------------------------------------- | --------------------------------- |
| `audit_id`            | VARCHAR(36)   | NOT NULL | PK                                                       | UUID primary key                  |
| `sync_type`           | VARCHAR(20)   | NOT NULL | CHECK IN ('EVENT_DRIVEN', 'SCHEDULED_FULL', 'ON_DEMAND') | Sync type                         |
| `target_index`        | VARCHAR(50)   | NOT NULL |                                                          | Target ES index                   |
| `started_at`          | TIMESTAMP     | NOT NULL |                                                          | Sync start time                   |
| `completed_at`        | TIMESTAMP     | YES      |                                                          | Sync end time                     |
| `duration_ms`         | NUMBER        | YES      |                                                          | Duration in milliseconds          |
| `documents_processed` | INTEGER       | NOT NULL | DEFAULT 0                                                | Docs indexed                      |
| `documents_failed`    | INTEGER       | NOT NULL | DEFAULT 0                                                | Docs failed                       |
| `oracle_count`        | INTEGER       | YES      |                                                          | Oracle row count for verification |
| `es_count`            | INTEGER       | YES      |                                                          | ES doc count after sync           |
| `count_match`         | BOOLEAN       | YES      |                                                          | oracle_count == es_count          |
| `status`              | VARCHAR(20)   | NOT NULL | CHECK IN ('SUCCESS', 'PARTIAL_FAILURE', 'FAILED')        | Sync result                       |
| `error_details`       | VARCHAR(4000) | YES      |                                                          | Error summary                     |
| `triggered_by`        | VARCHAR(50)   | NOT NULL |                                                          | 'SYSTEM' or employee_id           |

#### NOTIFICATION_SCHEDULE

| Attribute           | Data Type    | Nullable | Constraints                                                               | Description                  |
| ------------------- | ------------ | -------- | ------------------------------------------------------------------------- | ---------------------------- |
| `schedule_id`       | VARCHAR(36)  | NOT NULL | PK                                                                        | UUID primary key             |
| `name`              | VARCHAR(100) | NOT NULL |                                                                           | Schedule name                |
| `notification_type` | VARCHAR(30)  | NOT NULL | CHECK IN ('ApprovalReminder', 'SyncAlert', 'ReportReady', 'PlanDeadline') | Type                         |
| `cron_expression`   | VARCHAR(50)  | NOT NULL |                                                                           | Cron schedule                |
| `recipient_type`    | VARCHAR(20)  | NOT NULL | CHECK IN ('User', 'Role', 'Team', 'Department')                           | Who receives                 |
| `recipient_id`      | VARCHAR(36)  | NOT NULL |                                                                           | FK depends on recipient_type |
| `is_active`         | BOOLEAN      | NOT NULL | DEFAULT TRUE                                                              | Enabled flag                 |
| `last_fired`        | TIMESTAMP    | YES      |                                                                           | Last execution               |
| `created_at`        | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                                 |                              |
| `created_by`        | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE                                                             |                              |
| `updated_at`        | TIMESTAMP    | NOT NULL | DEFAULT CURRENT_TIMESTAMP                                                 |                              |
| `updated_by`        | VARCHAR(36)  | NOT NULL | FK → EMPLOYEE                                                             |                              |

---

## 5. Physical Design -- Oracle 19c

### 5.1 Oracle Data Type Mapping

| Logical Type  | Oracle Type                  | Notes                                                        |
| ------------- | ---------------------------- | ------------------------------------------------------------ |
| VARCHAR(n)    | VARCHAR2(n CHAR)             | Always use CHAR semantics for Unicode                        |
| INTEGER       | NUMBER(10)                   | 32-bit integer range                                         |
| DECIMAL(p,s)  | NUMBER(p,s)                  | Fixed precision                                              |
| BOOLEAN       | NUMBER(1)                    | 0 = FALSE, 1 = TRUE (Oracle has no native BOOLEAN in tables) |
| DATE          | DATE                         | Date without time                                            |
| TIMESTAMP     | TIMESTAMP(6)                 | Microsecond precision                                        |
| CLOB          | CLOB                         | Large text/JSON                                              |
| NUMBER (auto) | NUMBER generated by sequence | Use Oracle SEQUENCE for auto-increment                       |

### 5.2 DDL -- Master Data Tables

```sql
-- ============================================================
-- DOMAIN 1: MASTER DATA
-- ============================================================

CREATE TABLE COUNTRY (
    country_id          VARCHAR2(36 CHAR)   NOT NULL,
    country_name        VARCHAR2(100 CHAR)  NOT NULL,
    country_code        VARCHAR2(3 CHAR)    NOT NULL,
    region              VARCHAR2(20 CHAR)   NOT NULL,
    latitude            NUMBER(10,7),
    longitude           NUMBER(10,7),
    is_active           NUMBER(1)           DEFAULT 1 NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_country PRIMARY KEY (country_id),
    CONSTRAINT uq_country_name UNIQUE (country_name),
    CONSTRAINT uq_country_code UNIQUE (country_code),
    CONSTRAINT chk_country_region CHECK (region IN ('APAC', 'Americas', 'EMEA'))
);

CREATE TABLE SITE (
    site_id             VARCHAR2(36 CHAR)   NOT NULL,
    site_name           VARCHAR2(100 CHAR)  NOT NULL,
    site_code           VARCHAR2(20 CHAR)   NOT NULL,
    country_id          VARCHAR2(36 CHAR)   NOT NULL,
    latitude            NUMBER(10,7),
    longitude           NUMBER(10,7),
    timezone            VARCHAR2(50 CHAR)   NOT NULL,
    is_active           NUMBER(1)           DEFAULT 1 NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_site PRIMARY KEY (site_id),
    CONSTRAINT uq_site_code UNIQUE (site_code),
    CONSTRAINT fk_site_country FOREIGN KEY (country_id) REFERENCES COUNTRY(country_id)
);

CREATE TABLE DIVISION (
    division_id         VARCHAR2(36 CHAR)   NOT NULL,
    division_name       VARCHAR2(100 CHAR)  NOT NULL,
    division_code       VARCHAR2(20 CHAR)   NOT NULL,
    is_active           NUMBER(1)           DEFAULT 1 NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_division PRIMARY KEY (division_id),
    CONSTRAINT uq_division_name UNIQUE (division_name),
    CONSTRAINT uq_division_code UNIQUE (division_code)
);

CREATE TABLE BUSINESS_UNIT (
    bu_id               VARCHAR2(36 CHAR)   NOT NULL,
    bu_name             VARCHAR2(100 CHAR)  NOT NULL,
    bu_code             VARCHAR2(20 CHAR)   NOT NULL,
    division_id         VARCHAR2(36 CHAR)   NOT NULL,
    is_active           NUMBER(1)           DEFAULT 1 NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_business_unit PRIMARY KEY (bu_id),
    CONSTRAINT uq_bu_code UNIQUE (bu_code),
    CONSTRAINT fk_bu_division FOREIGN KEY (division_id) REFERENCES DIVISION(division_id)
);

CREATE TABLE DEPARTMENT (
    dept_id             VARCHAR2(36 CHAR)   NOT NULL,
    dept_name           VARCHAR2(100 CHAR)  NOT NULL,
    dept_code           VARCHAR2(20 CHAR)   NOT NULL,
    bu_id               VARCHAR2(36 CHAR)   NOT NULL,
    site_id             VARCHAR2(36 CHAR)   NOT NULL,
    parent_dept_id      VARCHAR2(36 CHAR),
    is_active           NUMBER(1)           DEFAULT 1 NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_department PRIMARY KEY (dept_id),
    CONSTRAINT uq_dept_code UNIQUE (dept_code),
    CONSTRAINT fk_dept_bu FOREIGN KEY (bu_id) REFERENCES BUSINESS_UNIT(bu_id),
    CONSTRAINT fk_dept_site FOREIGN KEY (site_id) REFERENCES SITE(site_id),
    CONSTRAINT fk_dept_parent FOREIGN KEY (parent_dept_id) REFERENCES DEPARTMENT(dept_id)
);

CREATE TABLE TEAM (
    team_id             VARCHAR2(36 CHAR)   NOT NULL,
    team_name           VARCHAR2(100 CHAR)  NOT NULL,
    dept_id             VARCHAR2(36 CHAR)   NOT NULL,
    team_lead_id        VARCHAR2(36 CHAR),
    is_active           NUMBER(1)           DEFAULT 1 NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_team PRIMARY KEY (team_id),
    CONSTRAINT fk_team_dept FOREIGN KEY (dept_id) REFERENCES DEPARTMENT(dept_id)
    -- FK to EMPLOYEE for team_lead_id added via ALTER after EMPLOYEE creation
);

CREATE TABLE EMPLOYEE (
    employee_id         VARCHAR2(36 CHAR)   NOT NULL,
    employee_number     VARCHAR2(20 CHAR)   NOT NULL,
    name                VARCHAR2(100 CHAR)  NOT NULL,
    email               VARCHAR2(200 CHAR)  NOT NULL,
    job_title           VARCHAR2(100 CHAR)  NOT NULL,
    job_grade           VARCHAR2(10 CHAR)   NOT NULL,
    skill_category      VARCHAR2(30 CHAR)   NOT NULL,
    team_id             VARCHAR2(36 CHAR)   NOT NULL,
    site_id             VARCHAR2(36 CHAR)   NOT NULL,
    hire_date           DATE                NOT NULL,
    is_active           NUMBER(1)           DEFAULT 1 NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_employee PRIMARY KEY (employee_id),
    CONSTRAINT uq_employee_number UNIQUE (employee_number),
    CONSTRAINT uq_employee_email UNIQUE (email),
    CONSTRAINT fk_employee_team FOREIGN KEY (team_id) REFERENCES TEAM(team_id),
    CONSTRAINT fk_employee_site FOREIGN KEY (site_id) REFERENCES SITE(site_id),
    CONSTRAINT chk_employee_skill CHECK (skill_category IN
        ('Design', 'Process', 'Test', 'Package', 'Management', 'Other'))
);

-- Deferred FK: TEAM.team_lead_id -> EMPLOYEE
ALTER TABLE TEAM ADD CONSTRAINT fk_team_lead
    FOREIGN KEY (team_lead_id) REFERENCES EMPLOYEE(employee_id);

CREATE TABLE PROJECT_TYPE (
    type_id             VARCHAR2(36 CHAR)   NOT NULL,
    type_name           VARCHAR2(50 CHAR)   NOT NULL,
    category            VARCHAR2(30 CHAR)   NOT NULL,
    is_active           NUMBER(1)           DEFAULT 1 NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_project_type PRIMARY KEY (type_id),
    CONSTRAINT uq_project_type_name UNIQUE (type_name),
    CONSTRAINT chk_project_category CHECK (category IN ('Core', 'Sustaining', 'New'))
);

CREATE TABLE PRODUCT_FAMILY (
    family_id           VARCHAR2(36 CHAR)   NOT NULL,
    family_name         VARCHAR2(100 CHAR)  NOT NULL,
    bu_id               VARCHAR2(36 CHAR)   NOT NULL,
    is_active           NUMBER(1)           DEFAULT 1 NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_product_family PRIMARY KEY (family_id),
    CONSTRAINT uq_product_family_name UNIQUE (family_name),
    CONSTRAINT fk_family_bu FOREIGN KEY (bu_id) REFERENCES BUSINESS_UNIT(bu_id)
);

CREATE TABLE PROJECT (
    project_id          VARCHAR2(36 CHAR)   NOT NULL,
    project_name        VARCHAR2(200 CHAR)  NOT NULL,
    project_code        VARCHAR2(30 CHAR)   NOT NULL,
    project_type_id     VARCHAR2(36 CHAR)   NOT NULL,
    product_family_id   VARCHAR2(36 CHAR)   NOT NULL,
    technology_node     VARCHAR2(20 CHAR),
    priority            NUMBER(1)           NOT NULL,
    start_date          DATE                NOT NULL,
    target_end_date     DATE,
    status              VARCHAR2(20 CHAR)   NOT NULL,
    owner_id            VARCHAR2(36 CHAR)   NOT NULL,
    site_id             VARCHAR2(36 CHAR)   NOT NULL,
    is_deleted          NUMBER(1)           DEFAULT 0 NOT NULL,
    deleted_at          TIMESTAMP(6),
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_project PRIMARY KEY (project_id),
    CONSTRAINT uq_project_code UNIQUE (project_code),
    CONSTRAINT fk_project_type FOREIGN KEY (project_type_id) REFERENCES PROJECT_TYPE(type_id),
    CONSTRAINT fk_project_family FOREIGN KEY (product_family_id) REFERENCES PRODUCT_FAMILY(family_id),
    CONSTRAINT fk_project_owner FOREIGN KEY (owner_id) REFERENCES EMPLOYEE(employee_id),
    CONSTRAINT fk_project_site FOREIGN KEY (site_id) REFERENCES SITE(site_id),
    CONSTRAINT chk_project_priority CHECK (priority BETWEEN 1 AND 5),
    CONSTRAINT chk_project_status CHECK (status IN ('Active', 'OnHold', 'Completed', 'Cancelled'))
);
```

### 5.3 DDL -- Planning Tables

```sql
-- ============================================================
-- DOMAIN 2: PLANNING
-- ============================================================

CREATE TABLE RESOURCE_ROADMAP (
    roadmap_id          VARCHAR2(36 CHAR)   NOT NULL,
    roadmap_name        VARCHAR2(200 CHAR)  NOT NULL,
    site_id             VARCHAR2(36 CHAR)   NOT NULL,
    bu_id               VARCHAR2(36 CHAR)   NOT NULL,
    fiscal_year         NUMBER(4)           NOT NULL,
    status              VARCHAR2(20 CHAR)   NOT NULL,
    is_deleted          NUMBER(1)           DEFAULT 0 NOT NULL,
    deleted_at          TIMESTAMP(6),
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_resource_roadmap PRIMARY KEY (roadmap_id),
    CONSTRAINT fk_roadmap_site FOREIGN KEY (site_id) REFERENCES SITE(site_id),
    CONSTRAINT fk_roadmap_bu FOREIGN KEY (bu_id) REFERENCES BUSINESS_UNIT(bu_id),
    CONSTRAINT chk_roadmap_year CHECK (fiscal_year BETWEEN 2020 AND 2040),
    CONSTRAINT chk_roadmap_status CHECK (status IN ('Draft', 'Active', 'Archived'))
);

CREATE TABLE ROADMAP_VERSION (
    version_id          VARCHAR2(36 CHAR)   NOT NULL,
    roadmap_id          VARCHAR2(36 CHAR)   NOT NULL,
    version_number      VARCHAR2(10 CHAR)   NOT NULL,
    version_type        VARCHAR2(20 CHAR)   NOT NULL,
    parent_version_id   VARCHAR2(36 CHAR),
    change_summary      VARCHAR2(2000 CHAR),
    promis_synced       NUMBER(1)           DEFAULT 0 NOT NULL,
    promis_sync_date    TIMESTAMP(6),
    approved_by         VARCHAR2(36 CHAR),
    approved_date       TIMESTAMP(6),
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_roadmap_version PRIMARY KEY (version_id),
    CONSTRAINT uq_roadmap_ver_num UNIQUE (roadmap_id, version_number),
    CONSTRAINT fk_rmver_roadmap FOREIGN KEY (roadmap_id) REFERENCES RESOURCE_ROADMAP(roadmap_id),
    CONSTRAINT fk_rmver_parent FOREIGN KEY (parent_version_id) REFERENCES ROADMAP_VERSION(version_id),
    CONSTRAINT fk_rmver_approver FOREIGN KEY (approved_by) REFERENCES EMPLOYEE(employee_id),
    CONSTRAINT chk_rmver_type CHECK (version_type IN ('Draft', 'Approved', 'PROMIS_Synced'))
);

CREATE TABLE ROADMAP_PROJECT_ALLOCATION (
    allocation_id       VARCHAR2(36 CHAR)   NOT NULL,
    version_id          VARCHAR2(36 CHAR)   NOT NULL,
    project_id          VARCHAR2(36 CHAR)   NOT NULL,
    employee_id         VARCHAR2(36 CHAR)   NOT NULL,
    period              VARCHAR2(7 CHAR)    NOT NULL,
    allocated_percentage NUMBER(5,2)        NOT NULL,
    allocated_hours     NUMBER(7,2)         NOT NULL,
    role_in_project     VARCHAR2(20 CHAR)   NOT NULL,
    notes               VARCHAR2(1000 CHAR),
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_roadmap_alloc PRIMARY KEY (allocation_id),
    CONSTRAINT uq_roadmap_alloc UNIQUE (version_id, project_id, employee_id, period),
    CONSTRAINT fk_rpa_version FOREIGN KEY (version_id) REFERENCES ROADMAP_VERSION(version_id),
    CONSTRAINT fk_rpa_project FOREIGN KEY (project_id) REFERENCES PROJECT(project_id),
    CONSTRAINT fk_rpa_employee FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(employee_id),
    CONSTRAINT chk_rpa_pct CHECK (allocated_percentage BETWEEN 0 AND 100),
    CONSTRAINT chk_rpa_hours CHECK (allocated_hours >= 0),
    CONSTRAINT chk_rpa_role CHECK (role_in_project IN ('Lead', 'Member', 'Support'))
);

CREATE TABLE RESOURCE_SIMULATION (
    simulation_id               VARCHAR2(36 CHAR)   NOT NULL,
    simulation_name             VARCHAR2(200 CHAR)  NOT NULL,
    source_roadmap_version_id   VARCHAR2(36 CHAR)   NOT NULL,
    status                      VARCHAR2(20 CHAR)   NOT NULL,
    created_at                  TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by                  VARCHAR2(36 CHAR)   NOT NULL,
    updated_at                  TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by                  VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_simulation PRIMARY KEY (simulation_id),
    CONSTRAINT fk_sim_source FOREIGN KEY (source_roadmap_version_id)
        REFERENCES ROADMAP_VERSION(version_id),
    CONSTRAINT chk_sim_status CHECK (status IN ('Draft', 'Running', 'Completed', 'Archived'))
);

CREATE TABLE SIMULATION_VERSION (
    sim_version_id      VARCHAR2(36 CHAR)   NOT NULL,
    simulation_id       VARCHAR2(36 CHAR)   NOT NULL,
    version_number      NUMBER(5)           NOT NULL,
    parameters_json     CLOB,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_sim_version PRIMARY KEY (sim_version_id),
    CONSTRAINT uq_sim_ver_num UNIQUE (simulation_id, version_number),
    CONSTRAINT fk_simver_sim FOREIGN KEY (simulation_id)
        REFERENCES RESOURCE_SIMULATION(simulation_id),
    CONSTRAINT chk_simver_num CHECK (version_number >= 1)
);

-- Enable JSON validation on parameters_json (Oracle 19c)
ALTER TABLE SIMULATION_VERSION ADD CONSTRAINT chk_simver_json
    CHECK (parameters_json IS JSON);

CREATE TABLE SIMULATION_ALLOCATION (
    sim_alloc_id        VARCHAR2(36 CHAR)   NOT NULL,
    sim_version_id      VARCHAR2(36 CHAR)   NOT NULL,
    project_id          VARCHAR2(36 CHAR)   NOT NULL,
    employee_id         VARCHAR2(36 CHAR)   NOT NULL,
    period              VARCHAR2(7 CHAR)    NOT NULL,
    allocated_percentage NUMBER(5,2)        NOT NULL,
    allocated_hours     NUMBER(7,2)         NOT NULL,
    delta_vs_roadmap    NUMBER(7,2),
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_sim_alloc PRIMARY KEY (sim_alloc_id),
    CONSTRAINT uq_sim_alloc UNIQUE (sim_version_id, project_id, employee_id, period),
    CONSTRAINT fk_sa_simver FOREIGN KEY (sim_version_id)
        REFERENCES SIMULATION_VERSION(sim_version_id),
    CONSTRAINT fk_sa_project FOREIGN KEY (project_id) REFERENCES PROJECT(project_id),
    CONSTRAINT fk_sa_employee FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(employee_id),
    CONSTRAINT chk_sa_pct CHECK (allocated_percentage BETWEEN 0 AND 100),
    CONSTRAINT chk_sa_hours CHECK (allocated_hours >= 0)
);

CREATE TABLE PM_PLAN (
    pm_plan_id          VARCHAR2(36 CHAR)   NOT NULL,
    site_id             VARCHAR2(36 CHAR)   NOT NULL,
    dept_id             VARCHAR2(36 CHAR)   NOT NULL,
    fiscal_year         NUMBER(4)           NOT NULL,
    fiscal_month        NUMBER(2)           NOT NULL,
    status              VARCHAR2(20 CHAR)   NOT NULL,
    lock_owner_id       VARCHAR2(36 CHAR),
    lock_timestamp      TIMESTAMP(6),
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_pm_plan PRIMARY KEY (pm_plan_id),
    CONSTRAINT uq_pm_plan UNIQUE (site_id, dept_id, fiscal_year, fiscal_month),
    CONSTRAINT fk_pm_site FOREIGN KEY (site_id) REFERENCES SITE(site_id),
    CONSTRAINT fk_pm_dept FOREIGN KEY (dept_id) REFERENCES DEPARTMENT(dept_id),
    CONSTRAINT fk_pm_lock FOREIGN KEY (lock_owner_id) REFERENCES EMPLOYEE(employee_id),
    CONSTRAINT chk_pm_year CHECK (fiscal_year BETWEEN 2020 AND 2040),
    CONSTRAINT chk_pm_month CHECK (fiscal_month BETWEEN 1 AND 12),
    CONSTRAINT chk_pm_status CHECK (status IN ('Editing', 'Draft', 'PendingApproval', 'Approved'))
);

CREATE TABLE PM_PLAN_VERSION (
    pm_version_id       VARCHAR2(36 CHAR)   NOT NULL,
    pm_plan_id          VARCHAR2(36 CHAR)   NOT NULL,
    version_number      NUMBER(5)           NOT NULL,
    version_type        VARCHAR2(20 CHAR)   NOT NULL,
    approved_by         VARCHAR2(36 CHAR),
    approved_date       TIMESTAMP(6),
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_pm_version PRIMARY KEY (pm_version_id),
    CONSTRAINT uq_pm_ver_num UNIQUE (pm_plan_id, version_number),
    CONSTRAINT fk_pmver_plan FOREIGN KEY (pm_plan_id) REFERENCES PM_PLAN(pm_plan_id),
    CONSTRAINT fk_pmver_approver FOREIGN KEY (approved_by) REFERENCES EMPLOYEE(employee_id),
    CONSTRAINT chk_pmver_num CHECK (version_number >= 1),
    CONSTRAINT chk_pmver_type CHECK (version_type IN ('AutoSave', 'Draft', 'Permanent'))
);

CREATE TABLE PM_ENTRY (
    entry_id            VARCHAR2(36 CHAR)   NOT NULL,
    pm_version_id       VARCHAR2(36 CHAR)   NOT NULL,
    employee_id         VARCHAR2(36 CHAR)   NOT NULL,
    project_id          VARCHAR2(36 CHAR)   NOT NULL,
    period              VARCHAR2(7 CHAR)    NOT NULL,
    planned_days        NUMBER(5,2)         NOT NULL,
    planned_hours       NUMBER(7,2)         NOT NULL,
    actual_days         NUMBER(5,2),
    actual_hours        NUMBER(7,2),
    status              VARCHAR2(20 CHAR)   NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_pm_entry PRIMARY KEY (entry_id),
    CONSTRAINT uq_pm_entry UNIQUE (pm_version_id, employee_id, project_id, period),
    CONSTRAINT fk_pme_version FOREIGN KEY (pm_version_id)
        REFERENCES PM_PLAN_VERSION(pm_version_id),
    CONSTRAINT fk_pme_employee FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(employee_id),
    CONSTRAINT fk_pme_project FOREIGN KEY (project_id) REFERENCES PROJECT(project_id),
    CONSTRAINT chk_pme_pdays CHECK (planned_days >= 0),
    CONSTRAINT chk_pme_phours CHECK (planned_hours >= 0),
    CONSTRAINT chk_pme_adays CHECK (actual_days IS NULL OR actual_days >= 0),
    CONSTRAINT chk_pme_ahours CHECK (actual_hours IS NULL OR actual_hours >= 0),
    CONSTRAINT chk_pme_status CHECK (status IN ('Planned', 'InProgress', 'Completed'))
);
```

### 5.4 DDL -- HeadCount Tables

```sql
-- ============================================================
-- DOMAIN 3: HEADCOUNT
-- ============================================================

CREATE TABLE HEADCOUNT_PLAN (
    hc_plan_id          VARCHAR2(36 CHAR)   NOT NULL,
    site_id             VARCHAR2(36 CHAR)   NOT NULL,
    dept_id             VARCHAR2(36 CHAR)   NOT NULL,
    fiscal_year         NUMBER(4)           NOT NULL,
    status              VARCHAR2(20 CHAR)   NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_hc_plan PRIMARY KEY (hc_plan_id),
    CONSTRAINT uq_hc_plan UNIQUE (site_id, dept_id, fiscal_year),
    CONSTRAINT fk_hcp_site FOREIGN KEY (site_id) REFERENCES SITE(site_id),
    CONSTRAINT fk_hcp_dept FOREIGN KEY (dept_id) REFERENCES DEPARTMENT(dept_id),
    CONSTRAINT chk_hcp_year CHECK (fiscal_year BETWEEN 2020 AND 2040),
    CONSTRAINT chk_hcp_status CHECK (status IN ('Draft', 'PendingApproval', 'Approved', 'Archived'))
);

CREATE TABLE HEADCOUNT_ENTRY (
    hc_entry_id         VARCHAR2(36 CHAR)   NOT NULL,
    hc_plan_id          VARCHAR2(36 CHAR)   NOT NULL,
    job_grade           VARCHAR2(10 CHAR)   NOT NULL,
    skill_category      VARCHAR2(30 CHAR)   NOT NULL,
    period              VARCHAR2(7 CHAR)    NOT NULL,
    current_count       NUMBER(6)           NOT NULL,
    planned_count       NUMBER(6)           NOT NULL,
    target_count        NUMBER(6)           NOT NULL,
    gap                 NUMBER(6)           NOT NULL,
    action              VARCHAR2(20 CHAR)   NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_hc_entry PRIMARY KEY (hc_entry_id),
    CONSTRAINT fk_hce_plan FOREIGN KEY (hc_plan_id)
        REFERENCES HEADCOUNT_PLAN(hc_plan_id),
    CONSTRAINT chk_hce_current CHECK (current_count >= 0),
    CONSTRAINT chk_hce_planned CHECK (planned_count >= 0),
    CONSTRAINT chk_hce_target CHECK (target_count >= 0),
    CONSTRAINT chk_hce_skill CHECK (skill_category IN
        ('Design', 'Process', 'Test', 'Package', 'Management', 'Other')),
    CONSTRAINT chk_hce_action CHECK (action IN
        ('Hire', 'Transfer', 'Retain', 'Reduce', 'None'))
);
```

### 5.5 DDL -- Workflow & Control Tables

```sql
-- ============================================================
-- DOMAIN 4: WORKFLOW & CONTROL
-- ============================================================

CREATE TABLE APPROVAL_REQUEST (
    request_id          VARCHAR2(36 CHAR)   NOT NULL,
    entity_type         VARCHAR2(30 CHAR)   NOT NULL,
    entity_id           VARCHAR2(36 CHAR)   NOT NULL,
    version_id          VARCHAR2(36 CHAR)   NOT NULL,
    requester_id        VARCHAR2(36 CHAR)   NOT NULL,
    approver_id         VARCHAR2(36 CHAR)   NOT NULL,
    status              VARCHAR2(20 CHAR)   NOT NULL,
    requested_date      TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    resolved_date       TIMESTAMP(6),
    comments            VARCHAR2(2000 CHAR),
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_approval_request PRIMARY KEY (request_id),
    CONSTRAINT fk_ar_requester FOREIGN KEY (requester_id) REFERENCES EMPLOYEE(employee_id),
    CONSTRAINT fk_ar_approver FOREIGN KEY (approver_id) REFERENCES EMPLOYEE(employee_id),
    CONSTRAINT chk_ar_type CHECK (entity_type IN
        ('PMPlan', 'Roadmap', 'Simulation', 'HeadCount')),
    CONSTRAINT chk_ar_status CHECK (status IN
        ('Pending', 'Approved', 'Rejected', 'Cancelled'))
);

CREATE TABLE APPROVAL_HISTORY (
    history_id          VARCHAR2(36 CHAR)   NOT NULL,
    request_id          VARCHAR2(36 CHAR)   NOT NULL,
    action              VARCHAR2(20 CHAR)   NOT NULL,
    actor_id            VARCHAR2(36 CHAR)   NOT NULL,
    action_date         TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    comments            VARCHAR2(2000 CHAR),
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_approval_history PRIMARY KEY (history_id),
    CONSTRAINT fk_ah_request FOREIGN KEY (request_id)
        REFERENCES APPROVAL_REQUEST(request_id),
    CONSTRAINT fk_ah_actor FOREIGN KEY (actor_id) REFERENCES EMPLOYEE(employee_id),
    CONSTRAINT chk_ah_action CHECK (action IN
        ('Submitted', 'Approved', 'Rejected', 'Escalated', 'Cancelled'))
);

CREATE TABLE FACTOR_CONTROL_SET (
    fcs_id              VARCHAR2(36 CHAR)   NOT NULL,
    name                VARCHAR2(100 CHAR)  NOT NULL,
    user_id             VARCHAR2(36 CHAR)   NOT NULL,
    is_default          NUMBER(1)           DEFAULT 0 NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_factor_control_set PRIMARY KEY (fcs_id),
    CONSTRAINT fk_fcs_user FOREIGN KEY (user_id) REFERENCES EMPLOYEE(employee_id)
);

CREATE TABLE FACTOR_CONTROL_ITEM (
    fci_id              VARCHAR2(36 CHAR)   NOT NULL,
    fcs_id              VARCHAR2(36 CHAR)   NOT NULL,
    dimension           VARCHAR2(30 CHAR)   NOT NULL,
    operator            VARCHAR2(20 CHAR)   NOT NULL,
    value_json          CLOB                NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_factor_control_item PRIMARY KEY (fci_id),
    CONSTRAINT fk_fci_set FOREIGN KEY (fcs_id)
        REFERENCES FACTOR_CONTROL_SET(fcs_id) ON DELETE CASCADE,
    CONSTRAINT chk_fci_dim CHECK (dimension IN
        ('site', 'department', 'project_type', 'period', 'bu',
         'division', 'skill_category', 'job_grade', 'product_family')),
    CONSTRAINT chk_fci_op CHECK (operator IN
        ('eq', 'in', 'between', 'not_in', 'gte', 'lte')),
    CONSTRAINT chk_fci_json CHECK (value_json IS JSON)
);

-- SyncQueue: uses Oracle SEQUENCE for auto-increment
CREATE SEQUENCE seq_sync_queue START WITH 1 INCREMENT BY 1 NOCACHE;

CREATE TABLE SYNC_QUEUE (
    queue_id            NUMBER              NOT NULL,
    entity_type         VARCHAR2(30 CHAR)   NOT NULL,
    entity_id           VARCHAR2(36 CHAR)   NOT NULL,
    action              VARCHAR2(10 CHAR)   NOT NULL,
    status              VARCHAR2(15 CHAR)   DEFAULT 'PENDING' NOT NULL,
    target_index        VARCHAR2(50 CHAR)   NOT NULL,
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    processed_at        TIMESTAMP(6),
    retry_count         NUMBER(1)           DEFAULT 0 NOT NULL,
    error_message       VARCHAR2(4000 CHAR),
    batch_id            VARCHAR2(36 CHAR),
    CONSTRAINT pk_sync_queue PRIMARY KEY (queue_id),
    CONSTRAINT chk_sq_entity CHECK (entity_type IN
        ('PMPlanVersion', 'RoadmapVersion', 'SimulationVersion',
         'HeadCountEntry', 'MasterData')),
    CONSTRAINT chk_sq_action CHECK (action IN ('UPSERT', 'DELETE')),
    CONSTRAINT chk_sq_status CHECK (status IN
        ('PENDING', 'PROCESSING', 'COMPLETED', 'RETRY', 'FAILED')),
    CONSTRAINT chk_sq_retry CHECK (retry_count BETWEEN 0 AND 3)
)
PARTITION BY RANGE (created_at) INTERVAL (NUMTOYMINTERVAL(1, 'MONTH'))
(
    PARTITION p_initial VALUES LESS THAN (TIMESTAMP '2026-04-01 00:00:00')
);

CREATE TABLE SYNC_RECORD (
    sync_id             VARCHAR2(36 CHAR)   NOT NULL,
    target_system       VARCHAR2(20 CHAR)   NOT NULL,
    entity_type         VARCHAR2(30 CHAR)   NOT NULL,
    entity_id           VARCHAR2(36 CHAR)   NOT NULL,
    version_id          VARCHAR2(36 CHAR),
    sync_status         VARCHAR2(15 CHAR)   NOT NULL,
    sync_date           TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    changed_projects_json CLOB,
    error_message       VARCHAR2(4000 CHAR),
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_sync_record PRIMARY KEY (sync_id),
    CONSTRAINT chk_sr_system CHECK (target_system IN ('PROMIS', 'N-PLM')),
    CONSTRAINT chk_sr_status CHECK (sync_status IN ('Pending', 'Success', 'Failed'))
);

CREATE TABLE SYNC_AUDIT_LOG (
    audit_id            VARCHAR2(36 CHAR)   NOT NULL,
    sync_type           VARCHAR2(20 CHAR)   NOT NULL,
    target_index        VARCHAR2(50 CHAR)   NOT NULL,
    started_at          TIMESTAMP(6)        NOT NULL,
    completed_at        TIMESTAMP(6),
    duration_ms         NUMBER,
    documents_processed NUMBER(10)          DEFAULT 0 NOT NULL,
    documents_failed    NUMBER(10)          DEFAULT 0 NOT NULL,
    oracle_count        NUMBER(10),
    es_count            NUMBER(10),
    count_match         NUMBER(1),
    status              VARCHAR2(20 CHAR)   NOT NULL,
    error_details       VARCHAR2(4000 CHAR),
    triggered_by        VARCHAR2(50 CHAR)   NOT NULL,
    CONSTRAINT pk_sync_audit_log PRIMARY KEY (audit_id),
    CONSTRAINT chk_sal_type CHECK (sync_type IN
        ('EVENT_DRIVEN', 'SCHEDULED_FULL', 'ON_DEMAND')),
    CONSTRAINT chk_sal_status CHECK (status IN
        ('SUCCESS', 'PARTIAL_FAILURE', 'FAILED'))
);

CREATE TABLE NOTIFICATION_SCHEDULE (
    schedule_id         VARCHAR2(36 CHAR)   NOT NULL,
    name                VARCHAR2(100 CHAR)  NOT NULL,
    notification_type   VARCHAR2(30 CHAR)   NOT NULL,
    cron_expression     VARCHAR2(50 CHAR)   NOT NULL,
    recipient_type      VARCHAR2(20 CHAR)   NOT NULL,
    recipient_id        VARCHAR2(36 CHAR)   NOT NULL,
    is_active           NUMBER(1)           DEFAULT 1 NOT NULL,
    last_fired          TIMESTAMP(6),
    created_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    created_by          VARCHAR2(36 CHAR)   NOT NULL,
    updated_at          TIMESTAMP(6)        DEFAULT SYSTIMESTAMP NOT NULL,
    updated_by          VARCHAR2(36 CHAR)   NOT NULL,
    CONSTRAINT pk_notification_schedule PRIMARY KEY (schedule_id),
    CONSTRAINT chk_ns_type CHECK (notification_type IN
        ('ApprovalReminder', 'SyncAlert', 'ReportReady', 'PlanDeadline')),
    CONSTRAINT chk_ns_recip CHECK (recipient_type IN
        ('User', 'Role', 'Team', 'Department'))
);
```

### 5.6 Indexes

```sql
-- ============================================================
-- INDEXES
-- ============================================================

-- Foreign key indexes for the 12-table denormalization join
CREATE INDEX idx_site_country_id         ON SITE(country_id);
CREATE INDEX idx_bu_division_id          ON BUSINESS_UNIT(division_id);
CREATE INDEX idx_dept_bu_id              ON DEPARTMENT(bu_id);
CREATE INDEX idx_dept_site_id            ON DEPARTMENT(site_id);
CREATE INDEX idx_dept_parent_id          ON DEPARTMENT(parent_dept_id);
CREATE INDEX idx_team_dept_id            ON TEAM(dept_id);
CREATE INDEX idx_team_lead_id            ON TEAM(team_lead_id);
CREATE INDEX idx_employee_team_id        ON EMPLOYEE(team_id);
CREATE INDEX idx_employee_site_id        ON EMPLOYEE(site_id);
CREATE INDEX idx_project_type_id         ON PROJECT(project_type_id);
CREATE INDEX idx_project_family_id       ON PROJECT(product_family_id);
CREATE INDEX idx_project_owner_id        ON PROJECT(owner_id);
CREATE INDEX idx_project_site_id         ON PROJECT(site_id);
CREATE INDEX idx_family_bu_id            ON PRODUCT_FAMILY(bu_id);

-- Planning table indexes
CREATE INDEX idx_roadmap_site_id         ON RESOURCE_ROADMAP(site_id);
CREATE INDEX idx_roadmap_bu_id           ON RESOURCE_ROADMAP(bu_id);
CREATE INDEX idx_rmver_roadmap_id        ON ROADMAP_VERSION(roadmap_id);
CREATE INDEX idx_rmver_parent_id         ON ROADMAP_VERSION(parent_version_id);
CREATE INDEX idx_rmver_type_roadmap      ON ROADMAP_VERSION(version_type, roadmap_id);
CREATE INDEX idx_rpa_version_id          ON ROADMAP_PROJECT_ALLOCATION(version_id);
CREATE INDEX idx_rpa_employee_id         ON ROADMAP_PROJECT_ALLOCATION(employee_id);
CREATE INDEX idx_rpa_project_id          ON ROADMAP_PROJECT_ALLOCATION(project_id);
CREATE INDEX idx_rpa_period              ON ROADMAP_PROJECT_ALLOCATION(period);
CREATE INDEX idx_sim_source_ver          ON RESOURCE_SIMULATION(source_roadmap_version_id);
CREATE INDEX idx_simver_sim_id           ON SIMULATION_VERSION(simulation_id);
CREATE INDEX idx_sa_simver_id            ON SIMULATION_ALLOCATION(sim_version_id);
CREATE INDEX idx_sa_employee_id          ON SIMULATION_ALLOCATION(employee_id);
CREATE INDEX idx_sa_project_id           ON SIMULATION_ALLOCATION(project_id);

-- PM Plan indexes
CREATE INDEX idx_pm_site_id              ON PM_PLAN(site_id);
CREATE INDEX idx_pm_dept_id              ON PM_PLAN(dept_id);
CREATE INDEX idx_pmver_plan_id           ON PM_PLAN_VERSION(pm_plan_id);
CREATE INDEX idx_pmver_type_plan         ON PM_PLAN_VERSION(version_type, pm_plan_id);
CREATE INDEX idx_pme_version_id          ON PM_ENTRY(pm_version_id);
CREATE INDEX idx_pme_employee_id         ON PM_ENTRY(employee_id);
CREATE INDEX idx_pme_project_id          ON PM_ENTRY(project_id);
CREATE INDEX idx_pme_period              ON PM_ENTRY(period);

-- HeadCount indexes
CREATE INDEX idx_hcp_site_id             ON HEADCOUNT_PLAN(site_id);
CREATE INDEX idx_hcp_dept_id             ON HEADCOUNT_PLAN(dept_id);
CREATE INDEX idx_hce_plan_id             ON HEADCOUNT_ENTRY(hc_plan_id);

-- Workflow indexes
CREATE INDEX idx_ar_requester            ON APPROVAL_REQUEST(requester_id);
CREATE INDEX idx_ar_approver             ON APPROVAL_REQUEST(approver_id);
CREATE INDEX idx_ar_entity               ON APPROVAL_REQUEST(entity_type, entity_id);
CREATE INDEX idx_ar_status               ON APPROVAL_REQUEST(status);
CREATE INDEX idx_ah_request              ON APPROVAL_HISTORY(request_id);
CREATE INDEX idx_fcs_user                ON FACTOR_CONTROL_SET(user_id);
CREATE INDEX idx_fci_set                 ON FACTOR_CONTROL_ITEM(fcs_id);

-- SyncQueue performance indexes (critical for sync worker)
CREATE INDEX idx_sq_status_created       ON SYNC_QUEUE(status, created_at) LOCAL;
CREATE INDEX idx_sq_entity               ON SYNC_QUEUE(entity_type, entity_id) LOCAL;

-- SyncRecord indexes
CREATE INDEX idx_sr_system_entity        ON SYNC_RECORD(target_system, entity_type, entity_id);
CREATE INDEX idx_sr_status               ON SYNC_RECORD(sync_status);

-- SyncAuditLog indexes
CREATE INDEX idx_sal_type_started        ON SYNC_AUDIT_LOG(sync_type, started_at);
CREATE INDEX idx_sal_index               ON SYNC_AUDIT_LOG(target_index);
```

### 5.7 Optional Materialized View for Full Sync

This pre-joined view accelerates the nightly full sync by avoiding the 12-table join at sync time.

```sql
CREATE MATERIALIZED VIEW MV_RESOURCE_ALLOCATION_FLAT
BUILD DEFERRED
REFRESH ON DEMAND
AS
SELECT
    rpa.allocation_id,
    'Roadmap'               AS source_type,
    rv.version_id           AS source_version_id,
    -- Employee dimension
    e.employee_id,
    e.name                  AS employee_name,
    e.job_title,
    e.job_grade,
    e.skill_category,
    t.team_name,
    d.dept_name             AS department,
    bu.bu_name              AS business_unit,
    div.division_name       AS division,
    -- Project dimension
    p.project_id,
    p.project_name,
    p.project_code,
    pt.type_name            AS project_type,
    pf.family_name          AS product_family,
    p.technology_node,
    p.priority,
    p.status                AS project_status,
    -- Site dimension
    s.site_id,
    s.site_name,
    c.country_name,
    c.region,
    s.latitude,
    s.longitude,
    -- Time dimension (derived)
    rpa.period,
    EXTRACT(YEAR FROM TO_DATE(rpa.period, 'YYYY-MM'))   AS time_year,
    'Q' || TO_CHAR(TO_DATE(rpa.period, 'YYYY-MM'), 'Q')
        || '-' || EXTRACT(YEAR FROM TO_DATE(rpa.period, 'YYYY-MM'))
                                                         AS time_quarter,
    -- Measures
    rpa.allocated_percentage,
    rpa.allocated_hours,
    rpa.role_in_project,
    -- Version
    rv.version_id,
    rv.version_number,
    rv.version_type
FROM ROADMAP_PROJECT_ALLOCATION rpa
    JOIN ROADMAP_VERSION rv     ON rpa.version_id       = rv.version_id
    JOIN EMPLOYEE e             ON rpa.employee_id      = e.employee_id
    JOIN TEAM t                 ON e.team_id            = t.team_id
    JOIN DEPARTMENT d           ON t.dept_id            = d.dept_id
    JOIN BUSINESS_UNIT bu       ON d.bu_id              = bu.bu_id
    JOIN DIVISION div           ON bu.division_id       = div.division_id
    JOIN PROJECT p              ON rpa.project_id       = p.project_id
    JOIN PROJECT_TYPE pt        ON p.project_type_id    = pt.type_id
    JOIN PRODUCT_FAMILY pf      ON p.product_family_id  = pf.family_id
    JOIN SITE s                 ON e.site_id            = s.site_id
    JOIN COUNTRY c              ON s.country_id         = c.country_id;

-- Refresh before nightly full sync:
-- EXEC DBMS_MVIEW.REFRESH('MV_RESOURCE_ALLOCATION_FLAT', 'C');
```

### 5.8 SyncQueue Partitioning Strategy

The `SYNC_QUEUE` table uses **Oracle interval range partitioning** by `created_at` month:

| Aspect               | Strategy                                                                              |
| -------------------- | ------------------------------------------------------------------------------------- |
| **Partition scheme** | RANGE on `created_at`, monthly intervals                                              |
| **Retention**        | COMPLETED records purged after 7 days by nightly sync; old partitions dropped monthly |
| **Benefit**          | DROP PARTITION is instantaneous vs. DELETE of millions of rows (no undo generation)   |
| **Index type**       | LOCAL indexes on partitioned columns for partition pruning                            |

```sql
-- Monthly maintenance: drop partitions older than 90 days
-- Run as scheduled DBA job
ALTER TABLE SYNC_QUEUE DROP PARTITION p_202601;
```

### 5.9 Connection Pool Sizing

| Parameter                   | Recommended Value  | Rationale                                                                   |
| --------------------------- | ------------------ | --------------------------------------------------------------------------- |
| **Mendix connection pool**  | 50-100 connections | Normal user load (~30) + sync workers (~5) + scheduled events (~5) + buffer |
| **Sync worker concurrency** | 3-5 threads        | Parallel processing of SyncQueue batches                                    |
| **JDBC fetch size**         | 1000 rows          | Reduce round trips for denormalization queries                              |
| **Statement cache**         | 50 statements      | Cache prepared statements for repeated sync queries                         |

---

## 6. Elasticsearch Index Specifications

### 6.1 Index: `iris-resource-allocation`

**Purpose**: Primary analytical index for all multi-dimensional analysis of resource allocation. Supports world map, pivot tables, Gantt charts, and drill-down dashboards.

**Source entities**: RoadmapProjectAllocation + PMEntry (both normalized to same flat structure)

```json
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1,
    "refresh_interval": "1s",
    "index.mapping.total_fields.limit": 200,
    "analysis": {
      "normalizer": {
        "lowercase_normalizer": {
          "type": "custom",
          "filter": ["lowercase"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "allocation_id": { "type": "keyword" },
      "source_type": { "type": "keyword" },
      "source_version_id": { "type": "keyword" },
      "timestamp": { "type": "date", "format": "strict_date_optional_time||epoch_millis" },

      "employee": {
        "properties": {
          "id": { "type": "keyword" },
          "name": { "type": "text", "fields": { "keyword": { "type": "keyword" } } },
          "employee_number": { "type": "keyword" },
          "job_title": { "type": "keyword" },
          "job_grade": { "type": "keyword" },
          "skill_category": { "type": "keyword" },
          "team": { "type": "keyword" },
          "department": { "type": "keyword" },
          "business_unit": { "type": "keyword" },
          "division": { "type": "keyword" }
        }
      },

      "project": {
        "properties": {
          "id": { "type": "keyword" },
          "name": { "type": "keyword" },
          "code": { "type": "keyword" },
          "type": { "type": "keyword" },
          "type_category": { "type": "keyword" },
          "product_family": { "type": "keyword" },
          "technology_node": { "type": "keyword" },
          "priority": { "type": "byte" },
          "status": { "type": "keyword" }
        }
      },

      "site": {
        "properties": {
          "id": { "type": "keyword" },
          "name": { "type": "keyword" },
          "code": { "type": "keyword" },
          "country": { "type": "keyword" },
          "region": { "type": "keyword" },
          "geo_point": { "type": "geo_point" },
          "timezone": { "type": "keyword" }
        }
      },

      "time": {
        "properties": {
          "period": { "type": "keyword" },
          "year": { "type": "short" },
          "quarter": { "type": "keyword" },
          "month": { "type": "keyword" }
        }
      },

      "allocation": {
        "properties": {
          "percentage": { "type": "float" },
          "hours": { "type": "float" },
          "planned_days": { "type": "float" },
          "actual_days": { "type": "float" },
          "actual_hours": { "type": "float" },
          "role": { "type": "keyword" }
        }
      },

      "version": {
        "properties": {
          "id": { "type": "keyword" },
          "number": { "type": "keyword" },
          "type": { "type": "keyword" },
          "status": { "type": "keyword" }
        }
      }
    }
  }
}
```

**Estimated volume**: ~500K documents at Year 1, ~2M at Year 3.

**Shard strategy**: 3 primary shards (target ~10-30GB each). With 500K docs averaging ~1KB each, initial size is ~500MB per shard. Scales comfortably to 2M+ docs.

### 6.2 Index: `iris-headcount`

**Purpose**: Headcount analytics — gap analysis, hiring pipeline, workforce planning dashboards.

```json
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1,
    "refresh_interval": "1s"
  },
  "mappings": {
    "properties": {
      "hc_entry_id": { "type": "keyword" },
      "hc_plan_id": { "type": "keyword" },
      "timestamp": { "type": "date" },

      "site": { "type": "keyword" },
      "site_id": { "type": "keyword" },
      "country": { "type": "keyword" },
      "region": { "type": "keyword" },
      "department": { "type": "keyword" },
      "dept_id": { "type": "keyword" },
      "business_unit": { "type": "keyword" },
      "division": { "type": "keyword" },
      "job_grade": { "type": "keyword" },
      "skill_category": { "type": "keyword" },

      "period": { "type": "keyword" },
      "year": { "type": "short" },
      "quarter": { "type": "keyword" },

      "current_count": { "type": "integer" },
      "planned_count": { "type": "integer" },
      "target_count": { "type": "integer" },
      "gap": { "type": "integer" },
      "action": { "type": "keyword" },

      "plan_status": { "type": "keyword" },
      "fiscal_year": { "type": "short" }
    }
  }
}
```

**Estimated volume**: ~10K documents at Year 1.

**Shard strategy**: 1 primary shard sufficient for this volume.

### 6.3 Index: `iris-simulation-result`

**Purpose**: Simulation comparison data — what-if analysis, delta views, scenario comparison dashboards.

```json
{
  "settings": {
    "number_of_shards": 2,
    "number_of_replicas": 1,
    "refresh_interval": "1s"
  },
  "mappings": {
    "properties": {
      "sim_alloc_id": { "type": "keyword" },
      "simulation_id": { "type": "keyword" },
      "simulation_name": { "type": "keyword" },
      "sim_version_id": { "type": "keyword" },
      "sim_version_number": { "type": "integer" },
      "source_roadmap": { "type": "keyword" },
      "timestamp": { "type": "date" },

      "employee_id": { "type": "keyword" },
      "employee_name": { "type": "keyword" },
      "employee_grade": { "type": "keyword" },
      "employee_skill": { "type": "keyword" },
      "project_id": { "type": "keyword" },
      "project_name": { "type": "keyword" },
      "project_code": { "type": "keyword" },
      "product_family": { "type": "keyword" },
      "project_type": { "type": "keyword" },
      "technology_node": { "type": "keyword" },
      "site": { "type": "keyword" },
      "department": { "type": "keyword" },
      "business_unit": { "type": "keyword" },
      "division": { "type": "keyword" },
      "period": { "type": "keyword" },
      "year": { "type": "short" },
      "quarter": { "type": "keyword" },

      "allocated_percentage": { "type": "float" },
      "allocated_hours": { "type": "float" },
      "delta_vs_roadmap": { "type": "float" },
      "delta_percentage": { "type": "float" },

      "parameters_json": { "type": "object", "enabled": false }
    }
  }
}
```

**Estimated volume**: ~200K documents at Year 1 (simulations are ephemeral but retained for comparison).

**Shard strategy**: 2 primary shards.

### 6.4 Index: `iris-analysis-report`

**Purpose**: Pre-aggregated report data for periodic analysis reporting and scheduled report delivery.

```json
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1,
    "refresh_interval": "30s"
  },
  "mappings": {
    "properties": {
      "report_id": { "type": "keyword" },
      "report_name": { "type": "keyword" },
      "report_type": { "type": "keyword" },
      "generated_date": { "type": "date" },
      "schedule_id": { "type": "keyword" },
      "generated_by": { "type": "keyword" },

      "dimensions": { "type": "object", "dynamic": true },
      "measures": { "type": "object", "dynamic": true },
      "filters_applied": { "type": "object", "dynamic": true },

      "site": { "type": "keyword" },
      "department": { "type": "keyword" },
      "business_unit": { "type": "keyword" },
      "period": { "type": "keyword" },
      "fiscal_year": { "type": "short" }
    }
  }
}
```

**Estimated volume**: ~5K documents at Year 1.

**Shard strategy**: 1 primary shard.

### 6.5 Index Lifecycle Management (ILM)

| Phase      | Timing      | Index Settings                                    | Storage              |
| ---------- | ----------- | ------------------------------------------------- | -------------------- |
| **Hot**    | 0-90 days   | 1s refresh, replicas=1, primary allocation on SSD | Fast SSD nodes       |
| **Warm**   | 91-365 days | 30s refresh, replicas=1, force merge to 1 segment | Warm data nodes      |
| **Cold**   | 366+ days   | read-only, replicas=0, frozen index               | Cold/archive storage |
| **Delete** | 730+ days   | Auto-delete                                       | N/A                  |

```json
PUT _ilm/policy/iris-ilm-policy
{
  "policy": {
    "phases": {
      "hot": {
        "min_age": "0ms",
        "actions": {
          "rollover": {
            "max_size": "30gb",
            "max_age": "90d"
          },
          "set_priority": { "priority": 100 }
        }
      },
      "warm": {
        "min_age": "90d",
        "actions": {
          "forcemerge": { "max_num_segments": 1 },
          "shrink": { "number_of_shards": 1 },
          "set_priority": { "priority": 50 }
        }
      },
      "cold": {
        "min_age": "365d",
        "actions": {
          "freeze": {},
          "allocate": { "number_of_replicas": 0 },
          "set_priority": { "priority": 0 }
        }
      },
      "delete": {
        "min_age": "730d",
        "actions": { "delete": {} }
      }
    }
  }
}
```

### 6.6 Shard Strategy Summary

| Index                      | Primary Shards | Replicas | Estimated Year 1 Size | Rationale                                        |
| -------------------------- | -------------- | -------- | --------------------- | ------------------------------------------------ |
| `iris-resource-allocation` | 3              | 1        | ~500MB                | Main analytical workload, heaviest aggregation   |
| `iris-headcount`           | 1              | 1        | ~10MB                 | Small dataset, infrequent updates                |
| `iris-simulation-result`   | 2              | 1        | ~200MB                | Moderate volume, burst writes during simulations |
| `iris-analysis-report`     | 1              | 1        | ~5MB                  | Pre-aggregated, small and slow-growing           |

---

## 7. Denormalization Transform

### 7.1 Roadmap Allocation — 12-Table Join (Oracle SQL)

This is the core denormalization query that transforms normalized Oracle data into flat Elasticsearch documents for the `iris-resource-allocation` index.

```sql
-- ============================================================
-- DENORMALIZATION QUERY: Roadmap Allocations → ES Documents
-- Joins 12 tables: RPA, RV, E, T, D, BU, DIV, P, PT, PF, S, C
-- ============================================================
SELECT
    -- Document identity
    rpa.allocation_id,
    'Roadmap'                   AS source_type,
    rv.version_id               AS source_version_id,
    SYSTIMESTAMP                 AS sync_timestamp,

    -- Employee dimension (5 joins: Employee → Team → Department → BusinessUnit → Division)
    e.employee_id               AS "employee.id",
    e.name                      AS "employee.name",
    e.employee_number           AS "employee.employee_number",
    e.job_title                 AS "employee.job_title",
    e.job_grade                 AS "employee.job_grade",
    e.skill_category            AS "employee.skill_category",
    t.team_name                 AS "employee.team",
    d.dept_name                 AS "employee.department",
    bu.bu_name                  AS "employee.business_unit",
    div.division_name           AS "employee.division",

    -- Project dimension (2 joins: Project → ProjectType, Project → ProductFamily)
    p.project_id                AS "project.id",
    p.project_name              AS "project.name",
    p.project_code              AS "project.code",
    pt.type_name                AS "project.type",
    pt.category                 AS "project.type_category",
    pf.family_name              AS "project.product_family",
    p.technology_node           AS "project.technology_node",
    p.priority                  AS "project.priority",
    p.status                    AS "project.status",

    -- Site dimension (1 join: Site → Country)
    s.site_id                   AS "site.id",
    s.site_name                 AS "site.name",
    s.site_code                 AS "site.code",
    c.country_name              AS "site.country",
    c.region                    AS "site.region",
    s.latitude                  AS "site.latitude",
    s.longitude                 AS "site.longitude",
    s.timezone                  AS "site.timezone",

    -- Time dimension (derived from period string)
    rpa.period                  AS "time.period",
    EXTRACT(YEAR FROM TO_DATE(rpa.period, 'YYYY-MM'))
                                AS "time.year",
    'Q' || TO_CHAR(TO_DATE(rpa.period, 'YYYY-MM'), 'Q')
        || '-' || EXTRACT(YEAR FROM TO_DATE(rpa.period, 'YYYY-MM'))
                                AS "time.quarter",
    rpa.period                  AS "time.month",

    -- Allocation measures
    rpa.allocated_percentage    AS "allocation.percentage",
    rpa.allocated_hours         AS "allocation.hours",
    NULL                        AS "allocation.planned_days",
    NULL                        AS "allocation.actual_days",
    NULL                        AS "allocation.actual_hours",
    rpa.role_in_project         AS "allocation.role",

    -- Version metadata
    rv.version_id               AS "version.id",
    rv.version_number           AS "version.number",
    rv.version_type             AS "version.type",
    rv.version_type             AS "version.status"

FROM ROADMAP_PROJECT_ALLOCATION rpa
    INNER JOIN ROADMAP_VERSION rv   ON rpa.version_id       = rv.version_id
    INNER JOIN EMPLOYEE e           ON rpa.employee_id      = e.employee_id
    INNER JOIN TEAM t               ON e.team_id            = t.team_id
    INNER JOIN DEPARTMENT d         ON t.dept_id            = d.dept_id
    INNER JOIN BUSINESS_UNIT bu     ON d.bu_id              = bu.bu_id
    INNER JOIN DIVISION div         ON bu.division_id       = div.division_id
    INNER JOIN PROJECT p            ON rpa.project_id       = p.project_id
    INNER JOIN PROJECT_TYPE pt      ON p.project_type_id    = pt.type_id
    INNER JOIN PRODUCT_FAMILY pf    ON p.product_family_id  = pf.family_id
    INNER JOIN SITE s               ON e.site_id            = s.site_id
    INNER JOIN COUNTRY c            ON s.country_id         = c.country_id
WHERE rv.version_id = :versionId;
```

### 7.2 PM Entry Denormalization Query

```sql
-- ============================================================
-- DENORMALIZATION QUERY: PM Entries → ES Documents
-- Same target index: iris-resource-allocation
-- ============================================================
SELECT
    pme.entry_id                AS allocation_id,
    'PMPlan'                    AS source_type,
    pmv.pm_version_id           AS source_version_id,
    SYSTIMESTAMP                 AS sync_timestamp,

    -- Employee dimension
    e.employee_id               AS "employee.id",
    e.name                      AS "employee.name",
    e.employee_number           AS "employee.employee_number",
    e.job_title                 AS "employee.job_title",
    e.job_grade                 AS "employee.job_grade",
    e.skill_category            AS "employee.skill_category",
    t.team_name                 AS "employee.team",
    d.dept_name                 AS "employee.department",
    bu.bu_name                  AS "employee.business_unit",
    div.division_name           AS "employee.division",

    -- Project dimension
    p.project_id                AS "project.id",
    p.project_name              AS "project.name",
    p.project_code              AS "project.code",
    pt.type_name                AS "project.type",
    pt.category                 AS "project.type_category",
    pf.family_name              AS "project.product_family",
    p.technology_node           AS "project.technology_node",
    p.priority                  AS "project.priority",
    p.status                    AS "project.status",

    -- Site dimension
    s.site_id                   AS "site.id",
    s.site_name                 AS "site.name",
    s.site_code                 AS "site.code",
    c.country_name              AS "site.country",
    c.region                    AS "site.region",
    s.latitude                  AS "site.latitude",
    s.longitude                 AS "site.longitude",
    s.timezone                  AS "site.timezone",

    -- Time dimension
    pme.period                  AS "time.period",
    EXTRACT(YEAR FROM TO_DATE(pme.period, 'YYYY-MM'))
                                AS "time.year",
    'Q' || TO_CHAR(TO_DATE(pme.period, 'YYYY-MM'), 'Q')
        || '-' || EXTRACT(YEAR FROM TO_DATE(pme.period, 'YYYY-MM'))
                                AS "time.quarter",
    pme.period                  AS "time.month",

    -- Allocation measures (PM-specific: has planned/actual days)
    NULL                        AS "allocation.percentage",
    pme.planned_hours           AS "allocation.hours",
    pme.planned_days            AS "allocation.planned_days",
    pme.actual_days             AS "allocation.actual_days",
    pme.actual_hours            AS "allocation.actual_hours",
    NULL                        AS "allocation.role",

    -- Version metadata
    pmv.pm_version_id           AS "version.id",
    TO_CHAR(pmv.version_number) AS "version.number",
    pmv.version_type            AS "version.type",
    CASE WHEN pmv.approved_by IS NOT NULL THEN 'Approved'
         ELSE pmv.version_type END AS "version.status"

FROM PM_ENTRY pme
    INNER JOIN PM_PLAN_VERSION pmv  ON pme.pm_version_id    = pmv.pm_version_id
    INNER JOIN EMPLOYEE e           ON pme.employee_id      = e.employee_id
    INNER JOIN TEAM t               ON e.team_id            = t.team_id
    INNER JOIN DEPARTMENT d         ON t.dept_id            = d.dept_id
    INNER JOIN BUSINESS_UNIT bu     ON d.bu_id              = bu.bu_id
    INNER JOIN DIVISION div         ON bu.division_id       = div.division_id
    INNER JOIN PROJECT p            ON pme.project_id       = p.project_id
    INNER JOIN PROJECT_TYPE pt      ON p.project_type_id    = pt.type_id
    INNER JOIN PRODUCT_FAMILY pf    ON p.product_family_id  = pf.family_id
    INNER JOIN SITE s               ON e.site_id            = s.site_id
    INNER JOIN COUNTRY c            ON s.country_id         = c.country_id
WHERE pmv.pm_version_id = :versionId;
```

### 7.3 Simulation Allocation Denormalization Query

```sql
-- ============================================================
-- DENORMALIZATION QUERY: Simulation Allocations → ES Documents
-- Target index: iris-simulation-result
-- ============================================================
SELECT
    sa.sim_alloc_id,
    rs.simulation_id,
    rs.simulation_name,
    sv.sim_version_id,
    sv.version_number           AS sim_version_number,
    rs.source_roadmap_version_id AS source_roadmap,
    SYSTIMESTAMP                 AS sync_timestamp,

    e.employee_id,
    e.name                      AS employee_name,
    e.job_grade                 AS employee_grade,
    e.skill_category            AS employee_skill,
    p.project_id,
    p.project_name,
    p.project_code,
    pf.family_name              AS product_family,
    pt.type_name                AS project_type,
    p.technology_node,
    s.site_name                 AS site,
    d.dept_name                 AS department,
    bu.bu_name                  AS business_unit,
    div.division_name           AS division,
    sa.period,
    EXTRACT(YEAR FROM TO_DATE(sa.period, 'YYYY-MM')) AS year,
    'Q' || TO_CHAR(TO_DATE(sa.period, 'YYYY-MM'), 'Q')
        || '-' || EXTRACT(YEAR FROM TO_DATE(sa.period, 'YYYY-MM'))
                                AS quarter,

    sa.allocated_percentage,
    sa.allocated_hours,
    sa.delta_vs_roadmap,
    CASE WHEN sa.allocated_hours != 0
         THEN ROUND(sa.delta_vs_roadmap / sa.allocated_hours * 100, 2)
         ELSE 0 END            AS delta_percentage,

    sv.parameters_json

FROM SIMULATION_ALLOCATION sa
    INNER JOIN SIMULATION_VERSION sv ON sa.sim_version_id   = sv.sim_version_id
    INNER JOIN RESOURCE_SIMULATION rs ON sv.simulation_id   = rs.simulation_id
    INNER JOIN EMPLOYEE e           ON sa.employee_id       = e.employee_id
    INNER JOIN TEAM t               ON e.team_id            = t.team_id
    INNER JOIN DEPARTMENT d         ON t.dept_id            = d.dept_id
    INNER JOIN BUSINESS_UNIT bu     ON d.bu_id              = bu.bu_id
    INNER JOIN DIVISION div         ON bu.division_id       = div.division_id
    INNER JOIN PROJECT p            ON sa.project_id        = p.project_id
    INNER JOIN PROJECT_TYPE pt      ON p.project_type_id    = pt.type_id
    INNER JOIN PRODUCT_FAMILY pf    ON p.product_family_id  = pf.family_id
    INNER JOIN SITE s               ON e.site_id            = s.site_id
    INNER JOIN COUNTRY c            ON s.country_id         = c.country_id
WHERE sv.sim_version_id = :simVersionId;
```

### 7.4 HeadCount Denormalization Query

```sql
-- ============================================================
-- DENORMALIZATION QUERY: HeadCount Entries → ES Documents
-- Target index: iris-headcount
-- ============================================================
SELECT
    hce.hc_entry_id,
    hcp.hc_plan_id,
    SYSTIMESTAMP                 AS timestamp,

    s.site_name                 AS site,
    s.site_id,
    c.country_name              AS country,
    c.region,
    d.dept_name                 AS department,
    d.dept_id,
    bu.bu_name                  AS business_unit,
    div.division_name           AS division,
    hce.job_grade,
    hce.skill_category,

    hce.period,
    EXTRACT(YEAR FROM TO_DATE(
        CASE WHEN LENGTH(hce.period) = 7 THEN hce.period
             ELSE SUBSTR(hce.period, 1, 4) || '-01' END,
        'YYYY-MM'))             AS year,
    'Q' || TO_CHAR(TO_DATE(
        CASE WHEN LENGTH(hce.period) = 7 THEN hce.period
             ELSE SUBSTR(hce.period, 1, 4) || '-01' END,
        'YYYY-MM'), 'Q')
        || '-' || SUBSTR(hce.period, 1, 4) AS quarter,

    hce.current_count,
    hce.planned_count,
    hce.target_count,
    hce.gap,
    hce.action,

    hcp.status                  AS plan_status,
    hcp.fiscal_year

FROM HEADCOUNT_ENTRY hce
    INNER JOIN HEADCOUNT_PLAN hcp   ON hce.hc_plan_id       = hcp.hc_plan_id
    INNER JOIN DEPARTMENT d         ON hcp.dept_id           = d.dept_id
    INNER JOIN BUSINESS_UNIT bu     ON d.bu_id               = bu.bu_id
    INNER JOIN DIVISION div         ON bu.division_id        = div.division_id
    INNER JOIN SITE s               ON hcp.site_id           = s.site_id
    INNER JOIN COUNTRY c            ON s.country_id          = c.country_id
WHERE hcp.hc_plan_id = :hcPlanId;
```

---

## 8. Data Dictionary

### 8.1 Entity Summary

| #   | Entity                     | Domain    | Description                            | Est. Year 1 Rows | Est. Year 3 Rows | Growth/Month  |
| --- | -------------------------- | --------- | -------------------------------------- | ---------------- | ---------------- | ------------- |
| 1   | COUNTRY                    | Master    | Countries where Samsung DSR operates   | 15               | 20               | ~0            |
| 2   | SITE                       | Master    | Physical facility locations            | 12               | 18               | ~0            |
| 3   | DIVISION                   | Master    | Top-level org divisions                | 5                | 6                | ~0            |
| 4   | BUSINESS_UNIT              | Master    | Business units within divisions        | 15               | 20               | ~0            |
| 5   | DEPARTMENT                 | Master    | Departments within BUs at sites        | 200              | 300              | ~5            |
| 6   | TEAM                       | Master    | Teams within departments               | 500              | 750              | ~10           |
| 7   | EMPLOYEE                   | Master    | Samsung DSR employees                  | 5,000            | 8,000            | ~100          |
| 8   | PROJECT_TYPE               | Master    | Project classification types           | 10               | 12               | ~0            |
| 9   | PRODUCT_FAMILY             | Master    | Product families per BU                | 20               | 30               | ~1            |
| 10  | PROJECT                    | Master    | Active and historical projects         | 500              | 1,000            | ~20           |
| 11  | RESOURCE_ROADMAP           | Planning  | Resource planning roadmaps             | 50               | 150              | ~5            |
| 12  | ROADMAP_VERSION            | Planning  | Versioned roadmap snapshots            | 200              | 600              | ~20           |
| 13  | ROADMAP_PROJECT_ALLOCATION | Planning  | Resource-to-project allocation records | 100,000          | 500,000          | ~15,000       |
| 14  | RESOURCE_SIMULATION        | Planning  | What-if simulation runs                | 100              | 500              | ~15           |
| 15  | SIMULATION_VERSION         | Planning  | Simulation version snapshots           | 300              | 1,500            | ~50           |
| 16  | SIMULATION_ALLOCATION      | Planning  | Simulation allocation records          | 50,000           | 250,000          | ~8,000        |
| 17  | PM_PLAN                    | Planning  | Monthly P/M plans per dept-site        | 2,400            | 7,200            | ~200          |
| 18  | PM_PLAN_VERSION            | Planning  | P/M plan versions                      | 7,200            | 21,600           | ~600          |
| 19  | PM_ENTRY                   | Planning  | Individual P/M assignment entries      | 200,000          | 600,000          | ~20,000       |
| 20  | HEADCOUNT_PLAN             | HeadCount | Annual headcount plans                 | 200              | 600              | ~17           |
| 21  | HEADCOUNT_ENTRY            | HeadCount | HC plan line items                     | 10,000           | 30,000           | ~800          |
| 22  | APPROVAL_REQUEST           | Workflow  | Approval requests                      | 5,000            | 15,000           | ~500          |
| 23  | APPROVAL_HISTORY           | Workflow  | Approval audit trail                   | 10,000           | 30,000           | ~1,000        |
| 24  | FACTOR_CONTROL_SET         | Workflow  | Saved filter configurations            | 500              | 1,500            | ~50           |
| 25  | FACTOR_CONTROL_ITEM        | Workflow  | Individual filter criteria             | 2,500            | 7,500            | ~250          |
| 26  | SYNC_QUEUE                 | Control   | ES sync queue (transient)              | ~1,000 active    | ~1,000 active    | Purged weekly |
| 27  | SYNC_RECORD                | Control   | External system sync tracking          | 10,000           | 30,000           | ~1,000        |
| 28  | SYNC_AUDIT_LOG             | Control   | Sync operation audit trail             | 5,000            | 15,000           | ~500          |

### 8.2 Cross-Storage Field Mapping

This table maps every field across both Oracle and Elasticsearch, showing how Oracle source fields transform into ES document fields.

| Oracle Table    | Oracle Column        | Oracle Type   | ES Index                 | ES Field Path              | ES Type      | Description                  | Sample Value               |
| --------------- | -------------------- | ------------- | ------------------------ | -------------------------- | ------------ | ---------------------------- | -------------------------- |
| COUNTRY         | country_id           | VARCHAR2(36)  | iris-resource-allocation | (not stored directly)      | --           | Country PK, resolved to name | `"C-001"`                  |
| COUNTRY         | country_name         | VARCHAR2(100) | iris-resource-allocation | `site.country`             | keyword      | Country display name         | `"Korea"`                  |
| COUNTRY         | region               | VARCHAR2(20)  | iris-resource-allocation | `site.region`              | keyword      | Geographic region            | `"APAC"`                   |
| SITE            | site_id              | VARCHAR2(36)  | iris-resource-allocation | `site.id`                  | keyword      | Site identifier              | `"S-001"`                  |
| SITE            | site_name            | VARCHAR2(100) | iris-resource-allocation | `site.name`                | keyword      | Site display name            | `"Hwaseong"`               |
| SITE            | site_code            | VARCHAR2(20)  | iris-resource-allocation | `site.code`                | keyword      | Site code                    | `"HWS"`                    |
| SITE            | latitude, longitude  | NUMBER(10,7)  | iris-resource-allocation | `site.geo_point`           | geo_point    | Map pin location             | `{"lat":37.2,"lon":127.0}` |
| SITE            | timezone             | VARCHAR2(50)  | iris-resource-allocation | `site.timezone`            | keyword      | IANA timezone                | `"Asia/Seoul"`             |
| DIVISION        | division_name        | VARCHAR2(100) | iris-resource-allocation | `employee.division`        | keyword      | Division name                | `"DS"`                     |
| BUSINESS_UNIT   | bu_name              | VARCHAR2(100) | iris-resource-allocation | `employee.business_unit`   | keyword      | BU name                      | `"Memory"`                 |
| DEPARTMENT      | dept_name            | VARCHAR2(100) | iris-resource-allocation | `employee.department`      | keyword      | Department name              | `"DRAM Development"`       |
| TEAM            | team_name            | VARCHAR2(100) | iris-resource-allocation | `employee.team`            | keyword      | Team name                    | `"HBM Design Team"`        |
| EMPLOYEE        | employee_id          | VARCHAR2(36)  | iris-resource-allocation | `employee.id`              | keyword      | Employee PK                  | `"E-108"`                  |
| EMPLOYEE        | name                 | VARCHAR2(100) | iris-resource-allocation | `employee.name`            | text+keyword | Full name                    | `"Kim Minjun"`             |
| EMPLOYEE        | employee_number      | VARCHAR2(20)  | iris-resource-allocation | `employee.employee_number` | keyword      | Samsung emp number           | `"SEC-2024-0108"`          |
| EMPLOYEE        | job_title            | VARCHAR2(100) | iris-resource-allocation | `employee.job_title`       | keyword      | Job title                    | `"Senior Engineer"`        |
| EMPLOYEE        | job_grade            | VARCHAR2(10)  | iris-resource-allocation | `employee.job_grade`       | keyword      | Grade level                  | `"G7"`                     |
| EMPLOYEE        | skill_category       | VARCHAR2(30)  | iris-resource-allocation | `employee.skill_category`  | keyword      | Primary skill                | `"Design"`                 |
| PROJECT         | project_id           | VARCHAR2(36)  | iris-resource-allocation | `project.id`               | keyword      | Project PK                   | `"P-042"`                  |
| PROJECT         | project_name         | VARCHAR2(200) | iris-resource-allocation | `project.name`             | keyword      | Project name                 | `"HBM4 Development"`       |
| PROJECT         | project_code         | VARCHAR2(30)  | iris-resource-allocation | `project.code`             | keyword      | Project code                 | `"HBM4-DEV"`               |
| PROJECT         | technology_node      | VARCHAR2(20)  | iris-resource-allocation | `project.technology_node`  | keyword      | Tech node                    | `"3nm"`                    |
| PROJECT         | priority             | NUMBER(1)     | iris-resource-allocation | `project.priority`         | byte         | Priority 1-5                 | `1`                        |
| PROJECT         | status               | VARCHAR2(20)  | iris-resource-allocation | `project.status`           | keyword      | Project status               | `"Active"`                 |
| PROJECT_TYPE    | type_name            | VARCHAR2(50)  | iris-resource-allocation | `project.type`             | keyword      | Project type                 | `"R&D"`                    |
| PROJECT_TYPE    | category             | VARCHAR2(30)  | iris-resource-allocation | `project.type_category`    | keyword      | Type category                | `"Core"`                   |
| PRODUCT_FAMILY  | family_name          | VARCHAR2(100) | iris-resource-allocation | `project.product_family`   | keyword      | Product family               | `"DRAM"`                   |
| RPA             | allocation_id        | VARCHAR2(36)  | iris-resource-allocation | `allocation_id`            | keyword      | Allocation PK / doc ID       | `"A-001"`                  |
| RPA             | period               | VARCHAR2(7)   | iris-resource-allocation | `time.period`              | keyword      | Month period                 | `"2026-04"`                |
| RPA             | period (derived)     | --            | iris-resource-allocation | `time.year`                | short        | Fiscal year                  | `2026`                     |
| RPA             | period (derived)     | --            | iris-resource-allocation | `time.quarter`             | keyword      | Fiscal quarter               | `"Q2-2026"`                |
| RPA             | allocated_percentage | NUMBER(5,2)   | iris-resource-allocation | `allocation.percentage`    | float        | Allocation %                 | `80.00`                    |
| RPA             | allocated_hours      | NUMBER(7,2)   | iris-resource-allocation | `allocation.hours`         | float        | Monthly hours                | `128.00`                   |
| RPA             | role_in_project      | VARCHAR2(20)  | iris-resource-allocation | `allocation.role`          | keyword      | Role in project              | `"Member"`                 |
| ROADMAP_VERSION | version_id           | VARCHAR2(36)  | iris-resource-allocation | `version.id`               | keyword      | Version PK                   | `"V-091"`                  |
| ROADMAP_VERSION | version_number       | VARCHAR2(10)  | iris-resource-allocation | `version.number`           | keyword      | Version label                | `"V3"`                     |
| ROADMAP_VERSION | version_type         | VARCHAR2(20)  | iris-resource-allocation | `version.type`             | keyword      | Version type                 | `"Approved"`               |
| PM_ENTRY        | planned_days         | NUMBER(5,2)   | iris-resource-allocation | `allocation.planned_days`  | float        | Planned days                 | `16.00`                    |
| PM_ENTRY        | actual_days          | NUMBER(5,2)   | iris-resource-allocation | `allocation.actual_days`   | float        | Actual days                  | `14.50`                    |
| PM_ENTRY        | actual_hours         | NUMBER(7,2)   | iris-resource-allocation | `allocation.actual_hours`  | float        | Actual hours                 | `116.00`                   |
| HEADCOUNT_ENTRY | current_count        | NUMBER(6)     | iris-headcount           | `current_count`            | integer      | Current HC                   | `42`                       |
| HEADCOUNT_ENTRY | planned_count        | NUMBER(6)     | iris-headcount           | `planned_count`            | integer      | Planned HC                   | `45`                       |
| HEADCOUNT_ENTRY | target_count         | NUMBER(6)     | iris-headcount           | `target_count`             | integer      | Target HC                    | `50`                       |
| HEADCOUNT_ENTRY | gap                  | NUMBER(6)     | iris-headcount           | `gap`                      | integer      | HC gap                       | `5`                        |
| HEADCOUNT_ENTRY | action               | VARCHAR2(20)  | iris-headcount           | `action`                   | keyword      | Recommended action           | `"Hire"`                   |
| SIM_ALLOCATION  | delta_vs_roadmap     | NUMBER(7,2)   | iris-simulation-result   | `delta_vs_roadmap`         | float        | Hours delta                  | `-16.00`                   |

---

## 9. Multi-Dimensional Analysis Mapping

### 9.1 OLAP Dimension Hierarchy

```
                        DIMENSION HIERARCHIES
    ┌──────────────────────────────────────────────────────────┐
    │                                                          │
    │  SITE:         Region ──► Country ──► Site               │
    │                APAC        Korea       Hwaseong           │
    │                                                          │
    │  ORGANIZATION: Division ──► BU ──► Dept ──► Team         │
    │                DS           Memory  DRAM Dev  HBM Design │
    │                                                          │
    │  EMPLOYEE:     Grade ──► SkillCategory ──► Employee      │
    │                G7         Design           Kim Minjun    │
    │                                                          │
    │  PROJECT:      ProductFamily ──► ProjectType ──► Project  │
    │                DRAM              R&D             HBM4 Dev │
    │                                                          │
    │  TIME:         Year ──► Quarter ──► Month                │
    │                2026     Q2-2026      2026-04             │
    │                                                          │
    │  VERSION:      VersionType ──► VersionNumber             │
    │                Approved        V3                         │
    └──────────────────────────────────────────────────────────┘
```

### 9.2 Dimension-to-Field Mapping

| OLAP Dimension   | Hierarchy Level | ES Field Path                   | Oracle Source                  | Aggregation Support  |
| ---------------- | --------------- | ------------------------------- | ------------------------------ | -------------------- |
| **Site**         | Region          | `site.region`                   | COUNTRY.region                 | terms agg            |
| **Site**         | Country         | `site.country`                  | COUNTRY.country_name           | terms agg            |
| **Site**         | Site            | `site.name`                     | SITE.site_name                 | terms agg, geo_point |
| **Organization** | Division        | `employee.division`             | DIVISION.division_name         | terms agg            |
| **Organization** | Business Unit   | `employee.business_unit`        | BUSINESS_UNIT.bu_name          | terms agg            |
| **Organization** | Department      | `employee.department`           | DEPARTMENT.dept_name           | terms agg            |
| **Organization** | Team            | `employee.team`                 | TEAM.team_name                 | terms agg            |
| **Employee**     | Grade           | `employee.job_grade`            | EMPLOYEE.job_grade             | terms agg            |
| **Employee**     | Skill Category  | `employee.skill_category`       | EMPLOYEE.skill_category        | terms agg            |
| **Employee**     | Employee        | `employee.id` + `employee.name` | EMPLOYEE                       | cardinality agg      |
| **Project**      | Product Family  | `project.product_family`        | PRODUCT_FAMILY.family_name     | terms agg            |
| **Project**      | Project Type    | `project.type`                  | PROJECT_TYPE.type_name         | terms agg            |
| **Project**      | Project         | `project.name`                  | PROJECT.project_name           | terms agg            |
| **Time**         | Year            | `time.year`                     | Derived from period            | terms agg            |
| **Time**         | Quarter         | `time.quarter`                  | Derived from period            | terms agg            |
| **Time**         | Month           | `time.month`                    | period (YYYY-MM)               | terms agg            |
| **Version**      | Version Type    | `version.type`                  | ROADMAP_VERSION.version_type   | terms agg, filter    |
| **Version**      | Version Number  | `version.number`                | ROADMAP_VERSION.version_number | terms agg            |

### 9.3 Supported Analytical Operations

| Operation      | ES Implementation                         | Example                               |
| -------------- | ----------------------------------------- | ------------------------------------- |
| **Drill-down** | Nested terms aggregation (parent → child) | Region → Country → Site headcount     |
| **Drill-up**   | Higher-level terms aggregation            | Site → Country → Region roll-up       |
| **Slice**      | Bool filter on one dimension              | Show only "APAC" region               |
| **Dice**       | Bool filter on multiple dimensions        | "APAC" + "Memory" BU + "Q2-2026"      |
| **Pivot**      | Multi-level terms aggs (rows × columns)   | Department × Project allocation hours |
| **Top-N**      | Terms agg with size parameter             | Top 10 projects by total hours        |
| **Comparison** | Multi-search across simulation index      | Roadmap vs. Simulation delta          |

---

## 10. Data Sync Architecture

### 10.1 Four Sync Strategies

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYNC STRATEGY OVERVIEW                       │
│                                                                 │
│  Strategy 1: EVENT-DRIVEN                                       │
│  Trigger:    After-Commit on Oracle                             │
│  Latency:    1-5 seconds                                        │
│  Scope:      Changed entities only                              │
│  Purpose:    Real-time sync for user actions                    │
│  Flow:       User Save → Oracle COMMIT → After-Commit Event    │
│              → SyncQueue INSERT → Sync Worker (30s poll)        │
│              → Denormalize → ES Bulk API → Available in ES      │
│                                                                 │
│  Strategy 2: SCHEDULED MICRO-BATCH                              │
│  Trigger:    Every 30 seconds (Mendix scheduled event)          │
│  Latency:    30 seconds max                                     │
│  Scope:      All PENDING items in SyncQueue                     │
│  Purpose:    Reliable processing of sync queue                  │
│  Flow:       Poll SyncQueue → Batch (up to 500) → Denormalize  │
│              → ES Bulk API → Mark COMPLETED or RETRY            │
│                                                                 │
│  Strategy 3: NIGHTLY FULL SYNC                                  │
│  Trigger:    02:00 AM daily (cron)                              │
│  Latency:    N/A (batch)                                        │
│  Scope:      All active data across all indices                 │
│  Purpose:    Catch-up, repair drift, master data refresh        │
│  Flow:       Query all active versions → Denormalize all        │
│              → Bulk index (500/batch) → Count verification      │
│              → Purge old queue items → Log to SyncAuditLog      │
│                                                                 │
│  Strategy 4: ON-DEMAND REINDEX                                  │
│  Trigger:    Admin-triggered from IRIS Admin page               │
│  Latency:    Minutes (depends on volume)                        │
│  Scope:      Full or partial (single index or version)          │
│  Purpose:    Post-migration, post-import, recovery              │
│  Flow:       Create new index (timestamp suffix) → Bulk index   │
│              → Verify counts → Alias swap (atomic, zero-down)   │
│              → Delete old index                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 SyncQueue Processing Flow

```
SyncQueue Item Lifecycle:

  PENDING ────────► PROCESSING ────────► COMPLETED
                        │
                        │ (ES error)
                        ▼
                      RETRY  (retry_count += 1)
                        │
                        │ (wait: 30s x 2^retry_count)
                        │   Retry 1: 60s
                        │   Retry 2: 120s
                        │   Retry 3: 240s
                        ▼
                    PROCESSING ────────► COMPLETED
                        │
                        │ (retry_count >= 3)
                        ▼
                      FAILED
                        │
                        ▼
                  Alert Admin
                  (caught by nightly full sync)
```

### 10.3 Event-to-Index Mapping

| Mendix Event                            | Entity Type in Queue | Target ES Index            | Sync Action                        |
| --------------------------------------- | -------------------- | -------------------------- | ---------------------------------- |
| PM Plan version saved (Draft/Permanent) | PMPlanVersion        | `iris-resource-allocation` | UPSERT all PMEntry for version     |
| Roadmap version saved/approved          | RoadmapVersion       | `iris-resource-allocation` | UPSERT all allocations for version |
| Simulation version saved                | SimulationVersion    | `iris-simulation-result`   | UPSERT all sim allocations         |
| HeadCount plan saved                    | HeadCountEntry       | `iris-headcount`           | UPSERT all HC entries              |
| Version approved (any)                  | (version entity)     | `iris-resource-allocation` | Update version.status field        |
| Version archived                        | (version entity)     | `iris-resource-allocation` | Update status or DELETE            |
| Master data changed (N-PLM import)      | MasterData           | ALL indices                | FULL REINDEX                       |

### 10.4 On-Demand Reindex — Zero-Downtime Alias Swap

```
Step 1: Create new index with timestamp suffix
        iris-resource-allocation-20260322

Step 2: Bulk index all data from Oracle into new index
        (disable replicas + refresh during bulk for speed)

Step 3: Verify document counts (Oracle vs new ES index)

Step 4: Swap alias atomically
        POST _aliases
        {
          "actions": [
            { "remove": { "index": "iris-resource-allocation-20260315",
                          "alias": "iris-resource-allocation" } },
            { "add":    { "index": "iris-resource-allocation-20260322",
                          "alias": "iris-resource-allocation" } }
          ]
        }

Step 5: Delete old index after confirmation
```

### 10.5 Circuit Breaker Pattern

```
consecutive_failures = 0

FOR EACH batch in SyncQueue (PENDING, ORDER BY created_at):
    result = call_es_bulk(batch)

    IF result.success:
        consecutive_failures = 0
        mark_completed(batch)
    ELSE:
        consecutive_failures += 1
        mark_retry(batch)

        IF consecutive_failures >= 5:
            LOG "Circuit breaker OPEN - pausing sync for 5 minutes"
            PAUSE 300 seconds
            consecutive_failures = 0
            -- Nightly sync catches anything missed
```

### 10.6 End-to-End Latency Budget

| Step                                  | Duration  | Cumulative |
| ------------------------------------- | --------- | ---------- |
| Oracle COMMIT                         | ~50ms     | 50ms       |
| After-Commit event fire               | ~10ms     | 60ms       |
| SyncQueue INSERT                      | ~5ms      | 65ms       |
| **User sees "Saved"**                 | --        | **65ms**   |
| Sync Worker picks up (0-30s poll)     | 0-30s     | 0.1-30s    |
| Denormalization query (12-table join) | 100-500ms | 0.2-30.5s  |
| Build JSON document                   | ~5ms      | --         |
| ES Bulk API call                      | 50-200ms  | --         |
| ES refresh (auto, 1s)                 | 0-1s      | --         |
| **ES reflects change**                | --        | **1-32s**  |

**Typical end-to-end**: User saves, dashboard shows new data in 2-10 seconds.

---

## 11. Data Consistency Rules

| Rule                                | ID  | Description                                                                                               | Enforcement Mechanism                                                                                                        |
| ----------------------------------- | --- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Oracle is truth**                 | R1  | All writes go to Oracle. ES is never written to directly by business logic.                               | Module M33 is the only ES writer. All other modules write exclusively to Oracle via Mendix ORM.                              |
| **Transactional reads from Oracle** | R2  | PM plan editing, roadmap editing, simulation editing all read from Oracle.                                | Mendix data views bound to domain model entities (Oracle-backed).                                                            |
| **Analytical reads from ES**        | R3  | Dashboards, charts, world map, reports, and analysis views read from ES.                                  | ECharts/Gantt widgets call ES via M33 REST endpoints. No direct Oracle queries for analytics.                                |
| **Acceptable lag**                  | R4  | 1-5 second delay between Oracle commit and ES visibility is acceptable for analytics.                     | Dashboards display "Data as of: [timestamp]" indicator. Users understand analytical data may lag.                            |
| **Nightly reconciliation**          | R5  | Full sync at 02:00 AM catches any missed events and corrects drift.                                       | Count verification after sync. If delta > 0.1%: automatic targeted reindex + admin alert.                                    |
| **Immutable versioning**            | R6  | Once a version is approved, its data in both Oracle and ES is immutable. New changes create new versions. | Version state machine enforces: Approved status cannot transition back to Draft. UPDATE blocked on approved version records. |

### Inconsistency Handling Matrix

| Scenario                           | Detection                    | Automated Resolution                                       | Manual Escalation                                   |
| ---------------------------------- | ---------------------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| Sync queue item fails              | retry_count > 0              | Exponential backoff retry (30s, 60s, 120s). Max 3 retries. | After 3 failures: FAILED status, admin alert        |
| ES cluster temporarily unavailable | ES connection error          | Queue items remain PENDING. Worker retries next 30s cycle. | If downtime > 24h: trigger full reindex on recovery |
| Oracle count != ES count           | Nightly verification         | If delta > 0.1%: auto reindex affected index               | Admin notified, reviews SyncAuditLog                |
| Master data changed (N-PLM import) | N-PLM sync event             | Full reindex of ALL indices triggered                      | Admin verifies count match post-reindex             |
| Stale data on dashboard            | Timestamp display            | Dashboard shows "Last synced: [timestamp]"                 | Admin can trigger on-demand reindex                 |
| ES index corrupted                 | Health check or query errors | Zero-downtime reindex via alias swap                       | No data loss: Oracle is source of truth             |

---

## 12. Migration Strategy

### 12.1 Overview

IRIS replaces PM Planner, Samsung DSR's current Excel-based resource planning tool. Migration requires transforming spreadsheet data into the IRIS normalized schema and then syncing to Elasticsearch.

### 12.2 Source Data Assessment

| Source                 | Format                          | Estimated Volume                                  | Quality Risks                                          |
| ---------------------- | ------------------------------- | ------------------------------------------------- | ------------------------------------------------------ |
| PM Planner Excel files | .xlsx, per department per month | ~200 files, ~50K rows total                       | Inconsistent naming, missing fields, duplicate entries |
| N-PLM master data      | API / CSV export                | ~5,000 employees, ~500 projects, ~200 departments | Authoritative source, high quality                     |
| PROMIS sync records    | API / DB extract                | ~10,000 historical sync events                    | Used for validation only                               |

### 12.3 Migration Phases

```
Phase 1: Master Data Load (Day 1-2)
├── Import from N-PLM API:
│   ├── Countries, Sites (manual seed + N-PLM)
│   ├── Divisions, Business Units (N-PLM org hierarchy)
│   ├── Departments, Teams (N-PLM + manual mapping)
│   ├── Employees (N-PLM employee directory)
│   ├── Project Types, Product Families (manual seed)
│   └── Projects (N-PLM project registry)
├── Validation:
│   ├── All FK relationships resolve
│   ├── No orphan records
│   └── Count match vs N-PLM source
└── Sign-off: CDO + COO

Phase 2: Historical Plan Data (Day 3-5)
├── Transform PM Planner Excel → IRIS schema:
│   ├── Parse Excel files (Python ETL script)
│   ├── Map Excel column headers to IRIS fields
│   ├── Resolve employee names → employee_id (fuzzy match against EMPLOYEE table)
│   ├── Resolve project names → project_id
│   ├── Create PM_PLAN records (one per dept+site+year+month)
│   ├── Create PM_PLAN_VERSION (version_type = 'Permanent', version_number = 1)
│   └── Create PM_ENTRY records (one per employee+project+period)
├── Validation:
│   ├── Spot-check 50 random entries against source Excel
│   ├── Total hours match within 1% tolerance
│   └── No duplicate entries (unique constraint check)
└── Sign-off: CPO + CDO

Phase 3: Elasticsearch Initial Load (Day 6)
├── Full reindex from Oracle to ES:
│   ├── Create all 4 ES indices with mappings (Section 6)
│   ├── Run denormalization queries (Section 7)
│   ├── Bulk index to ES (disable replicas during load)
│   ├── Verify counts: Oracle vs ES per index
│   └── Restore replicas, enable refresh
├── Validation:
│   ├── Count verification passes (0% delta)
│   ├── Sample queries return expected results
│   └── Dashboard widgets render correctly
└── Sign-off: CDO + CAO

Phase 4: Validation & Parallel Run (Day 7-14)
├── Run IRIS in parallel with PM Planner for 1-2 weeks
├── Users enter data in both systems
├── Compare outputs:
│   ├── Allocation totals match
│   ├── Headcount figures align
│   └── Report outputs are equivalent
├── Fix discrepancies, re-run migration if needed
└── Sign-off: CEO (GO for cutover)

Phase 5: Cutover (Day 15)
├── Final N-PLM sync to IRIS
├── Final PM Planner data import
├── Full ES reindex
├── Disable PM Planner write access
├── IRIS goes live as primary system
└── PM Planner retained read-only for 90 days
```

### 12.4 Data Mapping: PM Planner Excel → IRIS

| PM Planner Excel Column | IRIS Target Table | IRIS Column   | Transform                                                              |
| ----------------------- | ----------------- | ------------- | ---------------------------------------------------------------------- |
| "Employee Name"         | PM_ENTRY          | employee_id   | Fuzzy match against EMPLOYEE.name, manual review for ambiguous matches |
| "Employee ID"           | PM_ENTRY          | employee_id   | Direct lookup via EMPLOYEE.employee_number                             |
| "Project"               | PM_ENTRY          | project_id    | Lookup via PROJECT.project_code or PROJECT.project_name                |
| "Month"                 | PM_ENTRY          | period        | Convert "Apr-2026" format to "2026-04"                                 |
| "Planned Days"          | PM_ENTRY          | planned_days  | Direct numeric                                                         |
| "Planned Hours"         | PM_ENTRY          | planned_hours | Direct numeric, or computed: planned_days x 8                          |
| "Actual Days"           | PM_ENTRY          | actual_days   | Direct numeric                                                         |
| "Actual Hours"          | PM_ENTRY          | actual_hours  | Direct numeric                                                         |
| "Department"            | PM_PLAN           | dept_id       | Lookup via DEPARTMENT.dept_name                                        |
| "Site"                  | PM_PLAN           | site_id       | Lookup via SITE.site_name                                              |

### 12.5 Rollback Plan

If migration fails or data quality is unacceptable:

1. PM Planner remains active (never disabled until Phase 5 cutover)
2. IRIS Oracle data can be truncated and re-loaded
3. ES indices are derived from Oracle — rebuild at any time via on-demand reindex
4. No data loss risk: source Excel files and N-PLM remain unmodified

---

## Appendix A: Quality Checklist

Per the A2 Data Modeling Guide, this deliverable is **Done** when:

- [x] Conceptual Data Model created with all 28 entities and relationships across 4 domains
- [x] Logical Data Model normalized to 3NF with all attributes, types, and constraints
- [x] Physical Data Model includes Oracle 19c DDL with proper data types, indexes, and constraints
- [x] Elasticsearch index specifications with full mappings for all 4 indices
- [x] Data Dictionary documents 100% of entities and attributes with cross-storage mapping
- [x] All unique constraints and foreign keys defined
- [x] Every entity has audit columns (created_at, updated_at, created_by, updated_by)
- [x] Naming conventions consistently applied (UPPER_SNAKE for tables, lower_snake for columns)
- [x] Denormalization transform queries provided (12-table join SQL)
- [x] Data sync architecture with 4 strategies documented
- [x] Migration strategy from PM Planner to IRIS defined
- [x] Volume estimates provided for all entities (Year 1 and Year 3)
- [x] Index lifecycle management (ILM) policy defined
- [x] SyncQueue partitioning strategy specified
- [x] Connection pool sizing recommendations provided

---

## Appendix B: Cross-References

| Reference                  | Document                                                   | Relationship                                          |
| -------------------------- | ---------------------------------------------------------- | ----------------------------------------------------- |
| A1 — Business Modeling     | `03_DEVELOP/a1-business-model.md`                          | Provides business rules and entity identification     |
| A3 — Process Modeling      | `03_DEVELOP/a3-process-model.md`                           | Consumes this data model for workflow and CRUD design |
| A4 — Architecture Design   | `03_DEVELOP/a4-architecture-design.md`                     | Database selection, infrastructure, deployment        |
| Input: Data Modeling Ideas | `.command/000_init_project/input/docs/02-data-modeling.md` | Source ideation document                              |
| Input: Data Sync & ETL     | `.command/000_init_project/input/docs/05-data-sync-etl.md` | Sync architecture reference                           |
| AX Guide: A2 Data Modeling | `.ax/analysis/A2_DATA_MODELING_GUIDE.md`                   | Framework methodology guide                           |

---

_Part of the IRIS Analysis Handoff (A1-A5) — AX Transformation Framework v2.0.0_
_Document: A2 — Data Model Specification_
_Owner: CXO + CDO_
_Date: 2026-03-22_
