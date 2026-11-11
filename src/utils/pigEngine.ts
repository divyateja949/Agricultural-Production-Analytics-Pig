import { AgriculturalRecord, PigExecutionResult } from '../types/agriculture';
import { STATE_ZONES_DATA } from '../data/stateZones';

export function executeSimulatedPigScript(
  scriptId: string,
  records: AgriculturalRecord[]
): PigExecutionResult {
  const startTime = performance.now();
  const inputCount = records.length;
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];

  let schema: string[] = [];
  let tableData: Record<string, any>[] = [];
  let rawTuples: string[] = [];
  let scriptName = 'Custom Pig Latin Execution';
  let executedScript = '';
  let mapReduceJobs = 1;
  let logicalPlanSteps: string[] = [
    'Logical Plan: (agri_raw -> FILTER -> GROUP -> FOREACH -> ORDER BY -> LIMIT)',
    'Type Checker: Validated schema against input relations',
    'MR Compiler: Partitioned into 2 MapReduce stages (Stage 1: Filter+Local Group, Stage 2: Global Sort)',
    'Hadoop Execution Mode: Simulated Local Pig Runner (Academic Demonstration)'
  ];

  if (scriptId === 'script-top10-crops' || scriptId.includes('top10') || scriptId === 'default') {
    scriptName = 'Pipeline 1: Top 10 High-Producing Crops';
    executedScript = `agri_raw = LOAD 'agricultural_production.csv' USING PigStorage(',') AS (state:chararray, district:chararray, crop:chararray, crop_year:int, season:chararray, area:double, production:double, yield:double);
valid_data = FILTER agri_raw BY production > 0;
crop_grp = GROUP valid_data BY crop;
crop_metrics = FOREACH crop_grp GENERATE group AS crop, ROUND_TO(SUM(valid_data.production), 2) AS total_production, ROUND_TO(SUM(valid_data.area), 2) AS total_area, ROUND_TO(AVG(valid_data.yield), 2) AS avg_yield;
sorted_crops = ORDER crop_metrics BY total_production DESC;
top_10_crops = LIMIT sorted_crops 10;
DUMP top_10_crops;`;

    // Perform actual in-memory Pig simulation
    const cropMap = new Map<string, { prod: number; area: number; yields: number[]; count: number }>();
    records.filter((r) => r.production > 0).forEach((r) => {
      const existing = cropMap.get(r.crop) || { prod: 0, area: 0, yields: [], count: 0 };
      existing.prod += r.production;
      existing.area += r.area;
      existing.yields.push(r.yield);
      existing.count += 1;
      cropMap.set(r.crop, existing);
    });

    const aggregated = Array.from(cropMap.entries()).map(([crop, val]) => {
      const avgYld = val.yields.length > 0 ? val.yields.reduce((a, b) => a + b, 0) / val.yields.length : 0;
      return {
        crop,
        total_production: Math.round(val.prod * 100) / 100,
        total_area: Math.round(val.area * 100) / 100,
        avg_yield: Math.round(avgYld * 100) / 100,
        records_count: val.count
      };
    });

    aggregated.sort((a, b) => b.total_production - a.total_production);
    tableData = aggregated.slice(0, 10);
    schema = ['crop (chararray)', 'total_production (double)', 'total_area (double)', 'avg_yield (double)', 'records_count (long)'];
    rawTuples = tableData.map(
      (r) => `(${r.crop}, ${r.total_production.toLocaleString()}, ${r.total_area.toLocaleString()}, ${r.avg_yield}, ${r.records_count})`
    );
    mapReduceJobs = 2;
  } else if (scriptId === 'script-state-ranking') {
    scriptName = 'Pipeline 2: State-wise Production & Productivity Ranking';
    executedScript = `agri_raw = LOAD 'agricultural_production.csv' USING PigStorage(',') AS (state:chararray, district:chararray, crop:chararray, crop_year:int, season:chararray, area:double, production:double, yield:double);
state_grp = GROUP agri_raw BY state;
state_summary = FOREACH state_grp GENERATE group AS state, ROUND_TO(SUM(agri_raw.production), 2) AS total_production, ROUND_TO(AVG(agri_raw.yield), 2) AS avg_yield, COUNT(agri_raw) AS num_records;
ranked_states = ORDER state_summary BY total_production DESC;
DUMP ranked_states;`;

    const stateMap = new Map<string, { prod: number; area: number; yields: number[]; count: number }>();
    records.forEach((r) => {
      const existing = stateMap.get(r.state) || { prod: 0, area: 0, yields: [], count: 0 };
      existing.prod += r.production;
      existing.area += r.area;
      existing.yields.push(r.yield);
      existing.count += 1;
      stateMap.set(r.state, existing);
    });

    const aggregated = Array.from(stateMap.entries()).map(([state, val]) => {
      const avgYld = val.yields.length > 0 ? val.yields.reduce((a, b) => a + b, 0) / val.yields.length : 0;
      return {
        state,
        total_production: Math.round(val.prod * 100) / 100,
        total_area: Math.round(val.area * 100) / 100,
        avg_yield: Math.round(avgYld * 100) / 100,
        num_records: val.count
      };
    });

    aggregated.sort((a, b) => b.total_production - a.total_production);
    tableData = aggregated;
    schema = ['state (chararray)', 'total_production (double)', 'total_area (double)', 'avg_yield (double)', 'num_records (long)'];
    rawTuples = tableData.map(
      (r) => `(${r.state}, ${r.total_production.toLocaleString()}, ${r.total_area.toLocaleString()}, ${r.avg_yield}, ${r.num_records})`
    );
    mapReduceJobs = 2;
  } else if (scriptId === 'script-season-kharif-rabi') {
    scriptName = 'Pipeline 3: Seasonal Agricultural Production Breakdown';
    executedScript = `agri_raw = LOAD 'agricultural_production.csv' USING PigStorage(',') AS (state:chararray, district:chararray, crop:chararray, crop_year:int, season:chararray, area:double, production:double, yield:double);
season_grp = GROUP agri_raw BY season;
season_analysis = FOREACH season_grp GENERATE group AS season, ROUND_TO(SUM(agri_raw.production), 2) AS season_production, ROUND_TO(SUM(agri_raw.area), 2) AS season_area, ROUND_TO(AVG(agri_raw.yield), 2) AS avg_yield;
sorted_seasons = ORDER season_analysis BY season_production DESC;
DUMP sorted_seasons;`;

    const seasonMap = new Map<string, { prod: number; area: number; yields: number[]; count: number }>();
    records.forEach((r) => {
      const existing = seasonMap.get(r.season) || { prod: 0, area: 0, yields: [], count: 0 };
      existing.prod += r.production;
      existing.area += r.area;
      existing.yields.push(r.yield);
      existing.count += 1;
      seasonMap.set(r.season, existing);
    });

    const aggregated = Array.from(seasonMap.entries()).map(([season, val]) => {
      const avgYld = val.yields.length > 0 ? val.yields.reduce((a, b) => a + b, 0) / val.yields.length : 0;
      return {
        season,
        season_production: Math.round(val.prod * 100) / 100,
        season_area: Math.round(val.area * 100) / 100,
        avg_yield: Math.round(avgYld * 100) / 100,
        records_count: val.count
      };
    });

    aggregated.sort((a, b) => b.season_production - a.season_production);
    tableData = aggregated;
    schema = ['season (chararray)', 'season_production (double)', 'season_area (double)', 'avg_yield (double)', 'records_count (long)'];
    rawTuples = tableData.map(
      (r) => `(${r.season}, ${r.season_production.toLocaleString()}, ${r.season_area.toLocaleString()}, ${r.avg_yield}, ${r.records_count})`
    );
    mapReduceJobs = 2;
  } else if (scriptId === 'script-join-agro-zones') {
    scriptName = 'Pipeline 4: JOIN Crop Production with State Agro-Climatic Zones';
    executedScript = `agri_raw = LOAD 'agricultural_production.csv' USING PigStorage(',') AS (state:chararray, district:chararray, crop:chararray, crop_year:int, season:chararray, area:double, production:double, yield:double);
state_grp = GROUP agri_raw BY state;
state_prod = FOREACH state_grp GENERATE group AS state_name, ROUND_TO(SUM(agri_raw.production), 2) AS total_production, ROUND_TO(AVG(agri_raw.yield), 2) AS avg_yield;
state_zones = LOAD 'state_agro_zones.csv' USING PigStorage(',') AS (state:chararray, agro_zone:chararray, primary_soil:chararray, climate:chararray, avg_rainfall_mm:int);
joined_data = JOIN state_prod BY state_name, state_zones BY state;
enriched_results = FOREACH joined_data GENERATE state_prod::state_name AS state, state_zones::agro_zone AS agro_zone, state_zones::primary_soil AS soil_type, state_zones::climate AS climate, state_prod::total_production AS production, state_zones::avg_rainfall_mm AS rainfall_mm;
final_ordered = ORDER enriched_results BY production DESC;
DUMP final_ordered;`;

    const stateMap = new Map<string, { prod: number; yields: number[] }>();
    records.forEach((r) => {
      const existing = stateMap.get(r.state) || { prod: 0, yields: [] };
      existing.prod += r.production;
      existing.yields.push(r.yield);
      stateMap.set(r.state, existing);
    });

    const joined: Record<string, any>[] = [];
    stateMap.forEach((val, state) => {
      const zoneInfo = STATE_ZONES_DATA.find((z) => z.state.toLowerCase() === state.toLowerCase()) || {
        agroZone: 'Regional Agricultural Zone',
        primarySoil: 'Alluvial Loam',
        climate: 'Sub-Humid',
        avgRainfallMm: 950
      };
      const avgYld = val.yields.reduce((a, b) => a + b, 0) / val.yields.length;
      joined.push({
        state,
        agro_zone: zoneInfo.agroZone,
        soil_type: zoneInfo.primarySoil,
        climate: zoneInfo.climate,
        production: Math.round(val.prod * 100) / 100,
        avg_yield: Math.round(avgYld * 100) / 100,
        rainfall_mm: zoneInfo.avgRainfallMm
      });
    });

    joined.sort((a, b) => b.production - a.production);
    tableData = joined;
    schema = ['state (chararray)', 'agro_zone (chararray)', 'soil_type (chararray)', 'climate (chararray)', 'production (double)', 'avg_yield (double)', 'rainfall_mm (int)'];
    rawTuples = tableData.map(
      (r) => `(${r.state}, ${r.agro_zone}, ${r.soil_type}, ${r.climate}, ${r.production.toLocaleString()}, ${r.avg_yield}, ${r.rainfall_mm}mm)`
    );
    mapReduceJobs = 3; // Aggregation MR + Hash Join MR + Global Sort MR
  } else if (scriptId === 'script-high-yield-filter') {
    scriptName = 'Pipeline 5: High-Yield Crop Outlier Filter (>= 4.0 T/Ha)';
    executedScript = `agri_raw = LOAD 'agricultural_production.csv' USING PigStorage(',') AS (state:chararray, district:chararray, crop:chararray, crop_year:int, season:chararray, area:double, production:double, yield:double);
high_yield_filter = FILTER agri_raw BY yield >= 4.0 AND production > 10000;
high_yield_grp = GROUP high_yield_filter BY crop;
crop_high_yield = FOREACH high_yield_grp GENERATE group AS crop, ROUND_TO(AVG(high_yield_filter.yield), 2) AS avg_yield, ROUND_TO(SUM(high_yield_filter.production), 2) AS total_prod, COUNT(high_yield_filter) AS count_occurrences;
sorted_yield = ORDER crop_high_yield BY avg_yield DESC;
top_yielders = LIMIT sorted_yield 10;
DUMP top_yielders;`;

    const cropMap = new Map<string, { yields: number[]; prod: number; count: number }>();
    records
      .filter((r) => r.yield >= 4.0 && r.production > 10000)
      .forEach((r) => {
        const existing = cropMap.get(r.crop) || { yields: [], prod: 0, count: 0 };
        existing.yields.push(r.yield);
        existing.prod += r.production;
        existing.count += 1;
        cropMap.set(r.crop, existing);
      });

    const aggregated = Array.from(cropMap.entries()).map(([crop, val]) => {
      const avgYld = val.yields.reduce((a, b) => a + b, 0) / val.yields.length;
      return {
        crop,
        avg_yield: Math.round(avgYld * 100) / 100,
        total_prod: Math.round(val.prod * 100) / 100,
        count_occurrences: val.count
      };
    });

    aggregated.sort((a, b) => b.avg_yield - a.avg_yield);
    tableData = aggregated.slice(0, 10);
    schema = ['crop (chararray)', 'avg_yield (double)', 'total_prod (double)', 'count_occurrences (long)'];
    rawTuples = tableData.map(
      (r) => `(${r.crop}, ${r.avg_yield}, ${r.total_prod.toLocaleString()}, ${r.count_occurrences})`
    );
    mapReduceJobs = 2;
  } else {
    // Generic fallback for any arbitrary custom script
    scriptName = 'Custom Pig Latin Pipeline';
    executedScript = `agri_raw = LOAD 'agricultural_production.csv' ...; DUMP results;`;
    tableData = records.slice(0, 15).map((r) => ({
      crop: r.crop,
      state: r.state,
      year: r.cropYear,
      production: r.production,
      yield: r.yield
    }));
    schema = ['crop (chararray)', 'state (chararray)', 'year (int)', 'production (double)', 'yield (double)'];
    rawTuples = tableData.map((r) => `(${r.crop}, ${r.state}, ${r.year}, ${r.production}, ${r.yield})`);
  }

  const duration = Math.round(performance.now() - startTime + Math.random() * 25 + 15);

  const logs = [
    `[${timeStr}] INFO  org.apache.pig.Main - Apache Pig version 0.17.0 (Simulated Execution Engine)`,
    `[${timeStr}] INFO  org.apache.pig.backend.hadoop.executionengine.HExecutionEngine - Connecting to simulated HDFS cluster`,
    `[${timeStr}] INFO  org.apache.pig.parser.QueryParserDriver - Parsing script into Abstract Syntax Tree (AST)`,
    `[${timeStr}] INFO  org.apache.pig.newplan.logical.optimizer.LogicalPlanOptimizer - Applying rule: FilterLogicOptimizer`,
    `[${timeStr}] INFO  org.apache.pig.newplan.logical.optimizer.LogicalPlanOptimizer - Applying rule: ColumnPruner (Push project down to Map)`,
    `[${timeStr}] INFO  org.apache.pig.backend.hadoop.executionengine.mapReduceLayer.MRCompiler - Compiled into ${mapReduceJobs} MapReduce job(s)`,
    `[${timeStr}] INFO  org.apache.hadoop.mapreduce.Job - Job job_pig_agri_00${Math.floor(Math.random() * 899 + 100)} submitted`,
    `[${timeStr}] INFO  org.apache.hadoop.mapreduce.Job - Map 100% Reduce 100% completed in ${(duration / 1000).toFixed(2)}s`,
    `[${timeStr}] INFO  org.apache.pig.backend.hadoop.executionengine.mapReduceLayer.MapReduceLauncher - Input records read: ${inputCount}`,
    `[${timeStr}] INFO  org.apache.pig.backend.hadoop.executionengine.mapReduceLayer.MapReduceLauncher - Output records produced: ${tableData.length}`,
    `[${timeStr}] INFO  org.apache.pig.Main - Success! DUMP returned ${tableData.length} relation tuples.`
  ];

  return {
    scriptName,
    pigScript: executedScript,
    status: 'SUCCESS',
    executionTimeMs: duration,
    inputRecordsCount: inputCount,
    outputRecordsCount: tableData.length,
    logicalPlanSteps,
    mapReduceJobsCount: mapReduceJobs,
    schema,
    rawTuples,
    tableData,
    logs
  };
}
