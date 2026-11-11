import { PigOperation } from '../types/agriculture';

export const PIG_OPERATIONS: PigOperation[] = [
  {
    id: 'op-load',
    name: 'LOAD Operation',
    keyword: 'LOAD',
    title: 'Loading Agricultural CSV Data with PigStorage',
    shortDesc: 'Reads structured agricultural records from HDFS into a relation with typed schema.',
    pigScript: `-- 1. LOAD: Read Agricultural Production CSV dataset from HDFS
agri_raw = LOAD '/hdfs/data/agricultural_production.csv' 
           USING PigStorage(',') 
           AS (
               state: chararray,
               district: chararray,
               crop: chararray,
               crop_year: int,
               season: chararray,
               area: double,
               production: double,
               yield: double
           );

-- Describe relation schema and verify bag types
DESCRIBE agri_raw;
DUMP agri_raw;`,
    syntaxExplanation: `The LOAD statement points to a file or directory in HDFS and uses the PigStorage built-in loader with a comma delimiter. The AS clause declares field identifiers and explicit Pig Latin data types (chararray, int, double). This defines the tuple schema for the entire downstream pipeline.`,
    mapReduceStage: 'Input / Split',
    explanationPoints: [
      'FileInputFormat splits the CSV across HDFS blocks (typically 128MB each).',
      'PigStorage parses each line by comma and maps columns to typed Pig primitives.',
      'No MapReduce job is executed at LOAD time; Pig operates lazily until DUMP or STORE is triggered.',
      'Generates a relation schema of (state:chararray, district:chararray, crop:chararray, crop_year:int, season:chararray, area:double, production:double, yield:double).'
    ],
    sampleOutputSchema: 'agri_raw: {state: chararray, district: chararray, crop: chararray, crop_year: int, season: chararray, area: double, production: double, yield: double}'
  },
  {
    id: 'op-filter',
    name: 'FILTER Operation',
    keyword: 'FILTER',
    title: 'Filtering Records on Crop, State, and Crop Year',
    shortDesc: 'Eliminates unneeded records using boolean predicates, reducing data volume in Map phase.',
    pigScript: `-- 2. FILTER: Extract high-production records for recent crop years (>= 2020)
-- Exclude records with missing or non-positive harvest outputs
recent_valid_data = FILTER agri_raw BY 
                    crop_year >= 2020 
                    AND production > 0 
                    AND (season == 'Kharif' OR season == 'Rabi' OR season == 'Whole Year');

-- Optional specific state/crop drill-down
punjab_wheat = FILTER agri_raw BY state == 'Punjab' AND crop == 'Wheat';

DUMP recent_valid_data;`,
    syntaxExplanation: `The FILTER operator tests each tuple against boolean conditions (equality, comparison, logical AND/OR/NOT). Records matching true are passed downstream, while false or NULL records are dropped.`,
    mapReduceStage: 'Map Phase',
    explanationPoints: [
      'Executed entirely within the Map task: acts as a predicate pushdown.',
      'Greatly reduces network I/O before shuffle and sort phase.',
      'Supports complex nested condition checks, string regex matches, and null checks (x IS NOT NULL).',
      'Maintains original relation schema without schema degradation.'
    ],
    sampleOutputSchema: 'recent_valid_data: {state: chararray, district: chararray, crop: chararray, crop_year: int, season: chararray, area: double, production: double, yield: double}'
  },
  {
    id: 'op-group',
    name: 'GROUP Operation',
    keyword: 'GROUP',
    title: 'Grouping Agricultural Records by Crop or State',
    shortDesc: 'Collects records sharing the same key into a single group bag, triggering Shuffle & Sort.',
    pigScript: `-- 3. GROUP: Group agricultural records by crop name
grouped_by_crop = GROUP recent_valid_data BY crop;

-- Multi-key Grouping: Group by state AND season
grouped_by_state_season = GROUP recent_valid_data BY (state, season);

-- Check nested bag structure in Pig relation
DESCRIBE grouped_by_crop;
ILLUSTRATE grouped_by_crop;`,
    syntaxExplanation: `GROUP gathers tuples with identical grouping keys into an inner bag. The resulting schema contains two primary fields: 'group' (the key value or tuple) and a bag named after the source relation containing all matching original tuples.`,
    mapReduceStage: 'Shuffle & Sort',
    explanationPoints: [
      'This is a boundary operation that generates a MapReduce job.',
      'Mappers emit key-value pairs (key = crop/state, value = tuple).',
      'The Hadoop Partitioner & Shuffle engine distributes identical keys to the same Reducer.',
      'Reducers receive the grouped bag ready for aggregation functions like SUM and AVG.'
    ],
    sampleOutputSchema: 'grouped_by_crop: {group: chararray, recent_valid_data: {(state: chararray, district: chararray, crop: chararray, crop_year: int, season: chararray, area: double, production: double, yield: double)}}'
  },
  {
    id: 'op-foreach',
    name: 'FOREACH Operation',
    keyword: 'FOREACH',
    title: 'Calculating Total and Average Production & Yield',
    shortDesc: 'Iterates through grouped bags to project columns and compute aggregate statistical functions.',
    pigScript: `-- 4. FOREACH: Compute aggregate metrics for each crop group
crop_aggregates = FOREACH grouped_by_crop GENERATE 
                  group AS crop_name,
                  ROUND_TO(SUM(recent_valid_data.production), 2) AS total_production_tonnes,
                  ROUND_TO(SUM(recent_valid_data.area), 2) AS total_area_hectares,
                  ROUND_TO(AVG(recent_valid_data.yield), 2) AS average_yield,
                  COUNT(recent_valid_data) AS total_district_records;

-- State-level production breakdown
grouped_by_state = GROUP recent_valid_data BY state;
state_aggregates = FOREACH grouped_by_state GENERATE 
                   group AS state_name,
                   ROUND_TO(SUM(recent_valid_data.production), 2) AS state_production,
                   ROUND_TO(AVG(recent_valid_data.yield), 2) AS state_avg_yield;

DUMP crop_aggregates;`,
    syntaxExplanation: `FOREACH ... GENERATE evaluates expressions, projections, and aggregate UDFs (SUM, AVG, MIN, MAX, COUNT) over each bag in the input relation, reshaping data into flat relational tuples.`,
    mapReduceStage: 'Reduce Phase',
    explanationPoints: [
      'Uses Pig Algebraic interface (Initial, Intermediate, Final) allowing Combiner optimization on Mappers.',
      'SUM and COUNT are computed locally at the Mapper level to reduce network serialization.',
      'Final aggregation occurs inside Reducer tasks before emitting the result.',
      'Flattens complex nested bags back into simple tabular records.'
    ],
    sampleOutputSchema: 'crop_aggregates: {crop_name: chararray, total_production_tonnes: double, total_area_hectares: double, average_yield: double, total_district_records: long}'
  },
  {
    id: 'op-orderby',
    name: 'ORDER BY Operation',
    keyword: 'ORDER BY',
    title: 'Sorting Crops Based on Production Volume',
    shortDesc: 'Performs a global parallel sort across partitions using Hadoop sampling.',
    pigScript: `-- 5. ORDER BY: Sort crops descending by total agricultural production
sorted_crops_by_production = ORDER crop_aggregates BY total_production_tonnes DESC;

-- Sort states descending by total output
sorted_states_by_production = ORDER state_aggregates BY state_production DESC;

DUMP sorted_crops_by_production;`,
    syntaxExplanation: `ORDER BY specifies one or more fields to sort by, along with sort order (ASC or DESC). In a distributed environment, Pig uses a sampler job to determine key quantiles for balanced Reducer sorting.`,
    mapReduceStage: 'Reduce Phase',
    explanationPoints: [
      'Executes a dedicated MapReduce job with a RandomSampleLoader.',
      'Determines partition boundaries so data across multiple reducers remains globally sorted.',
      'TotalOrderPartitioner routes ranges to ordered reducers.',
      'Guarantees strict global ordering of agricultural yields or output.'
    ],
    sampleOutputSchema: 'sorted_crops_by_production: {crop_name: chararray, total_production_tonnes: double, total_area_hectares: double, average_yield: double, total_district_records: long}'
  },
  {
    id: 'op-limit',
    name: 'LIMIT Operation',
    keyword: 'LIMIT',
    title: 'Displaying Top 10 High-Producing Crops',
    shortDesc: 'Restricts output relation to a designated tuple threshold for top-N ranking analysis.',
    pigScript: `-- 6. LIMIT: Restrict the sorted dataset to the top 10 agricultural crops
top_10_highest_crops = LIMIT sorted_crops_by_production 10;

-- Top 5 highest producing states
top_5_states = LIMIT sorted_states_by_production 5;

DUMP top_10_highest_crops;`,
    syntaxExplanation: `LIMIT N truncates the relation after N tuples. When paired with ORDER BY, it implements the classic top-N ranking query pattern with minimal cluster resource consumption.`,
    mapReduceStage: 'Reduce Phase',
    explanationPoints: [
      'Can be pushed down to individual Reducers so each Reducer only emits up to N tuples.',
      'Final reducer merges the candidate lists and outputs exactly the top N rows.',
      'Prevents transferring massive unnecessary datasets to the client console or storage.',
      'Ideal for executive summaries and dashboard display cards.'
    ],
    sampleOutputSchema: 'top_10_highest_crops: {crop_name: chararray, total_production_tonnes: double, total_area_hectares: double, average_yield: double, total_district_records: long}'
  },
  {
    id: 'op-join',
    name: 'JOIN Operation',
    keyword: 'JOIN',
    title: 'Combining Crop Production and State Agro-Climatic Zones',
    shortDesc: 'Equi-joins agricultural production records with state environmental reference datasets.',
    pigScript: `-- 7. JOIN: Load secondary reference data for State Agro-Climatic Zones
state_zones = LOAD '/hdfs/ref/state_agro_zones.csv' 
              USING PigStorage(',') 
              AS (
                  state: chararray, 
                  agro_zone: chararray, 
                  primary_soil: chararray, 
                  climate: chararray, 
                  avg_rainfall_mm: int
              );

-- Combine state agricultural production with agro-climatic environmental data
joined_state_analytics = JOIN state_aggregates BY state_name, state_zones BY state;

-- Project enriched regional dataset
enriched_report = FOREACH joined_state_analytics GENERATE 
                  state_aggregates::state_name AS state,
                  state_zones::agro_zone AS zone,
                  state_zones::primary_soil AS soil_type,
                  state_zones::climate AS climate_type,
                  state_aggregates::state_production AS total_output,
                  state_zones::avg_rainfall_mm AS rainfall;

DUMP enriched_report;`,
    syntaxExplanation: `JOIN combines tuples from two or more relations based on matching key columns (equi-join). Pig supports standard reduce-side joins, replicated joins (distributed cache for small lookup tables), skewed joins, and merge joins.`,
    mapReduceStage: 'Shuffle & Sort',
    explanationPoints: [
      'Default is Hash Join via MapReduce Shuffle: tags tuples with source relation ID.',
      'Can use USING "replicated" hint if the state zones lookup file is under 100MB (Map-side join).',
      'Provides rich contextual insight by correlating crop output with rainfall and soil types.',
      'Columns from joined relations can be disambiguated with relation::column syntax.'
    ],
    sampleOutputSchema: 'enriched_report: {state: chararray, zone: chararray, soil_type: chararray, climate_type: chararray, total_output: double, rainfall: int}'
  },
  {
    id: 'op-store',
    name: 'STORE Operation',
    keyword: 'STORE',
    title: 'Saving Analytical Results to HDFS / Cloud Storage',
    shortDesc: 'Triggers the execution of the full execution graph and serializes relations to HDFS.',
    pigScript: `-- 8. STORE: Persist the top 10 crop analytics to HDFS directory
STORE top_10_highest_crops 
INTO '/hdfs/analytics/results/top_10_crops_summary' 
USING PigStorage(',');

-- Persist enriched state zone report
STORE enriched_report 
INTO '/hdfs/analytics/results/state_agro_enriched' 
USING PigStorage('\\t');

-- In production Hadoop clusters, can also use HCatalog / Hive metastore:
-- STORE enriched_report INTO 'agri_dw.state_summary' USING org.apache.hive.hcatalog.pig.HCatStorer();`,
    syntaxExplanation: `STORE is an execution trigger in Pig's lazy evaluation model. Pig will compile the entire logical DAG into physical MapReduce jobs, launch the Hadoop tasks, and write the output files into the designated HDFS path using the specified output format.`,
    mapReduceStage: 'Output Format',
    explanationPoints: [
      'Marks the terminal action in a Pig script: triggers DAG parsing, optimization, and Hadoop submission.',
      'Output is written as part-m-00000 or part-r-00000 files in the target directory.',
      'Throws an error if the destination directory already exists (Hadoop safety safeguard).',
      'Integrates seamlessly with downstream tools like Apache Hive, Apache Spark, or BI dashboards.'
    ],
    sampleOutputSchema: 'Files written to: /hdfs/analytics/results/top_10_crops_summary/part-r-00000'
  }
];

