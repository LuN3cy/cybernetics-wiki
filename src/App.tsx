import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button as HeroButton, Card as HeroCard } from "@heroui/react";
import {
  Activity,
  Archive,
  Beaker,
  BookOpen,
  Boxes,
  Brain,
  Check,
  ChevronDown,
  CircuitBoard,
  FlaskConical,
  Gauge,
  GraduationCap,
  Info,
  ListTree,
  Monitor,
  Moon,
  Orbit,
  Palette,
  RadioTower,
  RotateCcw,
  Search,
  Shuffle,
  Sun,
  Target,
  Waypoints,
  Zap,
} from "lucide-react";
import { allQuestions, chapters, labTitles, modules } from "./data/modules";
import { defaultColorMode, defaultThemeId, isColorMode, isThemeId, themes } from "./theme";
import type { CaseStudy, ChapterModule, LabType, QuizQuestion, SourceReference } from "./types";
import type { ColorMode, ThemeId } from "./theme";

const iconMap: Record<LabType, typeof Target> = {
  "route-switch": Waypoints,
  fiber: FlaskConical,
  capacity: Gauge,
  "random-search": Shuffle,
  "memory-search": Brain,
  precipitation: Beaker,
  "reactor-feedback": CircuitBoard,
  "feedback-amplifier": Orbit,
  "positive-loop": Zap,
  "knowing-space": Search,
  "signal-channel": RadioTower,
  "receiver-meaning": Info,
  "channel-capacity": Gauge,
  filtering: ListTree,
  "storage-chain": Archive,
  "reasoning-space": Brain,
  "organization-space": Boxes,
  "causal-network": Waypoints,
  "isolated-system": Boxes,
  "steady-structure": Orbit,
  "prediction-model": Gauge,
  "equilibrium-stability": Target,
  oscillation: Activity,
  ultrastability: CircuitBoard,
  "system-evolution": ListTree,
  "system-collapse": Zap,
  "self-organization": Boxes,
  "intelligence-amplifier": Brain,
  "qualitative-problem": Target,
  "leap-gradual": Activity,
  "stable-quality": Orbit,
  "potential-well": Gauge,
  "phase-transition": Zap,
  "detect-leap": Search,
  "transition-condition": CircuitBoard,
  "catastrophe-node": Waypoints,
  overcorrection: RotateCcw,
  coexistence: Boxes,
  "common-mission": BookOpen,
  "black-box": Archive,
  "epistemology-model": Brain,
  "observability-control": Gauge,
  "theory-clarity": Info,
  "convergence-speed": Activity,
  overfeedback: RadioTower,
  decidability: Check,
  "science-human": GraduationCap,
};

const themeStorageKey = "cybernetics-theme-id";
const modeStorageKey = "cybernetics-color-mode";

function getStoredTheme() {
  if (typeof window === "undefined") return defaultThemeId;
  const saved = window.localStorage.getItem(themeStorageKey);
  return isThemeId(saved) ? saved : defaultThemeId;
}

function getStoredMode() {
  if (typeof window === "undefined") return defaultColorMode;
  const saved = window.localStorage.getItem(modeStorageKey);
  return isColorMode(saved) ? saved : defaultColorMode;
}

