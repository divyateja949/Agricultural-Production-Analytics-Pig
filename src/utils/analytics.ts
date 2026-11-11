import { AgriculturalRecord, SummaryAnalytics } from '../types/agriculture';

export function calculateSummaryAnalytics(records: AgriculturalRecord[]): SummaryAnalytics {
  if (records.length === 0) {
    return {
      totalProduction: 0,
      totalArea: 0,
      totalCrops: 0,
      totalStates: 0,
      totalDistricts: 0,
      averageYield: 0,
      highestProducingState: { state: 'N/A', production: 0, sharePercent: 0 },
      mostProducedCrop: { crop: 'N/A', production: 0, sharePercent: 0 },
      lowestProducedCrop: { crop: 'N/A', production: 0 },
      highestYieldCrop: { crop: 'N/A', yield: 0 },
      leastProductiveCrop: { crop: 'N/A', yield: 0 },
      dominantSeason: { season: 'N/A', production: 0, percentage: 0 },
      yoyGrowthRate: null,
      yoyGrowthVolume: null,
      latestYear: new Date().getFullYear(),
      previousYear: null,
      stateProductionMap: {}
    };
  }

  const totalProduction = records.reduce((sum, r) => sum + r.production, 0);
  const totalArea = records.reduce((sum, r) => sum + r.area, 0);
  const averageYield = totalArea > 0 ? totalProduction / totalArea : 0;

  const uniqueCrops = new Set(records.map((r) => r.crop));
  const uniqueStates = new Set(records.map((r) => r.state));
  const uniqueDistricts = new Set(records.map((r) => `${r.state}-${r.district}`));

  // State-wise production
  const stateProdMap = new Map<string, number>();
  records.forEach((r) => {
    stateProdMap.set(r.state, (stateProdMap.get(r.state) || 0) + r.production);
  });

  let maxState = 'N/A';
  let maxStateProd = 0;
  stateProdMap.forEach((prod, state) => {
    if (prod > maxStateProd) {
      maxStateProd = prod;
      maxState = state;
    }
  });

  // Crop-wise production & yield
  const cropProdMap = new Map<string, number>();
  const cropYieldMap = new Map<string, { totalYield: number; count: number }>();
  records.forEach((r) => {
    cropProdMap.set(r.crop, (cropProdMap.get(r.crop) || 0) + r.production);
    const existing = cropYieldMap.get(r.crop) || { totalYield: 0, count: 0 };
    existing.totalYield += r.yield;
    existing.count += 1;
    cropYieldMap.set(r.crop, existing);
  });

  let mostCrop = 'N/A';
  let maxCropProd = 0;
  let leastCrop = 'N/A';
  let minCropProd = Infinity;

  cropProdMap.forEach((prod, crop) => {
    if (prod > maxCropProd) {
      maxCropProd = prod;
      mostCrop = crop;
    }
    if (prod < minCropProd) {
      minCropProd = prod;
      leastCrop = crop;
    }
  });

  let highestYieldCrop = 'N/A';
  let maxYield = 0;
  cropYieldMap.forEach((val, crop) => {
    const avg = val.count > 0 ? val.totalYield / val.count : 0;
    if (avg > maxYield) {
      maxYield = avg;
      highestYieldCrop = crop;
    }
  });

  // Season-wise production
  const seasonMap = new Map<string, number>();
  records.forEach((r) => {
    seasonMap.set(r.season, (seasonMap.get(r.season) || 0) + r.production);
  });

  let dominantSeason = 'Kharif';
  let maxSeasonProd = 0;
  seasonMap.forEach((prod, season) => {
    if (prod > maxSeasonProd) {
      maxSeasonProd = prod;
      dominantSeason = season;
    }
  });

  // State-wise detailed map aggregation
  const stateDetails: Record<string, { production: number; area: number; totalYield: number; topCrop: string; recordCount: number; cropsMap: Map<string, number> }> = {};
  records.forEach((r) => {
    if (!stateDetails[r.state]) {
      stateDetails[r.state] = {
        production: 0,
        area: 0,
        totalYield: 0,
        topCrop: r.crop,
        recordCount: 0,
        cropsMap: new Map()
      };
    }
    const sd = stateDetails[r.state];
    sd.production += r.production;
    sd.area += r.area;
    sd.totalYield += r.yield;
    sd.recordCount += 1;
    sd.cropsMap.set(r.crop, (sd.cropsMap.get(r.crop) || 0) + r.production);
  });

  const stateProductionMap: Record<string, { production: number; area: number; avgYield: number; topCrop: string; recordCount: number }> = {};
  Object.entries(stateDetails).forEach(([st, data]) => {
    let topC = '';
    let topCProd = 0;
    data.cropsMap.forEach((p, c) => {
      if (p > topCProd) {
        topCProd = p;
        topC = c;
      }
    });
    stateProductionMap[st] = {
      production: data.production,
      area: data.area,
      avgYield: data.area > 0 ? Math.round((data.production / data.area) * 100) / 100 : Math.round((data.totalYield / data.recordCount) * 100) / 100,
      topCrop: topC || 'N/A',
      recordCount: data.recordCount
    };
  });

  // Least productive crop by yield
  let minYieldCrop = 'N/A';
  let minYield = Infinity;
  cropYieldMap.forEach((val, crop) => {
    const avg = val.count > 0 ? val.totalYield / val.count : 0;
    if (avg < minYield && avg > 0) {
      minYield = avg;
      minYieldCrop = crop;
    }
  });

  // Calculate Year-over-Year (YoY) Growth for latest years
  const yearProductionMap = new Map<number, number>();
  records.forEach((r) => {
    yearProductionMap.set(r.cropYear, (yearProductionMap.get(r.cropYear) || 0) + r.production);
  });

  const sortedYears = Array.from(yearProductionMap.keys()).sort((a, b) => a - b);
  const latestYear = sortedYears.length > 0 ? sortedYears[sortedYears.length - 1] : new Date().getFullYear();
  let previousYear: number | null = null;
  let yoyGrowthRate: number | null = null;
  let yoyGrowthVolume: number | null = null;

  if (sortedYears.length >= 2) {
    previousYear = sortedYears[sortedYears.length - 2];
    const latestProd = yearProductionMap.get(latestYear) || 0;
    const prevProd = yearProductionMap.get(previousYear) || 0;
    if (prevProd > 0) {
      yoyGrowthVolume = latestProd - prevProd;
      yoyGrowthRate = Math.round(((latestProd - prevProd) / prevProd) * 1000) / 10;
    }
  }

  return {
    totalProduction,
    totalArea,
    totalCrops: uniqueCrops.size,
    totalStates: uniqueStates.size,
    totalDistricts: uniqueDistricts.size,
    averageYield: Math.round(averageYield * 100) / 100,
    highestProducingState: {
      state: maxState,
      production: maxStateProd,
      sharePercent: totalProduction > 0 ? Math.round((maxStateProd / totalProduction) * 1000) / 10 : 0
    },
    mostProducedCrop: {
      crop: mostCrop,
      production: maxCropProd,
      sharePercent: totalProduction > 0 ? Math.round((maxCropProd / totalProduction) * 1000) / 10 : 0
    },
    lowestProducedCrop: {
      crop: leastCrop,
      production: minCropProd === Infinity ? 0 : minCropProd
    },
    highestYieldCrop: {
      crop: highestYieldCrop,
      yield: Math.round(maxYield * 100) / 100
    },
    leastProductiveCrop: {
      crop: minYieldCrop === 'N/A' ? leastCrop : minYieldCrop,
      yield: minYield === Infinity ? 0 : Math.round(minYield * 100) / 100
    },
    dominantSeason: {
      season: dominantSeason,
      production: maxSeasonProd,
      percentage: totalProduction > 0 ? Math.round((maxSeasonProd / totalProduction) * 1000) / 10 : 0
    },
    yoyGrowthRate,
    yoyGrowthVolume,
    latestYear,
    previousYear,
    stateProductionMap
  };
}

