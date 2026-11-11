export interface AgriculturalRecord {
  id: string;
  state: string;
  district: string;
  crop: string;
  cropYear: number;
  season: 'Kharif' | 'Rabi' | 'Summer' | 'Whole Year';
  area: number; // in Hectares
  production: number; // in Metric Tonnes
  yield: number; // in Tonnes per Hectare (Production / Area)
}

export interface StateZoneInfo {
  state: string;
  agroZone: string;
  primarySoil: string;
  climate: string;
  avgRainfallMm: number;
}

export interface AgriculturalFilters {
  state: string;
  district: string;
  crop: string;
  year: string;
  season: string;
  searchQuery: string;
}

export interface PigOperation {
  id: string;
  name: string;
  keyword: 'LOAD' | 'FILTER' | 'GROUP' | 'FOREACH' | 'ORDER BY' | 'LIMIT' | 'JOIN' | 'STORE';
  title: string;
  shortDesc: string;
  pigScript: string;
  syntaxExplanation: string;
  mapReduceStage: 'Input / Split' | 'Map Phase' | 'Shuffle & Sort' | 'Reduce Phase' | 'Output Format';
  explanationPoints: string[];
  sampleOutputSchema: string;
}

export interface PigExecutionResult {
  scriptName: string;
  pigScript: string;
  status: 'SUCCESS' | 'RUNNING' | 'ERROR';
  executionTimeMs: number;
  inputRecordsCount: number;
  outputRecordsCount: number;
  logicalPlanSteps: string[];
  mapReduceJobsCount: number;
  schema: string[];
  rawTuples: string[];
  tableData: Record<string, any>[];
  logs: string[];
}

export interface SummaryAnalytics {
  totalProduction: number;
  totalArea: number;
  totalCrops: number;
  totalStates: number;
  totalDistricts: number;
  averageYield: number;
  highestProducingState: { state: string; production: number; sharePercent: number };
  mostProducedCrop: { crop: string; production: number; sharePercent: number };
  lowestProducedCrop: { crop: string; production: number };
  highestYieldCrop: { crop: string; yield: number };
  leastProductiveCrop: { crop: string; yield: number };
  dominantSeason: { season: string; production: number; percentage: number };
  yoyGrowthRate: number | null; // e.g. +4.2%
  yoyGrowthVolume: number | null; // in MT
  latestYear: number;
  previousYear: number | null;
  stateProductionMap: Record<string, { production: number; area: number; avgYield: number; topCrop: string; recordCount: number }>;
}