function useThemeTokens() {
  const [themeId, setThemeId] = useState<ThemeId>(getStoredTheme);
  const [mode, setMode] = useState<ColorMode>(getStoredMode);
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    setSystemDark(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const effectiveMode = mode === "system" ? (systemDark ? "dark" : "light") : mode;
  const theme = themes.find((item) => item.id === themeId) ?? themes[0];

  useEffect(() => {
    const root = document.documentElement;
    const palette = theme[effectiveMode];
    root.dataset.theme = theme.id;
    root.dataset.mode = mode;
    root.dataset.effectiveMode = effectiveMode;
    Object.entries(palette).forEach(([key, value]) => root.style.setProperty(`--${key}`, value));
    window.localStorage.setItem(themeStorageKey, theme.id);
    window.localStorage.setItem(modeStorageKey, mode);
  }, [effectiveMode, mode, theme]);

  return { themeId, setThemeId, mode, setMode, effectiveMode };
}

function App() {
  const themeState = useThemeTokens();
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [mobileRailOpen, setMobileRailOpen] = useState(false);
  const activeModule = modules[activeIndex];
  const progress = Math.round(((activeIndex + 1) / modules.length) * 100);
  const correctCount = allQuestions.reduce((count, question) => {
    const key = `${question.moduleId}-${question.questionIndex}`;
    return count + (answers[key] === question.answer ? 1 : 0);
  }, 0);
  const currentAnswered = activeModule.quiz.filter((_, index) => answers[`${activeModule.id}-${index}`] !== undefined).length;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <Activity size={18} />
          </div>
          <div>
            <strong>控制论与科学方法论.pdf</strong>
            <span>{activeModule.chapter}：{activeModule.title}</span>
          </div>
        </div>
        <div className="top-actions">
          <HeroButton className="mobile-chapter-trigger" onPress={() => setMobileRailOpen(true)}>
            <BookOpen size={16} />
            章节
          </HeroButton>
          <div className="session-score" aria-label="学习进度">
            <span>{progress}%</span>
            <div className="progress-track">
              <div style={{ width: `${progress}%` }} />
            </div>
          </div>
          <ThemeSwitcher {...themeState} />
        </div>
      </header>

      <main className="workspace">
        {mobileRailOpen && <button className="mobile-rail-backdrop" aria-label="关闭章节导航" onClick={() => setMobileRailOpen(false)} />}
        <aside className={`chapter-rail ${mobileRailOpen ? "open" : ""}`} aria-label="章节进度">
          <div className="rail-header">
            <BookOpen size={18} />
            <div>
              <strong>学习路径</strong>
            </div>
            <HeroButton className="mobile-rail-close" onPress={() => setMobileRailOpen(false)}>关闭</HeroButton>
          </div>
          <div className="module-list grouped">
            {chapters.map((chapter) => (
              <section className="module-group" key={chapter}>
                <h3>{chapter}</h3>
                {modules.map((module, index) => {
                  if (module.chapter !== chapter) return null;
                  const Icon = iconMap[module.lab.type];
                  return (
                    <HeroButton
                      className={`module-button ${index === activeIndex ? "active" : ""}`}
                      key={module.id}
                      onPress={() => {
                        setActiveIndex(index);
                        setMobileRailOpen(false);
                      }}
                    >
                      <Icon size={16} />
                      <span>
                        <small>{module.index} · {labTitles[module.lab.type]}</small>
                        {module.title}
                      </span>
                    </HeroButton>
                  );
                })}
              </section>
            ))}
          </div>
        </aside>

        <section className="reader-panel" id="reader">
          <AnimatePresence mode="wait">
            <motion.article
              key={activeModule.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24 }}
            >
              <ModuleReader module={activeModule} />
              <ModuleQuiz module={activeModule} answers={answers} setAnswers={setAnswers} answered={currentAnswered} />
            </motion.article>
          </AnimatePresence>
        </section>

        <aside className="lab-panel" id="lab">
          <LabPanel module={activeModule} />
        </aside>
      </main>

      <section className="chapter-summary" id="quiz">
        <div className="quiz-summary">
          <GraduationCap size={19} />
          <div>
            <strong>章节总览</strong>
            <span>共 {modules.length} 个小节、{allQuestions.length} 道即时题；当前答对 {correctCount} 道。</span>
          </div>
        </div>
        <div className="summary-flow">
          {modules.map((module, index) => {
            const done = module.quiz.every((_, questionIndex) => answers[`${module.id}-${questionIndex}`] !== undefined);
            return (
              <HeroButton key={module.id} className={done ? "done" : ""} onPress={() => setActiveIndex(index)}>
                {module.index}
              </HeroButton>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ThemeSwitcher({
  themeId,
  setThemeId,
  mode,
  setMode,
  effectiveMode,
}: {
  themeId: ThemeId;
  setThemeId: (themeId: ThemeId) => void;
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  effectiveMode: "light" | "dark";
}) {
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const activeTheme = themes.find((theme) => theme.id === themeId) ?? themes[0];
  const modes: Array<{ id: ColorMode; label: string; icon: typeof Sun }> = [
    { id: "system", label: "System", icon: Monitor },
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
  ];

  return (
    <div className="theme-switcher" aria-label="主题设置">
      <div className="mode-toggle" role="group" aria-label="深浅色模式">
        {modes.map((item) => {
          const Icon = item.icon;
          return (
            <HeroButton
              key={item.id}
              className={mode === item.id ? "active" : ""}
              type="button"
              onPress={() => setMode(item.id)}
              aria-label={`${item.label}${item.id === "system" ? `: ${effectiveMode}` : ""}`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </HeroButton>
          );
        })}
      </div>
      <div className="theme-select">
        <HeroButton className="theme-select-trigger" aria-expanded={themeMenuOpen} aria-haspopup="listbox" onPress={() => setThemeMenuOpen((open) => !open)}>
          <Palette size={15} />
          <strong>{activeTheme.name}</strong>
          <span className="theme-preview" aria-hidden="true">
            {activeTheme.preview.map((color) => <i key={color} style={{ background: color }} />)}
          </span>
          <ChevronDown size={14} />
        </HeroButton>
        {themeMenuOpen && (
          <div className="theme-menu" role="listbox" aria-label="选择配色主题">
            {themes.map((theme) => {
              const selected = theme.id === themeId;
              return (
                <HeroButton
                  key={theme.id}
                  className={`theme-option ${selected ? "selected" : ""}`}
                  aria-selected={selected}
                  onPress={() => {
                    setThemeId(theme.id);
                    setThemeMenuOpen(false);
                  }}
                >
                  <span className="theme-option-main">
                    <strong>{theme.name}</strong>
                    <em>{theme.description}</em>
                  </span>
                  <span className="theme-preview" aria-hidden="true">
                    {theme.preview.map((color) => <i key={color} style={{ background: color }} />)}
                  </span>
                  {selected && <Check size={15} />}
                </HeroButton>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ModuleReader({ module }: { module: ChapterModule }) {
  const [reference, setReference] = useState<SourceReference | null>(null);
  const Icon = iconMap[module.lab.type];
  const narrative = refinedNarratives[module.id] ?? [];

  return (
    <>
      <div className="reader-heading">
        <div className="module-index">{module.index}</div>
        <div>
          <h1>{module.title}</h1>
          <p>{module.question}</p>
        </div>
      </div>

      <div className="takeaway-row">
        <div className="takeaway-icon"><Icon size={22} /></div>
        <p>{module.takeaway}</p>
      </div>

      <div className="case-grid">
        <CaseCard caseStudy={module.sourceCase} onOpenReference={setReference} />
        <CaseCard caseStudy={module.modernCase} onOpenReference={setReference} />
      </div>

      {narrative.length > 0 && (
        <section className="reading-block narrative-block">
          <h2>阅读场景</h2>
          {narrative.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      )}

      <section className="reading-block">
        <h2>控制论解释</h2>
        {module.theory.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>

      <section className="guide-block">
        <div>
          <h2>实操指引</h2>
          <p>{module.lab.task}</p>
        </div>
        <ol>
          {module.operationGuide.map((item) => <li key={item}>{item}</li>)}
        </ol>
      </section>

      <div className="formula-strip">
        <span>关键关系</span>
        <strong>{module.formula}</strong>
      </div>
      <ReferenceModal reference={reference} onClose={() => setReference(null)} />
    </>
  );
}

const refinedNarratives: Record<string, string[]> = {
  "causal-network": ["这一节不要把因果理解成“甲导致乙”的单线故事。读系统问题时，先把变量画成节点，再看哪些关系是单向链条、哪些关系会回到自身。右侧网络板用传播范围表达这一点：同样一个扰动，在线性链、互为因果和网络耦合中会产生完全不同的后果。"],
  "isolated-system": ["相对孤立系统的难点在于边界不是天然给定的，而是研究者为了看清对象临时划出来的。边界过窄时，外部输入被误认为内部原因；边界过宽时，变量太多又无法分析。右侧实验用“边界半径”和“外部扰动”表现这种取舍。"],
  "steady-structure": ["稳态结构不是静止。工厂、城市、平台服务都在不断流动，但只要关键连接关系能把偏离拉回可接受区间，系统就仍然保持某种形态。势阱实验把这种“变中有稳”的关系画成可回到低谷的小球。"],
  "prediction-model": ["预言不是玄学，而是稳定结构提供了未来约束。天气、容量、库存、交通都不能被完全确定，但只要结构模式保持，未来可能空间就会变窄。预测带实验用宽窄变化展示：结构越稳，预测区间越收束；冲击越大，旧模型越快失效。"],
  "equilibrium-stability": ["均匀状态很容易欺骗人。看上去平均分布的系统，受扰动后可能迅速偏向某个节点；真正重要的是扰动之后会不会回到原状态。平衡板实验让读者观察“整齐”和“稳定”的区别。"],
  oscillation: ["振荡来自反馈、延迟和惯性之间的不匹配。库存、恒温器、自动驾驶、团队管理都可能因为修正太晚、太猛而在目标两侧来回摆。示波器实验不再只画一条抽象线，而是让增益和延迟直接改变振幅。"],
  ultrastability: ["超稳定系统的重点是：当原有参数调节无效时，系统会改变自己的结构。普通反馈像拧旋钮，超稳定像换方案。策略卡片把这个过程分成参数调节、策略切换、结构重组三个层级。"],
  "system-evolution": ["系统演化不是“变多了”或“变复杂了”，而是分支被环境选择后留下路径。演化树实验把变异和选择拆开：变异给出分支，选择决定哪些分支继续成为历史。"],
  "system-collapse": ["自繁殖现象最值得警惕的是增长回路会消耗自身条件。链式反应、重试风暴、谣言传播都有类似结构：复制因子一旦超过约束能力，增长就会转成崩溃。链格实验用扩散格数显示阈值。"],
  "self-organization": ["自组织不是没有规则，而是没有中央逐项命令。个体只遵守局部规则，整体却可能出现方向、队列或结构。网格实验用局部对齐和噪声展示：秩序来自局部互动的重复。"],
  "intelligence-amplifier": ["智力放大器不是单纯让人更快，而是扩大搜索、记忆、推理和反馈能力。问题在于错误也会被放大。流水线实验把工具放大和校验回路放在同一个画面，逼迫读者看见速度与质量的平衡。"],
  "qualitative-problem": ["第四章的切入点是把哲学争论变成模型问题：飞跃论和渐变论都能举出例子，真正需要问的是系统稳定结构怎样改变。双路径实验让读者先看到两种质变方式都可能成立。"],
  "leap-gradual": ["飞跃和渐变不是口号对立。温度连续下降，水在冰点附近可能突然结冰；而复杂组织也可能因为中间态充分而逐步迁移。轨道实验用阈值和中间态数量区分两种路径。"],
  "stable-quality": ["性质之所以稳定，是因为背后有结构支撑。木块、水分子、软件不变量都在干扰中保持可辨状态。分子稳定实验用结构强度和扰动表现性质从保持到松散的过程。"],
  "potential-well": ["势阱是第四章最重要的图像之一：稳定状态不是“点”，而是一片能把偏离拉回来的地形。实验里小球会根据势阱深度和扰动强度回落或逃逸。"],
  "phase-transition": ["突变常常发生在连续控制参数之后。木块被推时先只是倾斜，超过临界条件后翻倒，状态性质改变。翻倒实验让读者观察连续输入和不连续结果之间的关系。"],
  "detect-leap": ["不是所有大波动都是飞跃。短暂尖峰如果能回到原结构，只是扰动；跨过性质边界并稳定在新结构，才是飞跃。判别器实验把变化速度和恢复能力放在一起比较。"],
  "transition-condition": ["同一种质变可以在不同条件下表现为飞跃或渐变。变化速度、中间态、可逆性和反馈充分度共同决定路径。条件混合器用两根柱子简化这个判断。"],
  "catastrophe-node": ["关节点不是神秘词，而是稳定状态数目发生变化的区域。尖点模型可以把“控制量”“结构张力”和“系统状态”放在同一张图上：低张力时只有一条稳定分支，高张力时会出现两个可稳定分支，中间区域不可稳定。右侧实验的重点不是看一个漂亮曲面，而是看路径依赖：同样的控制量，因为来路不同，系统可能停在不同分支，直到越过跳变带才突然换态。"],
  overcorrection: ["矫枉过正的问题要放进稳定结构中看：旧状态吸引力强时，修正太弱会被拉回；修正太猛又会越过目标。弧线实验把旧态、目标、修正力度和旧态吸引放在同一张图上。"],
  coexistence: ["极端共存说明系统不能只看平均值。多吸引域存在时，局部可以稳定在两端，平均指标反而掩盖真实结构。双吸引子实验把两个稳定区域同时展示出来。"],
  "common-mission": ["第四章最后的意义是把哲学问题、数学模型和工程判断接起来。稳定机制、控制参数、关节点、新质态四个词构成一个可以迁移的分析模板。"],
  "black-box": ["第五章从黑箱开始，是因为很多对象内部不可见但并非不可研究。研究者可以控制输入、观察输出、记录反馈，再逐步提出内部结构假设。黑箱探测器把这个认识过程做成输入输出实验。"],
  "epistemology-model": ["控制论认识论反对把认识看成一次静态照相。主体行动，客体反馈，模型修正，再行动，这才是认识循环。反馈环实验用四个节点表现认识怎样逐轮更新。"],
  "observability-control": ["看不见的变量不能直接进入模型，动不了的变量不能被实验验证。可观察性和可控制性共同决定认识上限。变量矩阵用交叉格子显示真正进入闭环的变量范围。"],
  "theory-clarity": ["理论清晰不是语言漂亮，而是能产生可区分、可检验、可反驳的预期。清单实验把变量、关系、预测、反例和复现拆开，让读者检查一个理论是否真能学习。"],
  "convergence-speed": ["模型逼近真理的速度取决于反馈质量，而不只是努力程度。错误反馈会让模型朝错误方向快速收敛。收敛曲线实验展示高质量反馈如何让误差稳定下降。"],
  overfeedback: ["反馈也有副作用。太慢会学不到，太快会追噪声；越频繁的指标不一定越真实。过度反馈仪表把反馈频率和噪声水平放在一起，提示读者建立滤波窗口。"],
  decidability: ["可判定条件提醒我们：信息不足时，强行结论不是科学。只有状态可分、证据足够、规则明确，问题才可判定。阈值实验用证据条和判定线表现这一边界。"],
  "science-human": ["本书最后回到人：控制论和科学方法不是取消人的判断，而是帮助人把问题、工具、信息和反馈组织成更可靠的认识过程。人机平衡实验强调效率和责任必须同时存在。"],
};

function CaseCard({ caseStudy, onOpenReference }: { caseStudy: CaseStudy; onOpenReference: (reference: SourceReference) => void }) {
  return (
    <HeroCard className="case-card">
      <span>{caseStudy.source}</span>
      <h2>{caseStudy.title}</h2>
      <p>{caseStudy.body}</p>
      {caseStudy.reference && (
        <HeroButton className="reference-button" onPress={() => onOpenReference(caseStudy.reference!)}>
          <BookOpen size={15} />
          查看原文依据
        </HeroButton>
      )}
    </HeroCard>
  );
}

function ReferenceModal({ reference, onClose }: { reference: SourceReference | null; onClose: () => void }) {
  if (!reference) return null;
  const assetBase = import.meta.env.BASE_URL;
  const pageImage = `${assetBase}${reference.pageImage}`.replace(/\/{2,}/g, "/");
  const pdfUrl = `${assetBase}cybernetics-methodology.pdf#page=${reference.pageNumber}`.replace(/\/{2,}/g, "/");
  return (
    <div className="reference-backdrop" role="dialog" aria-modal="true" aria-label="原文依据">
      <HeroCard className="reference-modal">
        <div className="reference-head">
          <div>
            <span>{reference.chapter}</span>
            <h2>{reference.section}</h2>
          </div>
          <HeroButton onPress={onClose}>关闭</HeroButton>
        </div>
        <div className="reference-page">{reference.pages}</div>
        <div className="pdf-page-preview">
          <img src={pageImage} alt={`${reference.section} 原文页 ${reference.pageNumber}`} />
          <div className="pdf-mask top" style={{ height: `${reference.highlight.y}%` }} />
          <div
            className="pdf-mask bottom"
            style={{ top: `${reference.highlight.y + reference.highlight.height}%` }}
          />
          <div
            className="pdf-mask left"
            style={{
              top: `${reference.highlight.y}%`,
              width: `${reference.highlight.x}%`,
              height: `${reference.highlight.height}%`,
            }}
          />
          <div
            className="pdf-mask right"
            style={{
              top: `${reference.highlight.y}%`,
              left: `${reference.highlight.x + reference.highlight.width}%`,
              height: `${reference.highlight.height}%`,
            }}
          />
          <div
            className="pdf-highlight"
            style={{
              left: `${reference.highlight.x}%`,
              top: `${reference.highlight.y}%`,
              width: `${reference.highlight.width}%`,
              height: `${reference.highlight.height}%`,
            }}
          />
        </div>
        <blockquote>{reference.excerpt}</blockquote>
        <p>{reference.note}</p>
        <a className="pdf-open-link" href={pdfUrl} target="_blank" rel="noreferrer">
          打开原始 PDF 第 {reference.pageNumber} 页附近
        </a>
        <p className="reference-warning">为避免把整本书搬进页面，这里只提供短摘录和页码定位。需要完整上下文时，请回到本地 PDF 对应页附近阅读。</p>
      </HeroCard>
    </div>
  );
}

function LabPanel({ module }: { module: ChapterModule }) {
  const Icon = iconMap[module.lab.type];
  const guide = labExperienceGuide[module.lab.type];
  return (
    <section className="lab-card">
      <div className="lab-head">
        <div>
          <span>{module.index} 专属实验</span>
          <h2>{module.lab.title}</h2>
        </div>
        <div className="lab-icon"><Icon size={22} /></div>
      </div>
      <p className="lab-premise">{module.lab.premise}</p>
      {guide && (
        <div className="lab-experience-map" aria-label="实验结构">
          <div>
            <span>对象</span>
            <strong>{guide.object}</strong>
          </div>
          <div>
            <span>调节</span>
            <strong>{guide.control}</strong>
          </div>
          <div>
            <span>反馈</span>
            <strong>{guide.feedback}</strong>
          </div>
        </div>
      )}
      <p className="lab-task">{module.lab.task}</p>
      <LabSwitch type={module.lab.type} />
    </section>
  );
}

const labExperienceGuide: Record<LabType, { object: string; control: string; feedback: string }> = {
  "route-switch": { object: "自动分拣线", control: "三级道岔", feedback: "送达仓位/分支匹配" },
  fiber: { object: "人造纤维反应釜", control: "温度/压力/催化剂", feedback: "目标产率/副产物" },
  capacity: { object: "大网捕获空间", control: "目标宽度/对象波动", feedback: "命中率/可控性" },
  "random-search": { object: "未知参数格子", control: "随机试错", feedback: "尝试次数/重复成本" },
  "memory-search": { object: "抽屉搜索", control: "记忆排除/误判", feedback: "剩余候选/累计成本" },
  precipitation: { object: "金属沉淀液", control: "沉淀顺序", feedback: "纯度/目标损失" },
  "reactor-feedback": { object: "在线粘度反应釜", control: "传感器/增益/采样", feedback: "偏差曲线/闭环状态" },
  "feedback-amplifier": { object: "逐步逼近空间", control: "每轮缩小比例", feedback: "剩余空间/放大倍数" },
  "positive-loop": { object: "正反馈回路", control: "耦合强度/阻尼", feedback: "偏差是否失控" },
  "knowing-space": { object: "隐藏物品集合", control: "逐条线索", feedback: "剩余候选数" },
  "signal-channel": { object: "信号传输通道", control: "通道形式/噪声", feedback: "清晰度/损失" },
  "receiver-meaning": { object: "同一告警信号", control: "接收者角色", feedback: "语义匹配/可行动性" },
  "channel-capacity": { object: "警报通道", control: "源状态/警报级别", feedback: "表达覆盖率" },
  filtering: { object: "证据链", control: "重复或互证", feedback: "结论可靠度" },
  "storage-chain": { object: "历史信息载体", control: "冗余/腐蚀/解码", feedback: "恢复率" },
  "reasoning-space": { object: "集合与概率判断", control: "证据强度/基线", feedback: "更新后概率" },
  "organization-space": { object: "三人空间关系", control: "组织规则", feedback: "联系可能性" },
  "causal-network": { object: "因果网络", control: "连接强度/扩散", feedback: "影响范围" },
  "isolated-system": { object: "系统边界", control: "边界半径/扰动", feedback: "解释力/漏因风险" },
  "steady-structure": { object: "稳态势阱", control: "恢复力/扰动", feedback: "是否回稳" },
  "prediction-model": { object: "未来预测带", control: "稳定度/冲击", feedback: "预测区间宽窄" },
  "equilibrium-stability": { object: "平衡板", control: "拉回力/扰动", feedback: "偏离或回中心" },
  oscillation: { object: "反馈示波器", control: "增益/延迟", feedback: "振幅是否放大" },
  ultrastability: { object: "策略搜索系统", control: "搜索/结构变化", feedback: "再稳定层级" },
  "system-evolution": { object: "演化分支树", control: "变异/选择", feedback: "保留路径" },
  "system-collapse": { object: "自繁殖链", control: "复制因子/约束", feedback: "扩散或崩溃" },
  "self-organization": { object: "局部个体网格", control: "规则/噪声", feedback: "整体秩序" },
  "intelligence-amplifier": { object: "智力放大流水线", control: "工具倍数/校验", feedback: "放大质量" },
  "qualitative-problem": { object: "质变路径", control: "压力/韧性", feedback: "飞跃或渐变" },
  "leap-gradual": { object: "过渡轨道", control: "阈值/中间态", feedback: "跳变方式" },
  "stable-quality": { object: "结构分子", control: "结构强度/干扰", feedback: "性质保持" },
  "potential-well": { object: "势阱小球", control: "势阱深度/扰动", feedback: "回落或逃逸" },
  "phase-transition": { object: "受力木块", control: "推力/稳定余量", feedback: "倾斜或翻倒" },
  "detect-leap": { object: "性质边界", control: "变化速度/恢复力", feedback: "波动或飞跃" },
  "transition-condition": { object: "质变条件", control: "速度/中间态", feedback: "路径倾向" },
  "catastrophe-node": { object: "尖点突变图", control: "控制量/结构张力", feedback: "稳定分支/跳变带" },
  overcorrection: { object: "矫正轨道", control: "修正力度/旧态吸引", feedback: "回旧态/过冲/收敛" },
  coexistence: { object: "双吸引域", control: "分裂强度/压力", feedback: "两极是否共存" },
  "common-mission": { object: "质变分析模板", control: "机制/参数", feedback: "分析完整度" },
  "black-box": { object: "未知黑箱", control: "输入刺激/输出读取", feedback: "识别能力" },
  "epistemology-model": { object: "认识反馈环", control: "反馈/更新", feedback: "认知误差下降" },
  "observability-control": { object: "变量矩阵", control: "可观察/可控制", feedback: "认识上限" },
  "theory-clarity": { object: "理论清晰度清单", control: "变量/预测", feedback: "可检验度" },
  "convergence-speed": { object: "模型收敛曲线", control: "反馈质量/频率", feedback: "误差下降速度" },
  overfeedback: { object: "反馈节奏仪", control: "频率/噪声", feedback: "追噪声风险" },
  decidability: { object: "判定阈值", control: "证据/规则", feedback: "可否下结论" },
  "science-human": { object: "人机协作秤", control: "自动化/审查", feedback: "效率与责任平衡" },
};

function LabSwitch({ type }: { type: LabType }) {
  if (type === "route-switch") return <RouteSwitchLab />;
  if (type === "fiber") return <FiberLab />;
  if (type === "capacity") return <CapacityLab />;
  if (type === "random-search") return <RandomSearchLab />;
  if (type === "memory-search") return <MemorySearchLab />;
  if (type === "precipitation") return <PrecipitationLab />;
  if (type === "reactor-feedback") return <ReactorFeedbackLab />;
  if (type === "feedback-amplifier") return <FeedbackAmplifierLab />;
  if (type === "positive-loop") return <PositiveLoopLab />;
  if (type === "knowing-space") return <KnowingSpaceLab />;
  if (type === "signal-channel") return <SignalChannelLab />;
  if (type === "receiver-meaning") return <ReceiverMeaningLab />;
  if (type === "channel-capacity") return <ChannelCapacityLab />;
  if (type === "filtering") return <FilteringLab />;
  if (type === "storage-chain") return <StorageChainLab />;
  if (type === "reasoning-space") return <ReasoningSpaceLab />;
  if (type === "organization-space") return <OrganizationSpaceLab />;
  if (type === "causal-network") return <CausalNetworkLab />;
  if (type === "isolated-system") return <BoundaryLab />;
  if (type === "steady-structure") return <SteadyStructureLab />;
  if (type === "prediction-model") return <PredictionLab />;
  if (type === "equilibrium-stability") return <BalanceStabilityLab />;
  if (type === "oscillation") return <OscillationTunerLab />;
  if (type === "ultrastability") return <UltrastabilityLab />;
  if (type === "system-evolution") return <EvolutionTreeLab />;
  if (type === "system-collapse") return <CollapseChainLab />;
  if (type === "self-organization") return <SelfOrganizationLab />;
  if (type === "intelligence-amplifier") return <IntelligenceAmplifierLab />;
  if (type === "qualitative-problem") return <QualitativeProblemLab />;
  if (type === "leap-gradual") return <LeapGradualLab />;
  if (type === "stable-quality") return <StableQualityLab />;
  if (type === "potential-well") return <PotentialWellLab />;
  if (type === "phase-transition") return <PhaseTransitionLab />;
  if (type === "detect-leap") return <DetectLeapLab />;
  if (type === "transition-condition") return <TransitionConditionLab />;
  if (type === "catastrophe-node") return <CatastropheNodeLab />;
  if (type === "overcorrection") return <OvercorrectionLab />;
  if (type === "coexistence") return <CoexistenceLab />;
  if (type === "common-mission") return <CommonMissionLab />;
  if (type === "black-box") return <BlackBoxLab />;
  if (type === "epistemology-model") return <EpistemologyLoopLab />;
  if (type === "observability-control") return <ObservabilityControlLab />;
  if (type === "theory-clarity") return <TheoryClarityLab />;
  if (type === "convergence-speed") return <ConvergenceSpeedLab />;
  if (type === "overfeedback") return <OverfeedbackLab />;
  if (type === "decidability") return <DecidabilityLab />;
  if (type === "science-human") return <ScienceHumanLab />;
  return <SystemChapterLab type={type} />;
}

function Metric({ label, value, tone = "blue" }: { label: string; value: string; tone?: "blue" | "green" | "red" | "amber" }) {
  return (
    <HeroCard className={`metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </HeroCard>
  );
}

function RouteSwitchLab() {
  const [target, setTarget] = useState(5);
  const [switches, setSwitches] = useState<[0 | 1, 0 | 1, 0 | 1]>([1, 0, 1]);
  const delivered = switches[0] * 4 + switches[1] * 2 + switches[2];
  const remaining = [8, 4, 2, 1];
  const correctBits = [target >> 2 & 1, target >> 1 & 1, target & 1];
  const matches = correctBits.filter((bit, index) => bit === switches[index]).length;

  function setSwitch(index: number, value: 0 | 1) {
    setSwitches((items) => items.map((item, itemIndex) => (itemIndex === index ? value : item)) as [0 | 1, 0 | 1, 0 | 1]);
  }

  return (
    <div className="lab-body">
      <label className="slider-row">
        <span>目标仓位</span>
        <input type="range" min="0" max="7" value={target} onChange={(event) => setTarget(Number(event.target.value))} />
        <strong>{target + 1}</strong>
      </label>
      <div className="switch-board">
        {switches.map((value, index) => (
          <div className="switch-stage" key={index}>
            <span>道岔 {index + 1}</span>
            <div className="segmented">
              <HeroButton className={value === 0 ? "active" : ""} onPress={() => setSwitch(index, 0)}>左</HeroButton>
              <HeroButton className={value === 1 ? "active" : ""} onPress={() => setSwitch(index, 1)}>右</HeroButton>
            </div>
            <small>剩余可能：{remaining[index + 1]} 个</small>
          </div>
        ))}
      </div>
      <div className="warehouse-grid">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className={`${index === target ? "target" : ""} ${index === delivered ? "delivered" : ""}`}>
            仓 {index + 1}
          </div>
        ))}
      </div>
      <div className="metrics-grid">
        <Metric label="当前送达" value={`仓 ${delivered + 1}`} tone={delivered === target ? "green" : "amber"} />
        <Metric label="分支匹配" value={`${matches}/3`} tone={matches === 3 ? "green" : "amber"} />
      </div>
      <p className="lab-result">{delivered === target ? "三个道岔都匹配，可能性空间被压缩到目标仓位。" : "上游道岔一旦切错，下游仍会继续缩小空间，但缩小到的是错误分支。"}</p>
    </div>
  );
}

function FiberLab() {
  const [temperature, setTemperature] = useState(72);
  const [pressure, setPressure] = useState(64);
  const [catalyst, setCatalyst] = useState(58);
  const score = Math.max(0, 100 - Math.abs(temperature - 76) * 1.3 - Math.abs(pressure - 68) * 1.1 - Math.abs(catalyst - 62) * 1.2);
  const byproduct = Math.max(4, 70 - score * 0.55);
  return (
    <div className="lab-body">
      <Dial label="温度" value={temperature} setValue={setTemperature} />
      <Dial label="压力" value={pressure} setValue={setPressure} />
      <Dial label="催化剂" value={catalyst} setValue={setCatalyst} />
      <div className="yield-bars">
        <Bar label="目标纤维" value={score} tone="green" />
        <Bar label="副产物" value={byproduct} tone="amber" />
        <Bar label="断链风险" value={Math.max(2, 100 - score - 8)} tone="red" />
      </div>
      <p className="lab-result">{score > 82 ? "条件进入工艺窗口：目标状态被选择出来。" : "条件还不匹配：可能性空间仍分散在副产物和失败路径上。"}</p>
    </div>
  );
}

function CapacityLab() {
  const [targetWidth, setTargetWidth] = useState(48);
  const [noise, setNoise] = useState(36);
  const success = Math.max(0, Math.min(100, targetWidth * 1.6 - noise * 0.9 + 35));
  return (
    <div className="lab-body">
      <Dial label="目标范围" value={targetWidth} setValue={setTargetWidth} />
      <Dial label="对象波动" value={noise} setValue={setNoise} />
      <div className="range-board">
        <div className="range-target" style={{ width: `${targetWidth}%` }}>目标区</div>
        <motion.div className="range-dot" animate={{ left: `${50 + Math.sin(noise) * noise * 0.32}%` }} />
      </div>
      <div className="metrics-grid">
        <Metric label="命中率" value={`${Math.round(success)}%`} tone={success > 70 ? "green" : "amber"} />
        <Metric label="判断" value={success > 70 ? "可控" : "吃力"} tone={success > 70 ? "green" : "red"} />
      </div>
      <p className="lab-result">控制目标要与能力匹配。大网先覆盖运动空间，最后才由某个网眼完成捕获。</p>
    </div>
  );
}

function RandomSearchLab() {
  const [history, setHistory] = useState<number[]>([]);
  const target = 8;
  const traps = [2, 11];
  const last = history.at(-1);
  const repeats = history.length - new Set(history).size;
  return (
    <div className="lab-body">
      <HeroButton className="primary-action" onPress={() => setHistory((items) => [...items.slice(-15), Math.floor(Math.random() * 12)])}><Shuffle size={16} />随机试验一次</HeroButton>
      <SearchGrid target={target} traps={traps} history={history} />
      <div className="metrics-grid">
        <Metric label="尝试次数" value={`${history.length}`} />
        <Metric label="重复成本" value={`${repeats}`} tone={repeats > 0 ? "amber" : "green"} />
        <Metric label="累计成本" value={`${history.length * 5}`} tone={history.length > 8 ? "amber" : "blue"} />
        <Metric label="当前结果" value={last === target ? "命中" : traps.includes(last ?? -1) ? "陷阱" : "失败"} tone={last === target ? "green" : traps.includes(last ?? -1) ? "red" : "amber"} />
      </div>
      <p className="lab-result">随机控制能启动探索，但不会自动利用失败经验。重复格子越多，越能看见无记忆搜索的成本。</p>
    </div>
  );
}

function MemorySearchLab() {
  const [memory, setMemory] = useState(true);
  const [history, setHistory] = useState<number[]>([]);
  const [mistake, setMistake] = useState(false);
  const [found, setFound] = useState(false);
  const [lostTarget, setLostTarget] = useState(false);
  const target = 6;
  const drawerCount = 10;
  const inspected = new Set(history);
  const repeats = history.length - inspected.size;
  const excluded = memory ? Array.from(inspected).filter((item) => item !== target || lostTarget) : [];
  const remaining = memory ? drawerCount - excluded.length : drawerCount;
  const cost = history.length * 3;

  function reset(nextMemory = memory) {
    setMemory(nextMemory);
    setHistory([]);
    setFound(false);
    setLostTarget(false);
  }

  function pickDrawer(index: number) {
    if (found || lostTarget || (memory && excluded.includes(index))) return;
    setHistory((items) => [...items, index]);
    if (index === target) {
      if (memory && mistake) setLostTarget(true);
      else setFound(true);
    }
  }

  const resultText = found
    ? `找到信件。总共翻找 ${history.length} 次，成本 ${cost} 点。`
    : lostTarget
      ? "目标被误判为空抽屉并排除：记忆能缩小空间，但错误记忆会把正确状态也删掉。"
      : memory
        ? "每次失败都会从下一轮搜索空间中删除，灰色抽屉不能再选。"
        : repeats > 0
          ? "无记忆搜索已经重复翻找：成本增加了，但可能性空间没有真正缩小。"
          : "无记忆模式不会排除失败抽屉；你可以再次点击同一个抽屉。";

  return (
    <div className="lab-body">
      <div className="segmented">
        <HeroButton className={!memory ? "active" : ""} onPress={() => reset(false)}>无记忆</HeroButton>
        <HeroButton className={memory ? "active" : ""} onPress={() => reset(true)}>有记忆</HeroButton>
      </div>
      <label className="toggle-row memory-risk">
        <input type="checkbox" checked={mistake} onChange={(event) => { setMistake(event.target.checked); reset(memory); }} />
        开启误判风险：在有记忆模式中，如果把目标抽屉误判为空，它也会被排除。
      </label>
      <SearchGrid target={target} traps={mistake && lostTarget ? [target] : []} history={history} count={drawerCount} excluded={excluded} disabledItems={memory ? excluded : []} onPick={pickDrawer} />
      <div className="metrics-grid memory-metrics">
        <Metric label="寻找次数" value={`${history.length}`} tone={found ? "green" : "blue"} />
        <Metric label="累计成本" value={`${cost}`} tone={cost > 18 ? "amber" : "blue"} />
        <Metric label="重复翻找" value={`${repeats}`} tone={repeats > 0 ? "red" : "green"} />
        <Metric label="剩余候选" value={`${remaining}/${drawerCount}`} tone={remaining <= 4 ? "green" : "amber"} />
      </div>
      <HeroButton className="secondary-action" onPress={() => reset(memory)} type="button"><RotateCcw size={15} />重置本实验</HeroButton>
      <p className={`lab-result ${lostTarget ? "danger" : found ? "success" : ""}`}>{resultText}</p>
    </div>
  );
}

function PrecipitationLab() {
  const [order, setOrder] = useState<"large-first" | "small-first">("small-first");
  const loss = order === "large-first" ? 34 : 8;
  const purity = order === "large-first" ? 68 : 91;
  return (
    <div className="lab-body">
      <div className="segmented">
        <HeroButton className={order === "small-first" ? "active" : ""} onPress={() => setOrder("small-first")}>先沉淀少量目标</HeroButton>
        <HeroButton className={order === "large-first" ? "active" : ""} onPress={() => setOrder("large-first")}>先沉淀大量成分</HeroButton>
      </div>
      <div className="beaker">
        <motion.div className="sediment main" animate={{ height: `${order === "large-first" ? 62 : 22}%` }} />
        <motion.div className="sediment target" animate={{ height: `${order === "large-first" ? 10 : 38}%` }} />
      </div>
      <div className="metrics-grid">
        <Metric label="目标损失" value={`${loss}%`} tone={loss > 20 ? "red" : "green"} />
        <Metric label="最终纯度" value={`${purity}%`} tone={purity > 80 ? "green" : "amber"} />
      </div>
      <p className="lab-result">动作顺序改变对象状态，也改变后续选择空间。这就是共轭控制的关键。</p>
    </div>
  );
}

function ReactorFeedbackLab() {
  const [sensor, setSensor] = useState(true);
  const [gain, setGain] = useState(46);
  const [sampleRate, setSampleRate] = useState(60);
  const [disturbance, setDisturbance] = useState(30);
  const points = useMemo(() => makeReactor(sensor, gain / 100, sampleRate / 100, disturbance / 100), [sensor, gain, sampleRate, disturbance]);
  const finalError = Math.abs(points.at(-1)! - 55);
  return (
    <div className="lab-body">
      <label className="toggle-row"><input type="checkbox" checked={sensor} onChange={(event) => setSensor(event.target.checked)} />开启在线粘度传感器</label>
      <Dial label="控制增益" value={gain} setValue={setGain} />
      <Dial label="采样频率" value={sampleRate} setValue={setSampleRate} />
      <Dial label="扰动强度" value={disturbance} setValue={setDisturbance} />
      <ProcessLoop active={sensor} />
      <LineChart points={points} target={55} />
      <div className="metrics-grid">
        <Metric label="最终偏差" value={finalError.toFixed(1)} tone={finalError < 8 ? "green" : "amber"} />
        <Metric label="闭环状态" value={sensor ? "测量-修正" : "开环漂移"} tone={sensor ? "green" : "red"} />
      </div>
      <p className="lab-result">{sensor ? "传感器把反应釜状态送回控制器，控制器根据偏差调温和进料。" : "没有信息回流时，只能按初始方案运行，扰动会持续积累。"}</p>
    </div>
  );
}

function ProcessLoop({ active }: { active: boolean }) {
  return (
    <div className={`process-loop ${active ? "active" : ""}`}>
      <span>目标粘度</span>
      <i>测量偏差</i>
      <span>调温/进料</span>
      <i>再测量</i>
    </div>
  );
}

function FeedbackAmplifierLab() {
  const [shrink, setShrink] = useState(42);
  const rounds = [100];
  for (let i = 0; i < 5; i += 1) rounds.push(rounds[i] * (1 - shrink / 100));
  const power = 100 / rounds.at(-1)!;
  return (
    <div className="lab-body">
      <Dial label="每轮缩小" value={shrink} setValue={setShrink} />
      <div className="concentric">
        {rounds.map((size, index) => <motion.div key={index} animate={{ width: `${size}%`, height: `${size}%` }}>{index === rounds.length - 1 ? "m" : String.fromCharCode(65 + index)}</motion.div>)}
      </div>
      <div className="metrics-grid">
        <Metric label="剩余空间" value={`${rounds.at(-1)!.toFixed(1)}%`} tone="green" />
        <Metric label="总控制能力" value={`${power.toFixed(1)}x`} />
      </div>
      <p className="lab-result">每轮反馈只缩小一部分空间，但多轮相乘后，有限能力会积累成强控制。</p>
    </div>
  );
}

function PositiveLoopLab() {
  const [coupling, setCoupling] = useState(32);
  const [damping, setDamping] = useState(12);
  const points = useMemo(() => {
    const values = [8];
    for (let i = 1; i < 18; i += 1) values.push(Math.min(96, Math.max(0, values[i - 1] * (1 + coupling / 100) - damping * 0.45)));
    return values;
  }, [coupling, damping]);
  const final = points.at(-1)!;
  return (
    <div className="lab-body">
      <Dial label="耦合强度" value={coupling} setValue={setCoupling} />
      <Dial label="阻尼" value={damping} setValue={setDamping} />
      <PositiveLoopSystem coupling={coupling} damping={damping} final={final} />
      <LineChart points={points} target={60} danger />
      <div className="scenario-tabs"><span>军备竞赛</span><span>再生回路</span><span>心力衰竭</span><span>爆炸热反馈</span></div>
      <p className="lab-result">{final > 70 ? "偏差超过阈值，系统进入恶性循环。" : "阻尼足够时，正反馈放大被限制在可控范围内。"}</p>
    </div>
  );
}

function KnowingSpaceLab() {
  const clues = ["不是电子设备", "可以盛水", "常放在桌面"];
  const items = ["杯子", "钢笔", "香烟", "收音机", "本子", "钥匙"];
  const [revealed, setRevealed] = useState(0);
  const remaining = revealed === 0 ? items : revealed === 1 ? ["杯子", "钢笔", "香烟", "本子", "钥匙"] : revealed === 2 ? ["杯子"] : ["杯子"];
  return (
    <div className="lab-body">
      <HeroButton className="primary-action" onPress={() => setRevealed((value) => Math.min(3, value + 1))}>揭示下一条线索</HeroButton>
      <div className="clue-list">{clues.map((clue, index) => <span className={index < revealed ? "active" : ""} key={clue}>{clue}</span>)}</div>
      <CandidateGrid items={items} activeItems={remaining} />
      <div className="metrics-grid">
        <Metric label="原候选" value={`${items.length}`} />
        <Metric label="剩余候选" value={`${remaining.length}`} tone={remaining.length <= 1 ? "green" : "amber"} />
      </div>
      <p className="lab-result">线索之所以有信息量，是因为它让你心中的可能性空间变小。</p>
    </div>
  );
}

function SignalChannelLab() {
  const [noise, setNoise] = useState(25);
  const [channel, setChannel] = useState(0);
  const channels = ["目视", "摄像机", "低带宽无线"];
  const detail = Math.max(5, 100 - noise - channel * 18);
  return (
    <div className="lab-body">
      <div className="segmented">{channels.map((item, index) => <HeroButton key={item} className={channel === index ? "active" : ""} onPress={() => setChannel(index)}>{item}</HeroButton>)}</div>
      <Dial label="通道噪声" value={noise} setValue={setNoise} />
      <SignalPipe clarity={detail} />
      <div className="metrics-grid">
        <Metric label="接收清晰度" value={`${Math.round(detail)}%`} tone={detail > 70 ? "green" : "amber"} />
        <Metric label="信息损失" value={`${Math.round(100 - detail)}%`} tone={detail > 70 ? "green" : "red"} />
      </div>
    </div>
  );
}

function ReceiverMeaningLab() {
  const [receiver, setReceiver] = useState(0);
  const receivers = ["SRE", "普通用户", "财务同事"];
  const meaning = [92, 28, 18][receiver];
  return (
    <div className="lab-body">
      <div className="segmented">{receivers.map((item, index) => <HeroButton key={item} className={receiver === index ? "active" : ""} onPress={() => setReceiver(index)}>{item}</HeroButton>)}</div>
      <div className="alert-card">
        <strong>实验信号</strong>
        <span>接口延迟 P95 超过 1200ms，疑似重试风暴。</span>
      </div>
      <div className="metrics-grid">
        <Metric label="语义匹配" value={`${meaning}%`} tone={meaning > 70 ? "green" : "amber"} />
        <Metric label="可行动性" value={meaning > 70 ? "可处理" : "需翻译"} tone={meaning > 70 ? "green" : "red"} />
      </div>
      <p className="lab-result">同一信号是否成为信息，取决于接收者能否把它变成对状态空间的有效缩小。</p>
    </div>
  );
}

function ChannelCapacityLab() {
  const [states, setStates] = useState(6);
  const [levels, setLevels] = useState(2);
  const capacity = levels;
  const covered = Math.min(100, (capacity / states) * 100);
  return (
    <div className="lab-body">
      <label className="slider-row">
        <span>源头状态</span>
        <input type="range" min="2" max="12" value={states} onChange={(event) => setStates(Number(event.target.value))} />
        <strong>{states}</strong>
      </label>
      <label className="slider-row">
        <span>警报级别</span>
        <input type="range" min="2" max="12" value={levels} onChange={(event) => setLevels(Number(event.target.value))} />
        <strong>{levels}</strong>
      </label>
      <ChannelEncoder states={states} levels={levels} />
      <Bar label="表达覆盖" value={covered} tone={covered >= 100 ? "green" : "amber"} />
      <div className="metrics-grid">
        <Metric label="状态数" value={`${states}`} />
        <Metric label="通道级别" value={`${levels}`} tone={levels >= states ? "green" : "amber"} />
      </div>
      <p className="lab-result">{levels >= states ? "通道状态足以区分源头状态。" : "多个源头状态被挤压到同一警报级别，接收者只能得到粗糙信息。"}</p>
    </div>
  );
}

function FilteringLab() {
  const [mode, setMode] = useState<"repeat" | "multi">("multi");
  const [bias, setBias] = useState(45);
  const reliability = mode === "multi" ? Math.min(98, 55 + (100 - bias) * 0.42) : Math.max(20, 78 - bias * 0.55);
  return (
    <div className="lab-body">
      <div className="segmented">
        <HeroButton className={mode === "repeat" ? "active" : ""} onPress={() => setMode("repeat")}>重复同通道</HeroButton>
        <HeroButton className={mode === "multi" ? "active" : ""} onPress={() => setMode("multi")}>多通道互证</HeroButton>
      </div>
      <Dial label="系统偏差" value={bias} setValue={setBias} />
      <div className="evidence-chain">
        {["海岸线", "古地磁", "古生物", "海底年龄"].map((item, index) => <span className={mode === "multi" || index === 0 ? "active" : ""} key={item}>{item}</span>)}
      </div>
      <Metric label="结论可靠度" value={`${Math.round(reliability)}%`} tone={reliability > 70 ? "green" : "amber"} />
      <p className="lab-result">同通道重复能排除偶然噪声，多通道互证更能对抗系统性偏差。</p>
    </div>
  );
}

function StorageChainLab() {
  const [redundancy, setRedundancy] = useState(55);
  const [damage, setDamage] = useState(25);
  const [decoder, setDecoder] = useState(70);
  const recovery = Math.max(0, Math.min(100, redundancy * 0.45 + decoder * 0.55 - damage * 0.65));
  return (
    <div className="lab-body">
      <Dial label="载体冗余" value={redundancy} setValue={setRedundancy} />
      <Dial label="载体腐蚀" value={damage} setValue={setDamage} />
      <Dial label="解码能力" value={decoder} setValue={setDecoder} />
      <div className="storage-chain"><span>秦王朝 A</span><i>史书/文物 B</i><span>历史学家 C</span></div>
      <StorageArtifacts redundancy={redundancy} damage={damage} decoder={decoder} />
      <Metric label="信息恢复率" value={`${Math.round(recovery)}%`} tone={recovery > 70 ? "green" : "amber"} />
    </div>
  );
}

function ReasoningSpaceLab() {
  const [evidence, setEvidence] = useState(55);
  const [baseRate, setBaseRate] = useState(20);
  const posterior = Math.min(95, Math.max(2, baseRate + evidence * 0.62));
  return (
    <div className="lab-body">
      <div className="venn-box"><span>动物</span><span>狗</span><span>花狗</span></div>
      <Dial label="井水证据" value={evidence} setValue={setEvidence} />
      <Dial label="地震基线" value={baseRate} setValue={setBaseRate} />
      <Metric label="更新后概率" value={`${Math.round(posterior)}%`} tone={posterior > 65 ? "amber" : "blue"} />
      <p className="lab-result">思维把多个信息关系加工成新判断：集合包含给出确定推理，概率更新处理不确定证据。</p>
    </div>
  );
}

function OrganizationSpaceLab() {
  const [rule, setRule] = useState(0);
  const rules = ["无组织", "排队", "正三角", "固定岗位"];
  const possibilities = [100, 38, 18, 6][rule];
  return (
    <div className="lab-body">
      <div className="segmented">{rules.map((item, index) => <HeroButton key={item} className={rule === index ? "active" : ""} onPress={() => setRule(index)}>{item}</HeroButton>)}</div>
      <div className={`people-board rule-${rule}`}><i>A</i><i>B</i><i>C</i></div>
      <div className="metrics-grid">
        <Metric label="联系可能性" value={`${possibilities}%`} tone={possibilities < 25 ? "green" : "amber"} />
        <Metric label="组织程度" value={`${100 - possibilities}%`} tone={possibilities < 25 ? "green" : "blue"} />
      </div>
      <p className="lab-result">组织不是简单聚集，而是减少任意联系，建立稳定关系。</p>
    </div>
  );
}

function ConceptLabFrame({
  type,
  children,
  scoreLabel = "系统指标",
}: {
  type: LabType;
  children: (state: { a: number; b: number; setA: (value: number) => void; setB: (value: number) => void; value: number; config: (typeof systemLabConfig)[string] }) => ReactNode;
  scoreLabel?: string;
}) {
  const [a, setA] = useState(52);
  const [b, setB] = useState(36);
  const config = systemLabConfig[type] ?? systemLabConfig["causal-network"];
  const value = Math.max(0, Math.min(100, config.compute(a, b)));
  const guide = labExperienceGuide[type];
  return (
    <div className="lab-body">
      <div className="control-causality">
        <div>
          <span>输入 A</span>
          <strong>{config.primary}</strong>
        </div>
        <i>+</i>
        <div>
          <span>输入 B</span>
          <strong>{config.secondary}</strong>
        </div>
        <i>→</i>
        <div>
          <span>观察结果</span>
          <strong>{guide?.feedback ?? scoreLabel}</strong>
        </div>
      </div>
      <Dial label={config.primary} value={a} setValue={setA} />
      <Dial label={config.secondary} value={b} setValue={setB} />
      {children({ a, b, setA, setB, value, config })}
      <div className="metrics-grid">
        <Metric label={scoreLabel} value={`${Math.round(value)}%`} tone={value > config.good ? "green" : value > config.warn ? "amber" : "red"} />
        <Metric label="判断" value={config.label(value)} tone={value > config.good ? "green" : value > config.warn ? "amber" : "red"} />
      </div>
      <p className="lab-result">{config.result}</p>
    </div>
  );
}

function CausalNetworkLab() {
  return (
    <ConceptLabFrame type="causal-network" scoreLabel="扩散范围">
      {({ a, b }) => <NetworkBoard strength={a} spread={b} />}
    </ConceptLabFrame>
  );
}

function BoundaryLab() {
  return (
    <ConceptLabFrame type="isolated-system" scoreLabel="边界质量">
      {({ a, b }) => (
        <div className="boundary-lab">
          <div className="boundary-ring" style={{ width: `${38 + a * 0.52}%`, height: `${38 + a * 0.52}%` }}>
            <span>系统边界</span>
          </div>
          {["输入", "扰动", "依赖", "输出"].map((item, index) => <i key={item} style={{ opacity: 0.35 + b / 160, rotate: `${index * 72}deg` }}>{item}</i>)}
        </div>
      )}
    </ConceptLabFrame>
  );
}

function SteadyStructureLab() {
  return (
    <ConceptLabFrame type="steady-structure" scoreLabel="稳态保持">
      {({ a, b }) => <PotentialWellScene depth={a} disturbance={b} label="结构关系仍保持" />}
    </ConceptLabFrame>
  );
}

function PredictionLab() {
  return (
    <ConceptLabFrame type="prediction-model" scoreLabel="预测可信度">
      {({ a, b }) => <ForecastBands stability={a} shock={b} />}
    </ConceptLabFrame>
  );
}

function BalanceStabilityLab() {
  return (
    <ConceptLabFrame type="equilibrium-stability" scoreLabel="扰动恢复">
      {({ a, b }) => <BalanceBoard pull={a} disturbance={b} />}
    </ConceptLabFrame>
  );
}

function OscillationTunerLab() {
  return (
    <ConceptLabFrame type="oscillation" scoreLabel="振荡风险">
      {({ a, b }) => <OscillationScope gain={a} delay={b} />}
    </ConceptLabFrame>
  );
}

function UltrastabilityLab() {
  return (
    <ConceptLabFrame type="ultrastability" scoreLabel="再稳定能力">
      {({ a, b }) => <StrategySwitcher search={a} change={b} />}
    </ConceptLabFrame>
  );
}

function EvolutionTreeLab() {
  return (
    <ConceptLabFrame type="system-evolution" scoreLabel="适应形成">
      {({ a, b }) => <EvolutionTree variation={a} selection={b} />}
    </ConceptLabFrame>
  );
}

function CollapseChainLab() {
  return (
    <ConceptLabFrame type="system-collapse" scoreLabel="崩溃风险">
      {({ a, b }) => <ChainReaction factor={a} constraint={b} />}
    </ConceptLabFrame>
  );
}

function SelfOrganizationLab() {
  return (
    <ConceptLabFrame type="self-organization" scoreLabel="秩序涌现">
      {({ a, b }) => <SelfOrgGrid rule={a} noise={b} />}
    </ConceptLabFrame>
  );
}

function IntelligenceAmplifierLab() {
  return (
    <ConceptLabFrame type="intelligence-amplifier" scoreLabel="有效放大">
      {({ a, b }) => <AmplifierPipeline power={a} check={b} />}
    </ConceptLabFrame>
  );
}

function QualitativeProblemLab() {
  return (
    <ConceptLabFrame type="qualitative-problem" scoreLabel="质变概率">
      {({ a, b }) => <TwoPathDebate pressure={a} resilience={b} />}
    </ConceptLabFrame>
  );
}

function LeapGradualLab() {
  return (
    <ConceptLabFrame type="leap-gradual" scoreLabel="飞跃倾向">
      {({ a, b }) => <LeapGradualTrack threshold={a} intermediates={b} />}
    </ConceptLabFrame>
  );
}

function StableQualityLab() {
  return (
    <ConceptLabFrame type="stable-quality" scoreLabel="性质保持">
      {({ a, b }) => <MoleculeStability strength={a} disturbance={b} />}
    </ConceptLabFrame>
  );
}

function PotentialWellLab() {
  return (
    <ConceptLabFrame type="potential-well" scoreLabel="回稳能力">
      {({ a, b }) => <PotentialWellScene depth={a} disturbance={b} label="小球回到坑底" />}
    </ConceptLabFrame>
  );
}

function PhaseTransitionLab() {
  return (
    <ConceptLabFrame type="phase-transition" scoreLabel="跳变风险">
      {({ a, b }) => <TippingBlock force={a} margin={b} />}
    </ConceptLabFrame>
  );
}

function DetectLeapLab() {
  return (
    <ConceptLabFrame type="detect-leap" scoreLabel="飞跃判据">
      {({ a, b }) => <LeapDetector speed={a} recovery={b} />}
    </ConceptLabFrame>
  );
}

function TransitionConditionLab() {
  return (
    <ConceptLabFrame type="transition-condition" scoreLabel="跳变倾向">
      {({ a, b }) => <ConditionMixer speed={a} intermediates={b} />}
    </ConceptLabFrame>
  );
}

function CatastropheNodeLab() {
  const [control, setControl] = useState(48);
  const [tension, setTension] = useState(58);
  const twoStable = tension > 46;
  const jumpLeft = 34 + (tension - 46) * 0.18;
  const jumpRight = 66 - (tension - 46) * 0.18;
  const inJumpBand = twoStable && control > jumpLeft && control < jumpRight;
  const branch = !twoStable ? "单稳态" : control < jumpLeft ? "下稳定支" : control > jumpRight ? "上稳定支" : "滞后区";
  const risk = !twoStable ? 18 : inJumpBand ? 92 : 54;
  return (
    <div className="lab-body">
      <Dial label="控制量" value={control} setValue={setControl} />
      <Dial label="结构张力" value={tension} setValue={setTension} />
      <CatastropheSurface control={control} tension={tension} jumpLeft={jumpLeft} jumpRight={jumpRight} />
      <div className="metrics-grid">
        <Metric label="稳定分支" value={twoStable ? "2 条" : "1 条"} tone={twoStable ? "amber" : "green"} />
        <Metric label="当前状态" value={branch} tone={inJumpBand ? "red" : twoStable ? "amber" : "green"} />
        <Metric label="跳变风险" value={`${Math.round(risk)}%`} tone={risk > 80 ? "red" : risk > 45 ? "amber" : "green"} />
        <Metric label="路径依赖" value={twoStable ? "明显" : "较弱"} tone={twoStable ? "amber" : "green"} />
      </div>
      <p className={`lab-result ${inJumpBand ? "danger" : ""}`}>
        {inJumpBand
          ? "已经进入滞后跳变带：系统可能仍停在旧分支，但再小的参数变化就会让旧稳定点消失，状态跃迁到另一分支。"
          : twoStable
            ? "当前处在双稳态区域：同样参数下可能存在两个稳定结果，平均值会掩盖真实结构。"
            : "当前处在单稳态区域：扰动会被拉回同一稳定分支，变化更接近平滑调节。"}
      </p>
    </div>
  );
}

function OvercorrectionLab() {
  return (
    <ConceptLabFrame type="overcorrection" scoreLabel="矫正有效">
      {({ a, b }) => <CorrectionArc correction={a} attraction={b} />}
    </ConceptLabFrame>
  );
}

function CoexistenceLab() {
  return (
    <ConceptLabFrame type="coexistence" scoreLabel="两极分化">
      {({ a, b }) => <DualAttractor split={a} pressure={b} />}
    </ConceptLabFrame>
  );
}

function CommonMissionLab() {
  return (
    <ConceptLabFrame type="common-mission" scoreLabel="分析完整度">
      {({ a, b }) => <MissionMap stable={a} parameter={b} />}
    </ConceptLabFrame>
  );
}

function BlackBoxLab() {
  return (
    <ConceptLabFrame type="black-box" scoreLabel="识别能力">
      {({ a, b }) => <BlackBoxProbe input={a} output={b} />}
    </ConceptLabFrame>
  );
}

function EpistemologyLoopLab() {
  return (
    <ConceptLabFrame type="epistemology-model" scoreLabel="认知改进">
      {({ a, b }) => <KnowledgeLoop feedback={a} update={b} />}
    </ConceptLabFrame>
  );
}

function ObservabilityControlLab() {
  return (
    <ConceptLabFrame type="observability-control" scoreLabel="认识上限">
      {({ a, b }) => <VariableMatrix observe={a} control={b} />}
    </ConceptLabFrame>
  );
}

function TheoryClarityLab() {
  return (
    <ConceptLabFrame type="theory-clarity" scoreLabel="可检验度">
      {({ a, b }) => <ClarityChecklist variables={a} prediction={b} />}
    </ConceptLabFrame>
  );
}

function ConvergenceSpeedLab() {
  return (
    <ConceptLabFrame type="convergence-speed" scoreLabel="逼近速度">
      {({ a, b }) => <ConvergenceCurve quality={a} frequency={b} />}
    </ConceptLabFrame>
  );
}

function OverfeedbackLab() {
  return (
    <ConceptLabFrame type="overfeedback" scoreLabel="过度风险">
      {({ a, b }) => <OverfeedbackMeter frequency={a} noise={b} />}
    </ConceptLabFrame>
  );
}

function DecidabilityLab() {
  return (
    <ConceptLabFrame type="decidability" scoreLabel="可判定性">
      {({ a, b }) => <DecisionThreshold evidence={a} rule={b} />}
    </ConceptLabFrame>
  );
}

function ScienceHumanLab() {
  return (
    <ConceptLabFrame type="science-human" scoreLabel="协作质量">
      {({ a, b }) => <HumanScienceBalance automation={a} review={b} />}
    </ConceptLabFrame>
  );
}

function PotentialWellScene({ depth, disturbance, label }: { depth: number; disturbance: number; label: string }) {
  const ball = Math.max(8, Math.min(88, 50 + (disturbance - depth) * 0.55));
  return (
    <div className="concept-canvas well-scene">
      <div className="well-basin" style={{ height: `${46 + depth * 0.28}%` }} />
      <motion.div className="well-ball" animate={{ left: `${ball}%`, y: disturbance > depth ? -18 : 0 }} />
      <span>{label}</span>
    </div>
  );
}

function ForecastBands({ stability, shock }: { stability: number; shock: number }) {
  return (
    <div className="concept-canvas forecast-bands">
      {Array.from({ length: 7 }, (_, index) => {
        const spread = 10 + shock * 0.18 + index * (100 - stability) * 0.018;
        return <i key={index} style={{ width: `${88 - spread}%`, opacity: 0.95 - index * 0.09 }} />;
      })}
      <span>结构越稳定，未来带越窄</span>
    </div>
  );
}

function BalanceBoard({ pull, disturbance }: { pull: number; disturbance: number }) {
  const tilt = (disturbance - pull) * 0.22;
  return (
    <div className="concept-canvas balance-board">
      <motion.div className="balance-plank" animate={{ rotate: tilt }} />
      <motion.i animate={{ x: (disturbance - pull) * 0.72 }} />
      <span>扰动后是否回到中心</span>
    </div>
  );
}

function OscillationScope({ gain, delay }: { gain: number; delay: number }) {
  const amp = 10 + gain * 0.32 + delay * 0.25;
  const points = Array.from({ length: 36 }, (_, index) => `${(index / 35) * 100},${50 - Math.sin(index * 0.62) * amp}`).join(" ");
  return (
    <div className="concept-canvas scope-canvas">
      <svg viewBox="0 0 100 100"><line x1="0" x2="100" y1="50" y2="50" /><polyline points={points} /></svg>
      <span>增益和延迟共同制造摆动</span>
    </div>
  );
}

function StrategySwitcher({ search, change }: { search: number; change: number }) {
  const active = search > change ? 2 : search > 42 ? 1 : 0;
  return (
    <div className="concept-canvas strategy-cards">
      {["参数调节", "切换策略", "重组结构"].map((item, index) => <i className={index <= active ? "active" : ""} key={item}>{item}</i>)}
      <span>普通调节失败时，进入结构搜索</span>
    </div>
  );
}

function EvolutionTree({ variation, selection }: { variation: number; selection: number }) {
  const branches = Math.max(3, Math.round(variation / 13));
  const survivors = Math.max(1, Math.round(branches * (1 - selection / 130)));
  return (
    <div className="concept-canvas evolution-tree">
      <strong>祖先结构</strong>
      <div>{Array.from({ length: branches }, (_, index) => <i className={index < survivors ? "active" : ""} key={index}>分支 {index + 1}</i>)}</div>
      <span>变异产生分支，选择保留路径</span>
    </div>
  );
}

function ChainReaction({ factor, constraint }: { factor: number; constraint: number }) {
  const active = Math.min(12, Math.max(1, Math.round((factor - constraint * 0.35) / 7)));
  return (
    <div className="concept-canvas chain-grid">
      {Array.from({ length: 12 }, (_, index) => <i className={index < active ? "active" : ""} key={index}>{index + 1}</i>)}
      <span>复制因子超过约束时，链式反应扩散</span>
    </div>
  );
}

function SelfOrgGrid({ rule, noise }: { rule: number; noise: number }) {
  return (
    <div className="concept-canvas self-grid">
      {Array.from({ length: 25 }, (_, index) => {
        const aligned = rule - noise + (index % 5) * 4 > 28;
        return <i className={aligned ? "active" : ""} key={index} style={{ rotate: `${aligned ? 45 : (index * 29) % 160}deg` }} />;
      })}
      <span>局部规则足够强时，整体方向涌现</span>
    </div>
  );
}

function AmplifierPipeline({ power, check }: { power: number; check: number }) {
  return (
    <div className="concept-canvas amplifier-pipeline">
      <i>人</i><b style={{ width: `${28 + power * 0.48}%` }}>工具放大</b><i>产出</i>
      <em style={{ width: `${check}%` }}>校验回路</em>
      <span>放大越强，越需要校验闭环</span>
    </div>
  );
}

function TwoPathDebate({ pressure, resilience }: { pressure: number; resilience: number }) {
  return (
    <div className="concept-canvas two-path">
      <i className={pressure > resilience ? "active" : ""}>飞跃路径</i>
      <i className={pressure <= resilience ? "active" : ""}>渐变路径</i>
      <span>同一质变问题，要看稳定结构条件</span>
    </div>
  );
}

function LeapGradualTrack({ threshold, intermediates }: { threshold: number; intermediates: number }) {
  const steps = Math.max(2, Math.round(intermediates / 16));
  return (
    <div className="concept-canvas transition-track">
      {Array.from({ length: steps }, (_, index) => <i key={index} />)}
      <b style={{ left: `${threshold}%` }}>阈值</b>
      <span>中间态越多，过渡越连续</span>
    </div>
  );
}

function MoleculeStability({ strength, disturbance }: { strength: number; disturbance: number }) {
  return (
    <div className="concept-canvas molecule">
      {Array.from({ length: 7 }, (_, index) => <i className={disturbance > strength && index > 4 ? "loose" : ""} key={index} />)}
      <span>结构强度决定性质能否抗干扰</span>
    </div>
  );
}

function TippingBlock({ force, margin }: { force: number; margin: number }) {
  const angle = force > margin ? Math.min(78, (force - margin) * 1.4) : Math.max(0, (force - margin) * 0.3);
  return (
    <div className="concept-canvas tipping-block">
      <motion.i animate={{ rotate: angle }} />
      <b style={{ width: `${force}%` }}>推力 F</b>
      <span>连续推力跨过余量后，木块翻倒</span>
    </div>
  );
}

function LeapDetector({ speed, recovery }: { speed: number; recovery: number }) {
  return (
    <div className="concept-canvas detector">
      <i className={speed > recovery ? "danger" : ""}>边界</i>
      <b style={{ width: `${speed}%` }}>变化速度</b>
      <em style={{ width: `${recovery}%` }}>恢复能力</em>
      <span>越过性质边界并形成新稳态，才是飞跃</span>
    </div>
  );
}

function ConditionMixer({ speed, intermediates }: { speed: number; intermediates: number }) {
  return (
    <div className="concept-canvas condition-mixer">
      <i style={{ height: `${speed}%` }}>速度</i>
      <i style={{ height: `${intermediates}%` }}>中间态</i>
      <span>{speed > intermediates ? "倾向飞跃" : "倾向渐变"}</span>
    </div>
  );
}

function CatastropheSurface({ control, tension, jumpLeft, jumpRight }: { control: number; tension: number; jumpLeft: number; jumpRight: number }) {
  const stateY = tension > 46 && control > jumpRight ? 28 : tension > 46 && control < jumpLeft ? 72 : 50;
  const markerX = Math.max(8, Math.min(92, control));
  const cuspWidth = Math.max(0, jumpRight - jumpLeft);
  return (
    <div className="concept-canvas catastrophe-surface">
      <svg viewBox="0 0 100 100" aria-label="尖点突变示意图">
        <line className="axis" x1="8" x2="92" y1="50" y2="50" />
        <line className="axis" x1="50" x2="50" y1="12" y2="88" />
        <path className="branch stable upper" d="M12 26 C28 22, 38 24, 48 36 C56 46, 64 50, 88 42" />
        <path className="branch unstable" d="M20 72 C34 62, 42 58, 50 50 C58 42, 66 38, 80 28" />
        <path className="branch stable lower" d="M12 74 C28 78, 38 76, 48 64 C56 54, 64 50, 88 58" />
        <rect className="jump-band" x={jumpLeft} y="18" width={cuspWidth} height="64" opacity={tension > 46 ? 1 : 0.22} />
        <path className="hysteresis" d={`M${jumpLeft} 72 L${jumpLeft} 36 M${jumpRight} 28 L${jumpRight} 64`} />
      </svg>
      <i style={{ left: `${markerX}%`, top: `${stateY}%` }} />
      <b className="cusp-label top">上稳定支</b>
      <b className="cusp-label bottom">下稳定支</b>
      <em>黄色区 = 旧稳定分支将消失的滞后跳变带</em>
      <span>尖点模型：控制量缓慢变化，状态可能突然换到另一稳定分支</span>
    </div>
  );
}

function CorrectionArc({ correction, attraction }: { correction: number; attraction: number }) {
  return (
    <div className="concept-canvas correction-arc">
      <i>旧态</i><b style={{ width: `${correction}%` }}>修正力度</b><i>目标</i>
      <em style={{ width: `${attraction}%` }}>旧态吸引</em>
      <span>力度不足会回旧态，过强会越过目标</span>
    </div>
  );
}

function DualAttractor({ split, pressure }: { split: number; pressure: number }) {
  const gap = Math.max(8, split - pressure * 0.35);
  return (
    <div className="concept-canvas dual-attractor">
      <i style={{ left: `${32 - gap * 0.12}%` }}>极端 A</i>
      <i style={{ right: `${32 - gap * 0.12}%` }}>极端 B</i>
      <span>两个吸引域同时稳定时，极端可以共存</span>
    </div>
  );
}

function MissionMap({ stable, parameter }: { stable: number; parameter: number }) {
  return (
    <div className="concept-canvas mission-map">
      {["稳定机制", "控制参数", "关节点", "新质态"].map((item, index) => <i className={index * 25 < stable + parameter * 0.5 ? "active" : ""} key={item}>{item}</i>)}
      <span>把哲学问题接到数学模型和工程判断</span>
    </div>
  );
}

function BlackBoxProbe({ input, output }: { input: number; output: number }) {
  return (
    <div className="concept-canvas blackbox-probe">
      <b style={{ width: `${input}%` }}>输入刺激</b>
      <i>黑箱</i>
      <b style={{ width: `${output}%` }}>输出可见</b>
      <span>看不见内部，也能通过输入输出建模</span>
    </div>
  );
}

function KnowledgeLoop({ feedback, update }: { feedback: number; update: number }) {
  return (
    <div className="concept-canvas knowledge-loop">
      {["行动", "反馈", "模型", "再行动"].map((item, index) => <i className={index < Math.round((feedback + update) / 50) ? "active" : ""} key={item}>{item}</i>)}
      <span>认识是循环更新，不是一次照相</span>
    </div>
  );
}

function VariableMatrix({ observe, control }: { observe: number; control: number }) {
  return (
    <div className="concept-canvas variable-matrix">
      {Array.from({ length: 16 }, (_, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const active = row * 25 < observe && col * 25 < control;
        return <i className={active ? "active" : ""} key={index} />;
      })}
      <span>能看见且能干预的变量，才真正进入认识闭环</span>
    </div>
  );
}

function ClarityChecklist({ variables, prediction }: { variables: number; prediction: number }) {
  const active = Math.round((variables + prediction) / 34);
  return (
    <div className="concept-canvas clarity-list">
      {["变量定义", "关系明确", "预测可检验", "反例可判定", "可复现实验"].map((item, index) => <i className={index < active ? "active" : ""} key={item}>{item}</i>)}
    </div>
  );
}

function ConvergenceCurve({ quality, frequency }: { quality: number; frequency: number }) {
  const points = Array.from({ length: 20 }, (_, index) => {
    const error = 88 * Math.exp(-index * (quality + frequency) / 2600) + Math.sin(index) * (100 - quality) * 0.08;
    return `${(index / 19) * 100},${error}`;
  }).join(" ");
  return (
    <div className="concept-canvas convergence-curve">
      <svg viewBox="0 0 100 100"><polyline points={points} /></svg>
      <span>高质量反馈让误差稳定下降</span>
    </div>
  );
}

function OverfeedbackMeter({ frequency, noise }: { frequency: number; noise: number }) {
  return (
    <div className="concept-canvas overfeedback-meter">
      <i style={{ width: `${frequency}%` }}>反馈频率</i>
      <i style={{ width: `${noise}%` }}>噪声水平</i>
      <b className={frequency + noise > 120 ? "danger" : ""}>追噪声风险</b>
    </div>
  );
}

function DecisionThreshold({ evidence, rule }: { evidence: number; rule: number }) {
  return (
    <div className="concept-canvas decision-threshold">
      <b style={{ width: `${evidence}%` }}>证据</b>
      <i style={{ left: `${rule}%` }}>判定线</i>
      <span>{evidence >= rule ? "可以判定" : "信息不足"}</span>
    </div>
  );
}

function HumanScienceBalance({ automation, review }: { automation: number; review: number }) {
  return (
    <div className="concept-canvas human-balance">
      <i style={{ flex: automation }}>工具速度</i>
      <i style={{ flex: review }}>人的校验</i>
      <span>科学方法放大能力，也保留人的问题意识和责任</span>
    </div>
  );
}

function SystemChapterLab({ type }: { type: LabType }) {
  const [primary, setPrimary] = useState(48);
  const [secondary, setSecondary] = useState(28);
  const config = systemLabConfig[type] ?? systemLabConfig["causal-network"];
  const value = Math.max(0, Math.min(100, config.compute(primary, secondary)));
  const points = useMemo(() => makeSystemSeries(type, primary / 100, secondary / 100), [type, primary, secondary]);

  return (
    <div className="lab-body">
      <Dial label={config.primary} value={primary} setValue={setPrimary} />
      <Dial label={config.secondary} value={secondary} setValue={setSecondary} />
      {config.mode === "network" ? <NetworkBoard strength={primary} spread={secondary} /> : <LineChart points={points} target={config.target} danger={config.danger} />}
      <div className="metrics-grid">
        <Metric label={config.metric} value={`${Math.round(value)}%`} tone={value > config.good ? "green" : value > config.warn ? "amber" : "red"} />
        <Metric label="系统判断" value={config.label(value)} tone={value > config.good ? "green" : value > config.warn ? "amber" : "red"} />
      </div>
      <p className="lab-result">{config.result}</p>
    </div>
  );
}

const systemLabConfig: Record<string, {
  primary: string;
  secondary: string;
  metric: string;
  target: number;
  good: number;
  warn: number;
  danger?: boolean;
  mode?: "line" | "network";
  compute: (primary: number, secondary: number) => number;
  label: (value: number) => string;
  result: string;
}> = {
  "causal-network": {
    primary: "连接强度",
    secondary: "网络密度",
    metric: "影响扩散",
    target: 60,
    good: 64,
    warn: 36,
    mode: "network",
    compute: (a, b) => (a * 0.55 + b * 0.45),
    label: (v) => v > 64 ? "网络效应明显" : "局部影响",
    result: "因果网络中，一个节点的扰动会沿连接扩散；连接越密，越不能只找单一原因。",
  },
  "isolated-system": {
    primary: "边界半径",
    secondary: "外部扰动",
    metric: "解释有效性",
    target: 52,
    good: 62,
    warn: 34,
    compute: (a, b) => 100 - Math.abs(a - 58) * 0.9 - b * 0.28,
    label: (v) => v > 62 ? "边界合适" : "需重画边界",
    result: "系统边界太小会漏掉外因，太大又难以分析；相对孤立是建模选择。",
  },
  "steady-structure": {
    primary: "恢复力",
    secondary: "扰动",
    metric: "稳态保持",
    target: 55,
    good: 64,
    warn: 34,
    compute: (a, b) => a * 0.9 - b * 0.35 + 28,
    label: (v) => v > 64 ? "稳态可维持" : "结构吃紧",
    result: "稳态不是不动，而是在扰动后仍能维持关键关系。",
  },
  "prediction-model": {
    primary: "结构稳定",
    secondary: "突变概率",
    metric: "预测可信度",
    target: 55,
    good: 68,
    warn: 36,
    compute: (a, b) => a * 0.85 - b * 0.55 + 35,
    label: (v) => v > 68 ? "可预测" : "模型失准",
    result: "预测能力来自稳定结构；结构变化越大，旧模型越快失效。",
  },
  "equilibrium-stability": {
    primary: "回拉强度",
    secondary: "局部扰动",
    metric: "稳定性",
    target: 52,
    good: 62,
    warn: 36,
    compute: (a, b) => a * 0.75 - b * 0.4 + 38,
    label: (v) => v > 62 ? "扰动后回稳" : "偏差扩大",
    result: "均匀只是表面状态；稳定要看扰动后系统会不会回到目标区。",
  },
  oscillation: {
    primary: "反馈增益",
    secondary: "反馈延迟",
    metric: "振荡风险",
    target: 55,
    good: 66,
    warn: 38,
    danger: true,
    compute: (a, b) => a * 0.58 + b * 0.58,
    label: (v) => v > 66 ? "易振荡" : "可衰减",
    result: "过强反馈叠加延迟，会让修正动作越过目标，形成周期性摆动。",
  },
  ultrastability: {
    primary: "结构搜索",
    secondary: "环境变化",
    metric: "再稳定能力",
    target: 58,
    good: 62,
    warn: 34,
    compute: (a, b) => a * 0.8 - b * 0.3 + 32,
    label: (v) => v > 62 ? "找到新稳态" : "调节不足",
    result: "超稳定系统在变量调节失败时，会切换结构或策略来寻找新稳定点。",
  },
  "system-evolution": {
    primary: "变异率",
    secondary: "选择压力",
    metric: "适应形成",
    target: 56,
    good: 58,
    warn: 32,
    compute: (a, b) => 100 - Math.abs(a - 48) * 0.6 - Math.abs(b - 62) * 0.55,
    label: (v) => v > 58 ? "路径成形" : "演化分散",
    result: "演化需要变异，也需要选择；两者失衡时系统要么停滞，要么过度分散。",
  },
  "system-collapse": {
    primary: "复制因子",
    secondary: "资源约束",
    metric: "崩溃风险",
    target: 62,
    good: 72,
    warn: 42,
    danger: true,
    compute: (a, b) => a * 0.9 - b * 0.42 + 25,
    label: (v) => v > 72 ? "链式失控" : "仍可约束",
    result: "自繁殖回路超过资源约束时，增长会转成崩溃。",
  },
  "self-organization": {
    primary: "局部规则",
    secondary: "噪声",
    metric: "秩序涌现",
    target: 58,
    good: 62,
    warn: 34,
    compute: (a, b) => a * 0.82 - b * 0.38 + 30,
    label: (v) => v > 62 ? "形成秩序" : "仍然混乱",
    result: "自组织来自局部规则、反馈和环境约束，不需要中央逐项命令。",
  },
  "intelligence-amplifier": {
    primary: "工具倍数",
    secondary: "校验强度",
    metric: "有效放大",
    target: 60,
    good: 62,
    warn: 36,
    compute: (a, b) => a * 0.55 + b * 0.55 - Math.max(0, a - b) * 0.38,
    label: (v) => v > 62 ? "放大有效" : "错误风险高",
    result: "智力放大需要校验回路；只提高速度，会同步放大错误。",
  },
  "qualitative-problem": {
    primary: "渐变压力",
    secondary: "结构韧性",
    metric: "质变概率",
    target: 58,
    good: 64,
    warn: 36,
    danger: true,
    compute: (a, b) => a * 0.82 - b * 0.38 + 28,
    label: (v) => v > 64 ? "接近飞跃" : "仍在渐变",
    result: "质变不是口号，而是稳定结构在控制参数推动下发生改变。",
  },
  "leap-gradual": {
    primary: "阈值清晰",
    secondary: "中间态数量",
    metric: "飞跃倾向",
    target: 56,
    good: 62,
    warn: 34,
    compute: (a, b) => a * 0.78 - b * 0.35 + 34,
    label: (v) => v > 62 ? "飞跃明显" : "渐变明显",
    result: "阈值尖锐时更像飞跃，中间态充分时更像渐变。",
  },
  "stable-quality": {
    primary: "结构强度",
    secondary: "外部干扰",
    metric: "性质保持",
    target: 55,
    good: 62,
    warn: 34,
    compute: (a, b) => a * 0.86 - b * 0.42 + 32,
    label: (v) => v > 62 ? "性质稳定" : "性质松动",
    result: "确定性质来自稳态结构对常见扰动的抵抗。",
  },
  "potential-well": {
    primary: "势阱深度",
    secondary: "扰动冲击",
    metric: "回稳能力",
    target: 54,
    good: 62,
    warn: 34,
    compute: (a, b) => a * 0.9 - b * 0.48 + 30,
    label: (v) => v > 62 ? "滚回洼地" : "逃离势阱",
    result: "坑中小球的直觉是：稳定机制让偏离后的状态回到吸引点。",
  },
  "phase-transition": {
    primary: "控制参数",
    secondary: "稳定余量",
    metric: "跳变风险",
    target: 60,
    good: 66,
    warn: 38,
    danger: true,
    compute: (a, b) => a * 0.86 - b * 0.36 + 25,
    label: (v) => v > 66 ? "突变临界" : "仍可承受",
    result: "控制参数连续改变，可能让旧稳定点消失并触发跳变。",
  },
  "detect-leap": {
    primary: "变化速度",
    secondary: "恢复能力",
    metric: "飞跃判据",
    target: 58,
    good: 64,
    warn: 36,
    compute: (a, b) => a * 0.72 - b * 0.34 + 36,
    label: (v) => v > 64 ? "跨过边界" : "短期波动",
    result: "大波动不等于飞跃；旧结构失效且新稳态形成才是飞跃。",
  },
  "transition-condition": {
    primary: "变化速度",
    secondary: "中间态",
    metric: "跳变倾向",
    target: 56,
    good: 62,
    warn: 34,
    compute: (a, b) => a * 0.7 - b * 0.42 + 38,
    label: (v) => v > 62 ? "倾向飞跃" : "倾向渐变",
    result: "飞跃或渐变取决于速度、中间态、稳定机制和扰动条件。",
  },
  "catastrophe-node": {
    primary: "参数 A",
    secondary: "参数 B",
    metric: "分岔强度",
    target: 60,
    good: 64,
    warn: 36,
    mode: "network",
    compute: (a, b) => Math.abs(a - b) * 0.45 + Math.min(a, b) * 0.55,
    label: (v) => v > 64 ? "关节点附近" : "单稳态区域",
    result: "多控制参数会形成折叠面和分岔边界，关节点附近小变化可能造成大跳变。",
  },
  overcorrection: {
    primary: "修正力度",
    secondary: "旧态吸引",
    metric: "矫正有效",
    target: 54,
    good: 58,
    warn: 34,
    compute: (a, b) => 100 - Math.abs(a - (b + 18)) * 0.72,
    label: (v) => v > 58 ? "力度合适" : "过弱或过强",
    result: "矫枉有时需要越过旧势阱，但必须靠反馈避免新偏差。",
  },
  coexistence: {
    primary: "双稳态强度",
    secondary: "平均化压力",
    metric: "两极分化",
    target: 55,
    good: 62,
    warn: 34,
    compute: (a, b) => a * 0.8 - b * 0.36 + 30,
    label: (v) => v > 62 ? "极端共存" : "趋向单峰",
    result: "多吸引域会让系统同时保留不同极端，平均值会遮蔽结构。",
  },
  "common-mission": {
    primary: "稳定机制",
    secondary: "参数识别",
    metric: "分析完整度",
    target: 58,
    good: 62,
    warn: 34,
    compute: (a, b) => a * 0.52 + b * 0.52,
    label: (v) => v > 62 ? "框架完整" : "还缺环节",
    result: "质变分析要把稳定机制、控制参数、关节点和新质态连成一套语言。",
  },
  "black-box": {
    primary: "输入设计",
    secondary: "输出可见",
    metric: "识别能力",
    target: 58,
    good: 62,
    warn: 34,
    compute: (a, b) => a * 0.5 + b * 0.58,
    label: (v) => v > 62 ? "模型成形" : "黑箱仍暗",
    result: "黑箱可通过输入输出关系被逐步认识，而不是只能等待内部透明。",
  },
  "epistemology-model": {
    primary: "反馈质量",
    secondary: "更新速度",
    metric: "认知改进",
    target: 58,
    good: 62,
    warn: 34,
    compute: (a, b) => a * 0.58 + b * 0.42,
    label: (v) => v > 62 ? "模型逼近" : "修正缓慢",
    result: "认识是行动、反馈和模型更新的循环。",
  },
  "observability-control": {
    primary: "可观察性",
    secondary: "可控制性",
    metric: "认识上限",
    target: 58,
    good: 62,
    warn: 34,
    compute: (a, b) => Math.sqrt(a * b),
    label: (v) => v > 62 ? "变量充分" : "存在盲区",
    result: "只看得见或只动得了都不够，认识上限由两者共同限制。",
  },
  "theory-clarity": {
    primary: "变量定义",
    secondary: "预测精度",
    metric: "可检验度",
    target: 58,
    good: 62,
    warn: 34,
    compute: (a, b) => a * 0.48 + b * 0.58,
    label: (v) => v > 62 ? "理论清晰" : "叙述模糊",
    result: "清晰理论要能导出可观察差异，而不是解释一切。",
  },
  "convergence-speed": {
    primary: "信息质量",
    secondary: "反馈频率",
    metric: "逼近速度",
    target: 58,
    good: 62,
    warn: 34,
    compute: (a, b) => a * 0.56 + b * 0.44,
    label: (v) => v > 62 ? "快速收敛" : "逼近缓慢",
    result: "模型逼近速度来自高质量信息、合适反馈和有效修正。",
  },
  overfeedback: {
    primary: "反馈频率",
    secondary: "噪声水平",
    metric: "过度风险",
    target: 62,
    good: 70,
    warn: 42,
    danger: true,
    compute: (a, b) => a * 0.62 + b * 0.56,
    label: (v) => v > 70 ? "追逐噪声" : "节奏可控",
    result: "反馈太频繁且噪声高时，系统会追逐随机波动。",
  },
  decidability: {
    primary: "证据数量",
    secondary: "判定规则",
    metric: "可判定性",
    target: 58,
    good: 62,
    warn: 34,
    compute: (a, b) => Math.min(a, b) * 0.72 + Math.max(a, b) * 0.22,
    label: (v) => v > 62 ? "可以判定" : "证据不足",
    result: "可判定需要状态可分、证据足够、规则明确。",
  },
  "science-human": {
    primary: "自动化",
    secondary: "人工校验",
    metric: "协作质量",
    target: 58,
    good: 62,
    warn: 34,
    compute: (a, b) => a * 0.38 + b * 0.62 - Math.max(0, a - b) * 0.22,
    label: (v) => v > 62 ? "协作平衡" : "责任失衡",
    result: "科学方法扩展人的认识，但问题定义、价值判断和责任仍要由人承担。",
  },
};

function NetworkBoard({ strength, spread }: { strength: number; spread: number }) {
  const active = Math.round((strength + spread) / 28);
  return (
    <div className="network-board">
      {Array.from({ length: 8 }, (_, index) => <span className={index <= active ? "active" : ""} key={index}>{index + 1}</span>)}
      <i />
      <i />
      <i />
    </div>
  );
}

function makeSystemSeries(type: LabType, primary: number, secondary: number) {
  const values: number[] = [];
  let value = 34 + primary * 24;
  for (let i = 0; i < 24; i += 1) {
    const wave = Math.sin(i * (type === "oscillation" ? 0.85 : 0.45)) * secondary * 32;
    if (type === "oscillation") value = 55 + Math.sin(i * (0.35 + secondary)) * (16 + primary * 42);
    else if (type === "system-collapse") value = Math.min(96, value * (1 + primary * 0.06) - secondary * 2.2);
    else value += (55 - value) * primary * 0.16 + wave * 0.05;
    values.push(Math.max(4, Math.min(96, value)));
  }
  return values;
}

function Dial({ label, value, setValue }: { label: string; value: number; setValue: (value: number) => void }) {
  return (
    <label className="slider-row">
      <span>{label}</span>
      <div className="range-control">
        <input type="range" min="0" max="100" value={value} onChange={(event) => setValue(Number(event.target.value))} />
        <small><em>低</em><em>高</em></small>
      </div>
      <strong>{value}%</strong>
    </label>
  );
}

function Bar({ label, value, tone }: { label: string; value: number; tone: "green" | "amber" | "red" }) {
  return (
    <div className={`yield-bar ${tone}`}>
      <span>{label}</span>
      <div><motion.i animate={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
      <strong>{Math.round(value)}%</strong>
    </div>
  );
}

function SearchGrid({
  target,
  traps,
  history,
  count = 12,
  excluded = [],
  disabledItems = [],
  onPick,
}: {
  target: number;
  traps: number[];
  history: number[];
  count?: number;
  excluded?: number[];
  disabledItems?: number[];
  onPick?: (index: number) => void;
}) {
  return (
    <div className="search-grid">
      {Array.from({ length: count }, (_, index) => {
        const visited = history.includes(index);
        const last = history.at(-1) === index;
        const disabled = disabledItems.includes(index);
        const className = ["drawer-cell", visited ? "visited" : "", last ? "last" : "", index === target ? "target" : "", traps.includes(index) ? "trap" : "", excluded.includes(index) ? "excluded" : ""].filter(Boolean).join(" ");
        return (
          <HeroButton className={className} isDisabled={disabled} key={index} onPress={() => onPick?.(index)} type="button">
            {index + 1}
          </HeroButton>
        );
      })}
    </div>
  );
}

function makeReactor(sensor: boolean, gain: number, sampleRate: number, disturbance: number) {
  let value = 34;
  const target = 55;
  const points: number[] = [];
  for (let i = 0; i < 24; i += 1) {
    const processNoise = Math.sin(i * 0.8) * disturbance * 24;
    const sampled = i % Math.max(1, Math.round(6 - sampleRate * 5)) === 0;
    if (sensor && sampled) value += (target - value) * gain + processNoise * 0.06;
    else value += 1.1 + processNoise * 0.13;
    points.push(Math.max(8, Math.min(96, value)));
  }
  return points;
}

function LineChart({ points, target, danger = false }: { points: number[]; target: number; danger?: boolean }) {
  const polyline = points.map((point, index) => `${(index / (points.length - 1)) * 100},${100 - point}`).join(" ");
  return (
    <div className={`line-chart ${danger ? "danger" : ""}`}>
      <svg viewBox="0 0 100 100" role="img" aria-label="模拟曲线">
        <line x1="0" x2="100" y1={100 - target} y2={100 - target} />
        <motion.polyline points={polyline} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.7 }} />
      </svg>
    </div>
  );
}

function CandidateGrid({ items, activeItems }: { items: string[]; activeItems: string[] }) {
  return <div className="candidate-grid">{items.map((item) => <span className={activeItems.includes(item) ? "active" : ""} key={item}>{item}</span>)}</div>;
}

function SignalPipe({ clarity }: { clarity: number }) {
  return (
    <div className="signal-pipe">
      <span>信息源</span>
      <motion.i animate={{ opacity: clarity / 100, width: `${clarity}%` }} />
      <span>接收者</span>
    </div>
  );
}

function PositiveLoopSystem({ coupling, damping, final }: { coupling: number; damping: number; final: number }) {
  const heat = Math.min(100, final);
  return (
    <div className={`positive-loop-system ${heat > 70 ? "runaway" : ""}`}>
      <div className="loop-node source">偏差</div>
      <motion.div className="loop-arrow gain" animate={{ opacity: 0.35 + coupling / 140, scaleX: 0.72 + coupling / 160 }} />
      <div className="loop-node amplifier">放大器</div>
      <motion.div className="loop-arrow return" animate={{ opacity: 0.35 + coupling / 140, scaleX: 0.72 + coupling / 160 }} />
      <div className="loop-node brake">阻尼 {damping}%</div>
      <div className="heat-column">
        <motion.i animate={{ height: `${heat}%` }} />
        <span>失控热度</span>
      </div>
    </div>
  );
}

function ChannelEncoder({ states, levels }: { states: number; levels: number }) {
  return (
    <div className="channel-encoder">
      <div className="source-states">
        {Array.from({ length: states }, (_, index) => <i key={index}>S{index + 1}</i>)}
      </div>
      <strong>编码</strong>
      <div className="alarm-levels">
        {Array.from({ length: levels }, (_, index) => <i key={index}>L{index + 1}</i>)}
      </div>
    </div>
  );
}

function StorageArtifacts({ redundancy, damage, decoder }: { redundancy: number; damage: number; decoder: number }) {
  const artifacts = ["竹简", "铭文", "器物", "史书", "遗址", "口传"];
  const activeCount = Math.max(1, Math.round((redundancy / 100) * artifacts.length));
  return (
    <div className="artifact-board">
      {artifacts.map((item, index) => {
        const damaged = index * 16 < damage;
        const decoded = index < activeCount && decoder > 38 + index * 7;
        return <i className={`${damaged ? "damaged" : ""} ${decoded ? "decoded" : ""}`} key={item}>{item}</i>;
      })}
    </div>
  );
}

function ModuleQuiz({ module, answers, setAnswers, answered }: { module: ChapterModule; answers: Record<string, number>; setAnswers: (answers: Record<string, number>) => void; answered: number }) {
  return (
    <section className="module-quiz">
      <div className="quiz-title">
        <GraduationCap size={18} />
        <div>
          <h2>学完检查</h2>
          <p>当前小节 {answered}/{module.quiz.length} 题已答。先操作右侧实验，再用题目确认概念。</p>
        </div>
      </div>
      {module.quiz.map((question, index) => (
        <QuestionCard key={question.prompt} question={question} selected={answers[`${module.id}-${index}`]} onSelect={(value) => setAnswers({ ...answers, [`${module.id}-${index}`]: value })} />
      ))}
    </section>
  );
}

function QuestionCard({ question, selected, onSelect }: { question: QuizQuestion; selected: number | undefined; onSelect: (value: number) => void }) {
  const isCorrect = selected === question.answer;
  return (
    <div className="question-card">
      <div className="question-meta"><span>{question.concept}</span></div>
      <h3>{question.prompt}</h3>
      <div className="option-grid">
        {question.options.map((option, index) => (
          <HeroButton key={option} className={`${selected === index ? "selected" : ""} ${selected !== undefined && index === question.answer ? "answer" : ""}`} onPress={() => onSelect(index)}>
            <span>{String.fromCharCode(65 + index)}</span>
            {option}
          </HeroButton>
        ))}
      </div>
      <AnimatePresence>
        {selected !== undefined && (
          <motion.p className={`explanation ${isCorrect ? "right" : "wrong"}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            {isCorrect ? "回答正确。" : "这里需要回到案例结构。"}
            {question.explanation}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