// Chart aggregators
export function getCropProductionChartData(records: AgriculturalRecord[]) {
  const map = new Map<string, number>();
  records.forEach((r) => {
    map.set(r.crop, (map.get(r.crop) || 0) + r.production);
  });

  const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  return {
    labels: sorted.map((s) => s[0]),
    values: sorted.map((s) => s[1])
  };
}

export function getCropDistributionChartData(records: AgriculturalRecord[]) {
  const map = new Map<string, number>();
  records.forEach((r) => {
    map.set(r.crop, (map.get(r.crop) || 0) + r.production);
  });

  const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  const top6 = sorted.slice(0, 6);
  const otherSum = sorted.slice(6).reduce((acc, curr) => acc + curr[1], 0);

  const labels = top6.map((s) => s[0]);
  const values = top6.map((s) => s[1]);

  if (otherSum > 0) {
    labels.push('Other Crops');
    values.push(otherSum);
  }

  return { labels, values };
}

export function getYearlyTrendChartData(records: AgriculturalRecord[]) {
  const map = new Map<number, { production: number; area: number }>();
  records.forEach((r) => {
    const existing = map.get(r.cropYear) || { production: 0, area: 0 };
    existing.production += r.production;
    existing.area += r.area;
    map.set(r.cropYear, existing);
  });

  const years = Array.from(map.keys()).sort((a, b) => a - b);
  return {
    years: years.map((y) => y.toString()),
    productions: years.map((y) => map.get(y)?.production || 0),
    areas: years.map((y) => map.get(y)?.area || 0)
  };
}

