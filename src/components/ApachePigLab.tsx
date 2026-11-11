import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Copy,
  Check,
  Download,
  Info,
  Layers,
  ArrowRight,
  Database,
  Cpu,
  FileCode,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { AgriculturalRecord, PigOperation, PigExecutionResult } from '../types/agriculture';
import { PIG_OPERATIONS, PRESET_PIG_SCRIPTS } from '../data/pigScripts';
import { executeSimulatedPigScript } from '../utils/pigEngine';

interface ApachePigLabProps {
  records: AgriculturalRecord[];
}

export const ApachePigLab: React.FC<ApachePigLabProps> = ({ records }) => {
  const [selectedOp, setSelectedOp] = useState<PigOperation>(PIG_OPERATIONS[0]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('script-top10-crops');
  const [customScriptText, setCustomScriptText] = useState<string>(PRESET_PIG_SCRIPTS[0].rawScript);
  const [executionResult, setExecutionResult] = useState<PigExecutionResult>(() =>
    executeSimulatedPigScript('script-top10-crops', records)
  );
  const [activeView, setActiveView] = useState<'operations' | 'runner' | 'architecture'>('operations');
  const [resultDisplayMode, setResultDisplayMode] = useState<'tuples' | 'table' | 'logs' | 'input'>('tuples');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const found = PRESET_PIG_SCRIPTS.find((s) => s.id === id);
    if (found) {
      setCustomScriptText(found.rawScript);
      const res = executeSimulatedPigScript(id, records);
      setExecutionResult(res);
    }
  };

  const handleRunScript = () => {
    const res = executeSimulatedPigScript(selectedPresetId, records);
    setExecutionResult(res);
  };

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleDownloadPigFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pig`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Academic Notice */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-700 text-white">
                <Terminal className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                Apache Pig Analytics & MapReduce Engine
              </h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Interactive demonstration of Apache Pig data processing, Pig Latin syntax, and DAG translation for agricultural analytics.
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs font-medium self-start md:self-auto">
            <button
              onClick={() => setActiveView('operations')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeView === 'operations'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>8 Core Operations</span>
            </button>
            <button
              onClick={() => setActiveView('runner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeView === 'runner'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Interactive Pig Runner</span>
            </button>
            <button
              onClick={() => setActiveView('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeView === 'architecture'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Architecture & DAG</span>
            </button>
          </div>
        </div>

        {/* Clear Project Honesty / Academic Notice */}
        <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 rounded-lg flex items-start gap-2.5 text-xs text-stone-600 dark:text-stone-300">
          <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-stone-800 dark:text-stone-200">Academic Project Context:</strong> In a production cluster, Apache Pig scripts compile into directed acyclic graphs (DAG) of Java MapReduce jobs submitted to Apache Hadoop YARN. This application provides real, verified Pig Latin scripts alongside client-side simulated MapReduce execution against the active agricultural dataset to illustrate tuple transformations and relational algebra without requiring a live Hadoop daemon.
          </div>
        </div>
      </div>

      {/* VIEW 1: 8 Core Operations Deep Dive */}
      {activeView === 'operations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Operation Selector List (Left Column) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 px-1 mb-2">
              Pig Latin Operators ({PIG_OPERATIONS.length})
            </div>
            {PIG_OPERATIONS.map((op, idx) => {
              const isSelected = selectedOp.id === op.id;
              return (
                <button
                  key={op.id}
                  onClick={() => setSelectedOp(op)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-600 shadow-xs'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      {op.keyword}
                    </span>
                    <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                      {op.mapReduceStage}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-1">
                    {idx + 1}. {op.name}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                    {op.shortDesc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Operation Detailed Content (Right Column) */}
          <div className="lg:col-span-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono text-xs font-semibold">
                  <span>Hadoop MapReduce Stage:</span>
                  <span className="text-emerald-800 dark:text-emerald-400 font-bold">{selectedOp.mapReduceStage}</span>
                </span>
                <button
                  onClick={() => handleDownloadPigFile(selectedOp.keyword.toLowerCase(), selectedOp.pigScript)}
                  className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .pig Script</span>
                </button>
              </div>

              <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
                {selectedOp.title}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                {selectedOp.shortDesc}
              </p>
            </div>

            {/* Script Display Card */}
            <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950 text-stone-100">
              <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900 border-b border-stone-800 text-xs text-stone-400 font-mono">
                <span className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedOp.keyword.toLowerCase()}_agricultural_operation.pig</span>
                </span>
                <button
                  onClick={() => handleCopyScript(selectedOp.pigScript)}
                  className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors"
                >
                  {copiedScript ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Script</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-300/90 leading-relaxed selection:bg-emerald-900">
                {selectedOp.pigScript}
              </pre>
            </div>

            {/* Syntax Explanation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                Syntax & Relational Algebra Explanation
              </h4>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-lg border border-stone-200 dark:border-stone-700">
                {selectedOp.syntaxExplanation}
              </p>
            </div>

            {/* Key Explanation Points */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2.5">
                Distributed MapReduce Execution Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {selectedOp.explanationPoints.map((pt, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-start gap-2.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Relation Output Schema */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Generated Relation Schema (Pig Bags & Tuples)
              </h4>
              <div className="bg-stone-900 text-stone-300 font-mono text-xs p-3 rounded-lg overflow-x-auto border border-stone-800">
                {selectedOp.sampleOutputSchema}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Interactive Pig Script Execution Playground */}
      {activeView === 'runner' && (
        <div className="space-y-6">
          {/* Preset Pipeline Selector */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3">
              Select Pre-Configured Academic Pipeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESET_PIG_SCRIPTS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-600 ring-1 ring-emerald-600/30'
                        : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-snug">
                      {preset.title}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                      {preset.description}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap mt-2.5">
                      {preset.operationFocus.map((kw) => (
                        <span
                          key={kw}
                          className="font-mono text-[10px] px-1.5 py-0.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded text-stone-600 dark:text-stone-300"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Script Editor & Controls */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Pig Latin Pipeline Editor
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Review or edit the Pig Latin statements executed on the active dataset
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPigFile('agricultural_pipeline', customScriptText)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .pig</span>
                </button>
                <button
                  onClick={handleRunScript}
                  className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Pipeline</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950 text-stone-100 font-mono text-xs">
              <div className="flex items-center justify-between px-4 py-2 bg-stone-900 border-b border-stone-800 text-stone-400 text-xs">
                <span>Pig Latin Script Buffer</span>
                <span className="text-[11px] text-emerald-400 font-sans">
                  Active Dataset: {records.length} records in HDFS / CSV
                </span>
              </div>
              <textarea
                value={customScriptText}
                onChange={(e) => setCustomScriptText(e.target.value)}
                rows={7}
                className="w-full bg-stone-950 text-emerald-300 p-4 font-mono text-xs resize-y focus:outline-none focus:ring-0 leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Execution Telemetry & Results */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-md text-xs font-bold font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{executionResult.status}</span>
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  Execution Time: <span className="text-stone-900 dark:text-stone-100 font-semibold">{executionResult.executionTimeMs} ms</span> · MapReduce Jobs: <span className="text-stone-900 dark:text-stone-100 font-semibold">{executionResult.mapReduceJobsCount}</span>
                </div>
              </div>

              {/* Result Mode Switcher */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setResultDisplayMode('tuples')}
                  className={`px-2.5 py-1 rounded transition-all ${
                    resultDisplayMode === 'tuples'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  Pig DUMP (Tuples)
                </button>
                <button
                  onClick={() => setResultDisplayMode('table')}
                  className={`px-2.5 py-1 rounded transition-all ${
                    resultDisplayMode === 'table'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  Tabular Results
                </button>
                <button
                  onClick={() => setResultDisplayMode('input')}
                  className={`px-2.5 py-1 rounded transition-all ${
                    resultDisplayMode === 'input'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  Input Dataset
                </button>
                <button
                  onClick={() => setResultDisplayMode('logs')}
                  className={`px-2.5 py-1 rounded transition-all ${
                    resultDisplayMode === 'logs'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  MapReduce Logs ({executionResult.logs.length})
                </button>
              </div>
            </div>

            {/* Input Dataset Preview Mode */}
            {resultDisplayMode === 'input' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-mono">
                  <span>HDFS CSV Input Stream (First 10 records loaded via PigStorage):</span>
                  <span>{records.length} total records available</span>
                </div>
                <div className="bg-stone-950 text-stone-200 font-mono text-xs p-4 rounded-xl max-h-80 overflow-y-auto space-y-1 border border-stone-800">
                  <div className="text-stone-500 pb-1 border-b border-stone-800">
                    State,District,Crop,Crop_Year,Season,Area,Production,Yield
                  </div>
                  {records.slice(0, 15).map((r, i) => (
                    <div key={i} className="text-emerald-400/90 hover:bg-stone-900/60 px-2 py-0.5 rounded">
                      {`"${r.state}","${r.district}","${r.crop}",${r.cropYear},"${r.season}",${r.area},${r.production},${r.yield}`}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DUMP Mode (Classic Apache Pig Raw Tuples) */}
            {resultDisplayMode === 'tuples' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-mono">
                  <span>Standard Apache Pig DUMP Output Representation:</span>
                  <span>{executionResult.rawTuples.length} tuples returned</span>
                </div>
                <div className="bg-stone-950 text-stone-200 font-mono text-xs p-4 rounded-xl max-h-80 overflow-y-auto space-y-1 border border-stone-800">
                  {executionResult.rawTuples.map((tuple, i) => (
                    <div key={i} className="text-emerald-400 hover:bg-stone-900/60 px-2 py-0.5 rounded">
                      {tuple}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  In Apache Pig, <code className="font-mono text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">DUMP</code> prints raw tuples to stdout formatted with parentheses: (item1, item2, item3).
                </p>
              </div>
            )}

            {/* Table Mode */}
            {resultDisplayMode === 'table' && (
              <div className="space-y-3">
                <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl max-h-80">
                  <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
                    <thead className="bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono sticky top-0 border-b border-stone-200 dark:border-stone-700">
                      <tr>
                        {executionResult.schema.map((col, idx) => (
                          <th key={idx} className="px-3.5 py-2.5 whitespace-nowrap font-semibold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                      {executionResult.tableData.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors">
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="px-3.5 py-2 font-mono whitespace-nowrap">
                              {typeof val === 'number' ? val.toLocaleString() : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Logs Mode */}
            {resultDisplayMode === 'logs' && (
              <div className="bg-stone-950 text-stone-300 font-mono text-xs p-4 rounded-xl max-h-80 overflow-y-auto space-y-1.5 border border-stone-800">
                {executionResult.logs.map((log, i) => (
                  <div key={i} className="text-stone-300 text-[11px]">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: Apache Pig Architecture & DAG Visualizer */}
      {activeView === 'architecture' && (
        <div className="space-y-6">
          {/* Architecture Pipeline Stages Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                How Pig Latin Compiles to Hadoop MapReduce
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Step-by-step compilation pipeline from high-level relational Pig Latin to distributed HDFS execution
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                {
                  step: '1. Parser & Lexer',
                  desc: 'Validates syntax, verifies relation aliases, schemas, and constructs an Abstract Syntax Tree (AST).',
                  tag: 'Frontend'
                },
                {
                  step: '2. Logical Plan',
                  desc: 'Builds directed acyclic graph (DAG) of logical operators (LOFilter, LOGroup, LOForEach).',
                  tag: 'DAG Compilation'
                },
                {
                  step: '3. Logical Optimizer',
                  desc: 'Applies predicate pushdown, column pruning, and flattens nested operations before execution.',
                  tag: 'Optimization'
                },
                {
                  step: '4. Physical Plan',
                  desc: 'Translates logical operations into physical operators (POFilter, POLocalRearrange, POGlobalRearrange).',
                  tag: 'Operator Graph'
                },
                {
                  step: '5. MR Compiler',
                  desc: 'Packages physical operators into Java MapReduce jobs, allocating Map, Shuffle, and Reduce tasks.',
                  tag: 'Hadoop Execution'
                }
              ].map((stage, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 rounded inline-block mb-2">
                      {stage.tag}
                    </div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                      {stage.step}
                    </h4>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                  {idx < 4 && (
                    <div className="hidden md:flex justify-end mt-3 text-stone-400">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pig Data Model Explanation Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Apache Pig Relational Data Model (Atoms, Tuples, Bags & Maps)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40">
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Atom / Scalar
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2">
                  A simple atomic data value (int, long, float, double, chararray, bytearray).
                </p>
                <div className="mt-3 p-2 bg-stone-900 text-emerald-300 font-mono text-[11px] rounded border border-stone-800">
                  'Wheat', 5.12, 2023
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40">
                <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded">
                  Tuple (...)
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2">
                  An ordered sequence of fields, matching a record in a relational database table.
                </p>
                <div className="mt-3 p-2 bg-stone-900 text-teal-300 font-mono text-[11px] rounded border border-stone-800">
                  ('Punjab', 'Wheat', 5.12)
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40">
                <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
                  Bag {'{...}'}
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2">
                  An unordered collection of tuples. Can contain duplicate tuples. Created by GROUP.
                </p>
                <div className="mt-3 p-2 bg-stone-900 text-amber-300 font-mono text-[11px] rounded border border-stone-800">
                  {'{(Wheat, 5.1), (Rice, 4.3)}'}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40">
                <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded">
                  Map [...]
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2">
                  A set of key-value pairs where the key is a chararray and value is any Pig type.
                </p>
                <div className="mt-3 p-2 bg-stone-900 text-purple-300 font-mono text-[11px] rounded border border-stone-800">
                  ['soil'#'Alluvial', 'zone'#'Plains']
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
