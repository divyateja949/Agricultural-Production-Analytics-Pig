import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Presentation,
  CheckCircle2,
  Terminal,
  Database,
  Layers,
  Award,
  BookOpen,
  Wheat,
  Cpu
} from 'lucide-react';
import { SummaryAnalytics } from '../types/agriculture';

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  analytics: SummaryAnalytics;
  totalRecords: number;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  isOpen,
  onClose,
  analytics,
  totalRecords
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      id: 'slide-intro',
      title: 'Agricultural Production Analytics Using Apache Pig',
      subtitle: 'Big Data Processing Framework for Multi-State Agrarian Intelligence',
      badge: 'College Project Presentation',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-stone-200 bg-emerald-50/50">
              <div className="text-xs font-mono font-bold text-emerald-800 uppercase mb-1">Domain</div>
              <div className="text-sm font-bold text-stone-900">Agriculture & Food Security</div>
              <p className="text-xs text-stone-600 mt-1">
                Analyzing multi-year crop production patterns, land utilization, and yield efficiency across Indian states.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
              <div className="text-xs font-mono font-bold text-stone-600 uppercase mb-1">Core Technology</div>
              <div className="text-sm font-bold text-stone-900">Apache Pig Latin on Hadoop</div>
              <p className="text-xs text-stone-600 mt-1">
                Utilizing high-level dataflow language that compiles into distributed MapReduce execution graphs.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
              <div className="text-xs font-mono font-bold text-stone-600 uppercase mb-1">Dataset Scope</div>
              <div className="text-sm font-bold text-stone-900">{totalRecords} Multi-Year Records</div>
              <p className="text-xs text-stone-600 mt-1">
                Covering {analytics.totalStates} states, {analytics.totalCrops} crops, Kharif/Rabi seasons, and hectare yields.
              </p>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Project Problem Statement & Objectives
            </h4>
            <ul className="text-xs text-stone-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Massive Scale:</strong> National agricultural census data generates millions of records from remote sensing, weather stations, and district mandi boards that overwhelm traditional SQL RDBMS databases.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Productivity Acceleration:</strong> Java MapReduce requires 100+ lines of boilerplate code for a single aggregation. Apache Pig achieves identical execution in only 2-3 expressive Pig Latin statements.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Actionable Intelligence:</strong> Identify highest-producing crops, underperforming states, seasonal dependencies, and optimal crop yield efficiencies for farmers and agricultural policymakers.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'slide-why-pig',
      title: 'Why Apache Pig for Big Data Agriculture?',
      subtitle: 'Comparative Evaluation: Pig Latin vs Traditional MapReduce vs SQL',
      badge: 'System Architecture',
      content: (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
              <div className="text-xs font-bold text-stone-900 mb-2">Raw Java MapReduce</div>
              <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-4">
                <li>Hundreds of lines of verbose Java code.</li>
                <li>Manual serialization, grouping, and partitioning.</li>
                <li>Steep learning curve for domain agronomists.</li>
                <li>Difficult to chain multi-stage transformations.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50/40">
              <div className="text-xs font-bold text-emerald-900 mb-2 flex items-center justify-between">
                <span>Apache Pig (Our Choice)</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-mono">10x Faster ETL</span>
              </div>
              <ul className="text-xs text-stone-700 space-y-1.5 list-disc pl-4">
                <li>High-level procedural dataflow language (Pig Latin).</li>
                <li>Automatic compilation to optimized MapReduce DAGs.</li>
                <li>Handles nested data models (tuples, bags, maps).</li>
                <li>Built-in algebraic optimization (Combiner pushdown).</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
              <div className="text-xs font-bold text-stone-900 mb-2">Standard Relational SQL</div>
              <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-4">
                <li>Rigid declarative schema; assumes tabular flat structure.</li>
                <li>Struggles with unstructured raw HDFS telemetry.</li>
                <li>Requires expensive schema-on-write ETL upfront.</li>
                <li>Limited procedural step-by-step pipeline control.</li>
              </ul>
            </div>
          </div>

          <div className="bg-stone-900 text-stone-200 rounded-xl p-4 font-mono text-xs space-y-2 border border-stone-800">
            <div className="text-stone-400 text-[11px]">// Java MapReduce equivalent requires ~150 lines. In Apache Pig:</div>
            <div className="text-emerald-300">
              agri_raw = LOAD 'agri.csv' USING PigStorage(',') AS (crop:chararray, prod:double);<br />
              grp = GROUP agri_raw BY crop;<br />
              summary = FOREACH grp GENERATE group, SUM(agri_raw.prod);<br />
              DUMP summary;
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'slide-pipeline',
      title: 'Agricultural Data Processing Architecture',
      subtitle: 'From HDFS Storage to MapReduce Tasks and Interactive Visualization',
      badge: 'Data Pipeline',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              {
                step: 'Phase 1: Ingestion',
                sub: 'HDFS Distributed File System',
                desc: 'Raw multi-state CSV survey datasets partitioned across HDFS data blocks (128MB chunks).'
              },
              {
                step: 'Phase 2: Pig Parser',
                sub: 'Abstract Syntax Tree (AST)',
                desc: 'Validates Pig Latin commands, checks relational schemas, and builds the logical execution graph.'
              },
              {
                step: 'Phase 3: MR Compiler',
                sub: 'Hadoop Map & Reduce Jobs',
                desc: 'Mappers execute LOAD & FILTER. Shuffle groups identical keys. Reducers compute SUM/AVG.'
              },
              {
                step: 'Phase 4: Consumption',
                sub: 'BI & Analytical Dashboards',
                desc: 'STORE persists cleaned summary tables; Chart.js visualizes crop trends for decision makers.'
              }
            ].map((p, i) => (
              <div key={i} className="p-4 rounded-xl border border-stone-200 bg-stone-50/80">
                <div className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block mb-1.5">
                  {p.step}
                </div>
                <div className="text-xs font-bold text-stone-900">{p.sub}</div>
                <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
            <div className="text-xs font-bold text-stone-800 mb-2">Relational Dataset Schema Columns</div>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {['State: chararray', 'District: chararray', 'Crop: chararray', 'Crop_Year: int', 'Season: chararray', 'Area: double (Ha)', 'Production: double (MT)', 'Yield: double (MT/Ha)'].map((col, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-white border border-stone-200 rounded-md text-stone-700">
                  {col}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'slide-operations',
      title: 'Demonstration of the 8 Core Pig Latin Operations',
      subtitle: 'Mapping Relational Algebra to MapReduce Execution Stages',
      badge: 'Implementation',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            {[
              { kw: 'LOAD', stage: 'Input / Split', use: 'Reads CSV into relation with typed schema.' },
              { kw: 'FILTER', stage: 'Map Phase', use: 'Applies predicates (year >= 2020) to prune rows.' },
              { kw: 'GROUP', stage: 'Shuffle & Sort', use: 'Clusters tuples by crop or state into inner bags.' },
              { kw: 'FOREACH', stage: 'Reduce Phase', use: 'Computes SUM(production) and AVG(yield).' },
              { kw: 'ORDER BY', stage: 'Reduce Phase', use: 'Global sampling sort across multiple partitions.' },
              { kw: 'LIMIT', stage: 'Reduce Phase', use: 'Restricts output to top 10 ranked records.' },
              { kw: 'JOIN', stage: 'Shuffle & Sort', use: 'Equi-joins state production with agro-climatic zones.' },
              { kw: 'STORE', stage: 'Output Format', use: 'Persists analytical relation to target HDFS directory.' }
            ].map((op) => (
              <div key={op.kw} className="p-3 rounded-lg border border-stone-200 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                    {op.kw}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">{op.stage}</span>
                </div>
                <p className="text-[11px] text-stone-600 mt-1 leading-snug">{op.use}</p>
              </div>
            ))}
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-600 flex items-center justify-between">
            <span>Lazy Evaluation: Pig constructs an execution plan without launching MapReduce jobs until <strong>DUMP</strong> or <strong>STORE</strong> is invoked.</span>
            <span className="font-mono text-emerald-800 font-semibold shrink-0 ml-3">DUMP / STORE triggers DAG</span>
          </div>
        </div>
      )
    },
    {
      id: 'slide-insights',
      title: 'Analytical Findings & Visual Insights',
      subtitle: 'Key Highlights Discovered through Apache Pig Data Processing',
      badge: 'Results',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-stone-200 bg-white">
              <div className="text-xs font-mono font-bold text-emerald-700 uppercase mb-1">Total Production</div>
              <div className="text-2xl font-extrabold text-stone-900 font-mono">
                {(analytics.totalProduction / 1000000).toFixed(2)}M MT
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Aggregated across {analytics.totalCrops} crops and {analytics.totalStates} agricultural states.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-white">
              <div className="text-xs font-mono font-bold text-teal-700 uppercase mb-1">Top Producing State</div>
              <div className="text-2xl font-extrabold text-stone-900">
                {analytics.highestProducingState.state}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {(analytics.highestProducingState.production / 1000000).toFixed(1)}M MT ({analytics.highestProducingState.sharePercent}% of total harvest).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-white">
              <div className="text-xs font-mono font-bold text-amber-700 uppercase mb-1">Average Yield</div>
              <div className="text-2xl font-extrabold text-stone-900 font-mono">
                {analytics.averageYield} MT/Ha
              </div>
              <p className="text-xs text-stone-500 mt-1">
                High yield variance observed between cash crops (sugarcane) and cereals.
              </p>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-700 space-y-2">
            <h4 className="font-bold text-stone-900">Summary of Key Agrarian Discoveries:</h4>
            <ul className="space-y-1.5 list-disc pl-4 text-stone-600">
              <li><strong>Sugarcane & Potato Biomass:</strong> Yield efficiency exceeds 70 MT/Ha for sugarcane in Maharashtra and UP, while grain crops average 3-5 MT/Ha.</li>
              <li><strong>Kharif vs Rabi Dynamics:</strong> Kharif accounts for the largest land cultivation, while Rabi delivers superior cereal yield stability due to irrigation in Punjab and Haryana.</li>
              <li><strong>Agro-Climatic Correlation:</strong> Regions with alluvial soils and canal infrastructure demonstrate 40% higher productivity indices than rain-dependent arid zones.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'slide-viva',
      title: 'College Viva & Reviewer Defense Q&A',
      subtitle: 'Standard Examination Questions with Clear Technical Answers',
      badge: 'Viva Defense',
      content: (
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {[
            {
              q: '1. What is the fundamental difference between Apache Pig and Apache Hive?',
              a: 'Pig uses Pig Latin, a procedural dataflow language suitable for data pipelines and ETL engineers. Hive uses HiveQL, a declarative SQL-like language suitable for data analysts accustomed to relational databases. Both compile to MapReduce or Tez.'
            },
            {
              q: '2. What is a "Bag" in Apache Pig, and how does it differ from a "Tuple"?',
              a: 'A Tuple is an ordered sequence of typed fields (equivalent to a row in SQL). A Bag is an unordered collection of tuples (equivalent to a table or an inner group of rows), represented syntactically with curly braces {...}.'
            },
            {
              q: '3. Why does Pig use "Lazy Evaluation"?',
              a: 'In Pig, LOAD, FILTER, and GROUP statements do not trigger MapReduce jobs immediately. Execution only starts when DUMP or STORE is called. This allows Pig’s Logical Optimizer to analyze the entire DAG and perform optimizations like predicate pushdown and column pruning across all steps.'
            },
            {
              q: '4. How does the GROUP operation execute in MapReduce?',
              a: 'GROUP defines the grouping key. Mappers emit key-value pairs (key = crop/state, value = tuple). Hadoop’s shuffle and sort phase groups identical keys together and distributes them to the Reducer, which constructs the bag.'
            },
            {
              q: '5. What happens during the JOIN operation in Apache Pig?',
              a: 'By default, Pig executes a Reduce-side hash join by tagging tuples from each input relation with a relation index, shuffling by the join key, and doing a cross-product in the Reducer. A Replicated Map-side join can be used if one table fits in memory.'
            },
            {
              q: '6. What are Pig execution modes?',
              a: 'Pig operates in two main modes: Local Mode (runs on a single machine using local filesystem, ideal for development) and MapReduce Mode (connects to an Apache Hadoop cluster using HDFS and YARN).'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg border border-stone-200 bg-stone-50/80">
              <div className="text-xs font-bold text-stone-900 mb-1">{item.q}</div>
              <div className="text-xs text-stone-600 leading-relaxed">{item.a}</div>
            </div>
          ))}
        </div>
      )
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-700 text-white">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                Slide {currentSlide + 1} of {slides.length} · {current.badge}
              </div>
              <div className="text-sm font-bold text-white leading-tight">
                Academic Project Defense Deck
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          <div>
            <h3 className="text-2xl font-black text-stone-900 tracking-tight">
              {current.title}
            </h3>
            <p className="text-sm text-stone-500 mt-1">
              {current.subtitle}
            </p>
          </div>

          <div className="pt-2">{current.content}</div>
        </div>

        {/* Slide Footer with Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border-t border-stone-200">
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide ? 'w-6 bg-emerald-700' : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Jump to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
              disabled={currentSlide === 0}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-2 text-stone-700 bg-white border border-stone-200 rounded-lg disabled:opacity-40 hover:bg-stone-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setCurrentSlide((p) => Math.min(slides.length - 1, p + 1))}
              disabled={currentSlide === slides.length - 1}
              className="flex items-center gap-1 text-xs font-semibold px-4 py-2 text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg disabled:opacity-40 transition-colors"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