export function getStateProductionChartData(records: AgriculturalRecord[]) {
  const map = new Map<string, number>();
  records.forEach((r) => {
    map.set(r.state, (map.get(r.state) || 0) + r.production);
  });

  const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  return {
    states: sorted.map((s) => s[0]),
    productions: sorted.map((s) => s[1])
  };
}

export function getAreaVsProductionScatterData(records: AgriculturalRecord[]) {
  return records.slice(0, 100).map((r) => ({
    x: r.area, // Hectares
    y: r.production, // Tonnes
    crop: r.crop,
    state: r.state,
    yield: r.yield
  }));
}

export function getTop10CropsData(records: AgriculturalRecord[]) {
  const map = new Map<string, { production: number; avgYield: number; count: number }>();
  records.forEach((r) => {
    const curr = map.get(r.crop) || { production: 0, avgYield: 0, count: 0 };
    curr.production += r.production;
    curr.avgYield += r.yield;
    curr.count += 1;
    map.set(r.crop, curr);
  });

  const sorted = Array.from(map.entries())
    .map(([crop, data]) => ({
      crop,
      production: data.production,
      avgYield: Math.round((data.avgYield / data.count) * 100) / 100
    }))
    .sort((a, b) => b.production - a.production)
    .slice(0, 10);

  return sorted;
}

export function getSeasonalAnalysis(records: AgriculturalRecord[]) {
  const seasons: Record<string, { production: number; area: number; count: number; crops: Set<string> }> = {
    Kharif: { production: 0, area: 0, count: 0, crops: new Set() },
    Rabi: { production: 0, area: 0, count: 0, crops: new Set() },
    Summer: { production: 0, area: 0, count: 0, crops: new Set() },
    'Whole Year': { production: 0, area: 0, count: 0, crops: new Set() }
  };

  records.forEach((r) => {
    if (seasons[r.season]) {
      seasons[r.season].production += r.production;
      seasons[r.season].area += r.area;
      seasons[r.season].count += 1;
      seasons[r.season].crops.add(r.crop);
    }
  });

  return Object.entries(seasons).map(([season, data]) => ({
    season,
    production: data.production,
    area: data.area,
    avgYield: data.area > 0 ? Math.round((data.production / data.area) * 100) / 100 : 0,
    recordsCount: data.count,
    cropsCount: data.crops.size
  }));
}

export function exportRecordsToCsv(records: AgriculturalRecord[], filename = 'agricultural_analytics_export.csv') {
  const headers = 'State,District,Crop,Crop Year,Season,Area,Production,Yield\n';
  const csvContent =
    headers +
    records
      .map(
        (r) =>
          `"${r.state}","${r.district}","${r.crop}",${r.cropYear},"${r.season}",${r.area},${r.production},${r.yield}`
      )
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