export const PRESET_PIG_SCRIPTS = [
  {
    id: 'script-top10-crops',
    title: 'Pipeline 1: Top 10 High-Producing Crops Across India',
    description: 'Filter valid harvests, group by crop name, calculate sum of production and average yield, sort descending, and limit to top 10.',
    operationFocus: ['LOAD', 'FILTER', 'GROUP', 'FOREACH', 'ORDER BY', 'LIMIT', 'STORE'],
    rawScript: `agri_raw = LOAD 'agricultural_production.csv' USING PigStorage(',') AS (state:chararray, district:chararray, crop:chararray, crop_year:int, season:chararray, area:double, production:double, yield:double);
valid_data = FILTER agri_raw BY production > 0;
crop_grp = GROUP valid_data BY crop;
crop_metrics = FOREACH crop_grp GENERATE group AS crop, ROUND_TO(SUM(valid_data.production), 2) AS total_production, ROUND_TO(SUM(valid_data.area), 2) AS total_area, ROUND_TO(AVG(valid_data.yield), 2) AS avg_yield;
sorted_crops = ORDER crop_metrics BY total_production DESC;
top_10_crops = LIMIT sorted_crops 10;
DUMP top_10_crops;`
  },
  {
    id: 'script-state-ranking',
    title: 'Pipeline 2: State-wise Production & Productivity Ranking',
    description: 'Aggregate agricultural output by state, compute average yield efficiency, and rank states from highest to lowest producer.',
    operationFocus: ['LOAD', 'GROUP', 'FOREACH', 'ORDER BY'],
    rawScript: `agri_raw = LOAD 'agricultural_production.csv' USING PigStorage(',') AS (state:chararray, district:chararray, crop:chararray, crop_year:int, season:chararray, area:double, production:double, yield:double);
state_grp = GROUP agri_raw BY state;
state_summary = FOREACH state_grp GENERATE group AS state, ROUND_TO(SUM(agri_raw.production), 2) AS total_production, ROUND_TO(AVG(agri_raw.yield), 2) AS avg_yield, COUNT(agri_raw) AS num_records;
ranked_states = ORDER state_summary BY total_production DESC;
DUMP ranked_states;`
  },
  {
    id: 'script-season-kharif-rabi',
    title: 'Pipeline 3: Seasonal Agricultural Production Breakdown',
    description: 'Group crops by farming season (Kharif, Rabi, Summer, Whole Year) to compare harvest distribution and total land utilization.',
    operationFocus: ['LOAD', 'GROUP', 'FOREACH', 'ORDER BY'],
    rawScript: `agri_raw = LOAD 'agricultural_production.csv' USING PigStorage(',') AS (state:chararray, district:chararray, crop:chararray, crop_year:int, season:chararray, area:double, production:double, yield:double);
season_grp = GROUP agri_raw BY season;
season_analysis = FOREACH season_grp GENERATE group AS season, ROUND_TO(SUM(agri_raw.production), 2) AS season_production, ROUND_TO(SUM(agri_raw.area), 2) AS season_area, ROUND_TO(AVG(agri_raw.yield), 2) AS avg_yield;
sorted_seasons = ORDER season_analysis BY season_production DESC;
DUMP sorted_seasons;`
  },
  {
    id: 'script-join-agro-zones',
    title: 'Pipeline 4: JOIN Crop Production with State Agro-Climatic Zones',
    description: 'Demonstrate relational JOIN in Apache Pig by enriching state production aggregates with soil types, climate categories, and annual rainfall.',
    operationFocus: ['LOAD', 'GROUP', 'FOREACH', 'JOIN', 'ORDER BY'],
    rawScript: `agri_raw = LOAD 'agricultural_production.csv' USING PigStorage(',') AS (state:chararray, district:chararray, crop:chararray, crop_year:int, season:chararray, area:double, production:double, yield:double);
state_grp = GROUP agri_raw BY state;
state_prod = FOREACH state_grp GENERATE group AS state_name, ROUND_TO(SUM(agri_raw.production), 2) AS total_production, ROUND_TO(AVG(agri_raw.yield), 2) AS avg_yield;
state_zones = LOAD 'state_agro_zones.csv' USING PigStorage(',') AS (state:chararray, agro_zone:chararray, primary_soil:chararray, climate:chararray, avg_rainfall_mm:int);
joined_data = JOIN state_prod BY state_name, state_zones BY state;
enriched_results = FOREACH joined_data GENERATE state_prod::state_name AS state, state_zones::agro_zone AS agro_zone, state_zones::primary_soil AS soil_type, state_zones::climate AS climate, state_prod::total_production AS production, state_zones::avg_rainfall_mm AS rainfall_mm;
final_ordered = ORDER enriched_results BY production DESC;
DUMP final_ordered;`
  },
  {
    id: 'script-high-yield-filter',
    title: 'Pipeline 5: High-Yield Crop Outlier & Efficiency Filter (> 4.0 T/Ha)',
    description: 'Filter records with exceptionally high yield efficiency, such as sugarcane, potatoes, or advanced hybrid cereal crops.',
    operationFocus: ['LOAD', 'FILTER', 'GROUP', 'FOREACH', 'ORDER BY', 'LIMIT'],
    rawScript: `agri_raw = LOAD 'agricultural_production.csv' USING PigStorage(',') AS (state:chararray, district:chararray, crop:chararray, crop_year:int, season:chararray, area:double, production:double, yield:double);
high_yield_filter = FILTER agri_raw BY yield >= 4.0 AND production > 10000;
high_yield_grp = GROUP high_yield_filter BY crop;
crop_high_yield = FOREACH high_yield_grp GENERATE group AS crop, ROUND_TO(AVG(high_yield_filter.yield), 2) AS avg_yield, ROUND_TO(SUM(high_yield_filter.production), 2) AS total_prod, COUNT(high_yield_filter) AS count_occurrences;
sorted_yield = ORDER crop_high_yield BY avg_yield DESC;
top_yielders = LIMIT sorted_yield 10;
DUMP top_yielders;`
  }
];
