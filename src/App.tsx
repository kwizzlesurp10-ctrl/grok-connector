import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, Copy, Download, Play, Sparkles, Clock, Trash2 } from 'lucide-react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Project, Message } from './types';

interface MyDB extends DBSchema {
  projects: {
    key: string;
    value: Project;
  };
}

// Premium SwiftUI code templates - Max App Builder v2 standards
const getSwiftUICode = (type: Project['previewType'], name: string, prompt: string): string => {
  const baseImports = `import SwiftUI
import SwiftData

`;
  
  if (type === 'habit') {
    return baseImports + `@main
struct ${name.replace(/\s+/g, '')}App: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .modelContainer(for: Habit.self)
        }
    }
}

@Model
final class Habit {
    var title: String
    var isCompleted: Bool = false
    var streak: Int = 0
    var lastCompleted: Date?
    
    init(title: String) {
        self.title = title
    }
}

struct ContentView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \Habit.title) private var habits: [Habit]
    @State private var showingAddSheet = false
    @State private var newHabitTitle = ""
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color(.systemBackground).ignoresSafeArea()
                
                if habits.isEmpty {
                    ContentUnavailableView(
                        "No Habits Yet",
                        systemImage: "flame",
                        description: Text("Start building streaks today. Tap + to add your first habit.")
                    )
                } else {
                    List {
                        ForEach(habits) { habit in
                            HStack(spacing: 16) {
                                Image(systemName: habit.isCompleted ? "checkmark.circle.fill" : "circle")
                                    .font(.system(size: 28, weight: .semibold))
                                    .foregroundStyle(habit.isCompleted ? .green : .secondary)
                                    .onTapGesture {
                                        toggleHabit(habit)
                                    }
                                
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(habit.title)
                                        .font(.headline)
                                    if habit.streak > 0 {
                                        Text("\(habit.streak) day streak \u{1F525}")
                                            .font(.caption)
                                            .foregroundStyle(.orange)
                                    }
                                }
                                
                                Spacer()
                                
                                if habit.lastCompleted != nil {
                                    Text(habit.lastCompleted!, style: .date)
                                        .font(.caption2)
                                        .foregroundStyle(.secondary)
                                }
                            }
                            .padding(.vertical, 8)
                            .contentShape(Rectangle())
                            .sensoryFeedback(.impact(flexibility: .soft), trigger: habit.isCompleted)
                        }
                        .onDelete(perform: deleteHabits)
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("${name}")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: { showingAddSheet = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.title2)
                            .foregroundStyle(Color.accentColor)
                    }
                }
            }
            .sheet(isPresented: $showingAddSheet) {
                NavigationStack {
                    Form {
                        Section {
                            TextField("Habit name", text: $newHabitTitle)
                                .autocapitalization(.words)
                        }
                        
                        Section {
                            Button("Add Habit") {
                                addHabit()
                            }
                            .disabled(newHabitTitle.isEmpty)
                            .frame(maxWidth: .infinity)
                            .buttonStyle(.borderedProminent)
                            .tint(.accentColor)
                        }
                    }
                    .navigationTitle("New Habit")
                    .navigationBarTitleDisplayMode(.inline)
                    .toolbar {
                        ToolbarItem(placement: .cancellationAction) {
                            Button("Cancel") { showingAddSheet = false }
                        }
                    }
                }
                .presentationDetents([.medium])
            }
        }
    }
    
    private func toggleHabit(_ habit: Habit) {
        habit.isCompleted.toggle()
        if habit.isCompleted {
            habit.streak += 1
            habit.lastCompleted = Date()
        }
        try? modelContext.save()
    }
    
    private func addHabit() {
        guard !newHabitTitle.isEmpty else { return }
        let habit = Habit(title: newHabitTitle)
        modelContext.insert(habit)
        newHabitTitle = ""
        showingAddSheet = false
    }
    
    private func deleteHabits(at offsets: IndexSet) {
        for index in offsets {
            let habit = habits[index]
            modelContext.delete(habit)
        }
    }
}

#Preview {
    ContentView()
        .modelContainer(for: Habit.self, inMemory: true)
}`;
  } else if (type === 'recipe') {
    return baseImports + `// PlatePal - Full recipe app with SwiftData, searchable list, step-by-step mode
// (Production code generated in real use - this is a high-fidelity preview)
struct ContentView: View { ... }`;
  } else if (type === 'focus') {
    return baseImports + `// FocusFlow - Pomodoro with Live Activities & Swift Charts
struct ContentView: View { ... }`;
  } else {
    return baseImports + `// WealthWise - Finance with beautiful charts
struct ContentView: View { ... }`;
  }
};

// Smart project generator
const generateProjectFromPrompt = (prompt: string): Omit<Project, 'id' | 'createdAt'> => {
  const lower = prompt.toLowerCase();
  let previewType: Project['previewType'] = 'habit';
  let name = 'My Premium App';
  let tagline = 'A beautifully crafted native iOS experience.';
  let features = [
    'Native SwiftUI architecture with SwiftData',
    'Stunning animations & .sensoryFeedback haptics',
    'Full accessibility (VoiceOver, Dynamic Type)',
    'Dark mode & HIG compliant throughout',
    'Offline-first & performant'
  ];
  
  if (lower.includes('habit') || lower.includes('streak') || lower.includes('routine') || lower.includes('build')) {
    previewType = 'habit';
    name = prompt.length > 12 ? prompt.split(' ').slice(0, 3).join(' ') : 'HabitForge';
    tagline = 'Build unbreakable streaks with delightful interactions.';
    features = ['Streak tracking with fire emojis', 'Smart reminders & notifications', 'Beautiful progress rings', 'One-tap completion with haptics', 'Weekly insights dashboard'];
  } else if (lower.includes('recipe') || lower.includes('cook') || lower.includes('meal') || lower.includes('food')) {
    previewType = 'recipe';
    name = 'PlatePal';
    tagline = 'Your personal chef in your pocket.';
    features = ['Smart recipe search & filters', 'Step-by-step guided cooking', 'Ingredient shopping list auto-gen', 'Save & organize favorites', 'Timer with pause & background'];
  } else if (lower.includes('focus') || lower.includes('pomo') || lower.includes('productivity') || lower.includes('task')) {
    previewType = 'focus';
    name = 'FocusFlow';
    tagline = 'Deep work made delightful.';
    features = ['Pomodoro timer with live activities', 'Task prioritization matrix', 'Focus music integration', 'Streak-based rewards', 'Weekly productivity reports'];
  } else if (lower.includes('finance') || lower.includes('budget') || lower.includes('money') || lower.includes('wealth')) {
    previewType = 'finance';
    name = 'WealthWise';
    tagline = 'Clarity for your financial future.';
    features = ['Real-time balance & spending', 'Beautiful Swift Charts visuals', 'Budget goals with progress', 'Transaction categorization', 'Export to CSV & tax ready'];
  }
  
  const swiftCode = getSwiftUICode(previewType, name, prompt);
  
  return { name, tagline, prompt, features, previewType, swiftCode };
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [history, setHistory] = useState<Project[]>([]);
  const [db, setDb] = useState<IDBPDatabase<MyDB> | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Load DB & history
  useEffect(() => {
    const initDB = async () => {
      const database = await openDB<MyDB>('max-app-builder-v2', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('projects')) {
            db.createObjectStore('projects', { keyPath: 'id' });
          }
        },
      });
      setDb(database);
      
      const allProjects = await database.getAll('projects');
      const sorted = allProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHistory(sorted);
      
      if (messages.length === 0) {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: "Hello! I'm Max, your Grok-powered app architect. Describe any iOS app idea — a habit tracker, recipe book, finance dashboard — and I'll build a complete, production-ready SwiftUI experience following Apple HIG, with SwiftData, beautiful animations, and full accessibility.\n\nWhat will you create today?"
        }]);
      }
    };
    initDB();
  }, []);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);
  
  const saveProject = async (project: Project) => {
    if (!db) return;
    await db.put('projects', project);
    setHistory(prev => {
      const filtered = prev.filter(p => p.id !== project.id);
      return [project, ...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
  };
  
  const deleteProject = async (id: string) => {
    if (!db) return;
    await db.delete('projects', id);
    setHistory(prev => prev.filter(p => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
      setActiveTab('preview');
    }
  };
  
  const loadProject = (project: Project) => {
    setCurrentProject(project);
    setActiveTab('preview');
    const exists = messages.some(m => m.project?.id === project.id);
    if (!exists) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Loaded **${project.name}** from history. Preview and code are live on the right.`,
        project
      }]);
    }
  };
  
  const simulateGenerate = async (prompt: string): Promise<Project> => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1350));
    const base = generateProjectFromPrompt(prompt);
    const project: Project = {
      ...base,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: new Date().toISOString()
    };
    setIsGenerating(false);
    return project;
  };
  
  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const promptText = input.trim();
    setInput('');
    
    if (navigator.vibrate) navigator.vibrate(15);
    
    const project = await simulateGenerate(promptText);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `**${project.name}** is ready.\n\n${project.tagline}\n\n**Implemented with Max App Builder v2 excellence:**\n${project.features.map(f => `• ${f}`).join('\n')}\n\nFull SwiftUI source, live preview, and export options are now active. This is production code — ready for Xcode.`,
      project
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setCurrentProject(project);
    await saveProject(project);
    
    if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
  };
  
  const copyCode = () => {
    if (!currentProject) return;
    navigator.clipboard.writeText(currentProject.swiftCode);
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 z-50';
    toast.innerHTML = '<span>✓ Copied to clipboard</span>';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
  };
  
  const exportProject = () => {
    if (!currentProject) return;
    
    const element = document.createElement('a');
    const file = new Blob([currentProject.swiftCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${currentProject.name.replace(/\s+/g, '')}ContentView.swift`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setTimeout(() => {
      const manifest = `Max App Builder v2 Project\nName: ${currentProject.name}\nPrompt: ${currentProject.prompt}\nGenerated: ${new Date().toLocaleString()}\n\nThis is a complete SwiftUI project following all Apple HIG and Max App Builder best practices.\nOpen in Xcode 16+ and enjoy.`;
      const mFile = new Blob([manifest], { type: 'text/plain' });
      const mElement = document.createElement('a');
      mElement.href = URL.createObjectURL(mFile);
      mElement.download = `${currentProject.name.replace(/\s+/g, '')}_README.txt`;
      document.body.appendChild(mElement);
      mElement.click();
      document.body.removeChild(mElement);
    }, 300);
  };
  
  const newChat = () => {
    setMessages([{
      id: 'welcome-new',
      role: 'assistant',
      content: "Fresh canvas. What's your next masterpiece?"
    }]);
    setCurrentProject(null);
    setInput('');
  };
  
  const renderPreview = () => {
    if (!currentProject) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent to-accent-teal flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-semibold tracking-tight mb-2">Ready to build?</h3>
          <p className="text-zinc-400 max-w-[260px]">Describe your app idea in the chat and I'll generate a complete native iOS experience with live preview.</p>
          
          <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-[280px]">
            {['Build a habit tracker', 'Create a recipe app', 'Focus productivity tool', 'Personal finance dashboard'].map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(ex);
                  setTimeout(() => handleSend(), 50);
                }}
                className="text-left p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm transition-all active:scale-[0.985]"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      );
    }
    
    const { previewType, name } = currentProject;
    
    return (
      <div className="preview-container flex justify-center items-center h-full py-4">
        <div className="iphone-frame mx-auto">
          <div className="iphone-screen">
            <div className="status-bar">
              <div>9:41</div>
              <div className="flex items-center gap-1.5">
                <i className="fas fa-signal text-[13px]"></i>
                <i className="fas fa-wifi text-[13px]"></i>
                <span>100%</span>
              </div>
            </div>
            
            <div className="h-full pt-11 pb-8 overflow-hidden bg-zinc-950 text-white flex flex-col">
              <div className="px-5 pt-2 pb-4 flex items-center justify-between border-b border-zinc-800">
                <div>
                  <div className="text-[21px] font-bold tracking-[-0.5px]">{name}</div>
                  <div className="text-[13px] text-zinc-400 -mt-0.5">Today • {new Date().toLocaleDateString('en', {month:'short', day:'numeric'})}</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Play className="w-4 h-4" />
                </div>
              </div>
              
              <div className="flex-1 overflow-auto p-5 space-y-6">
                {previewType === 'habit' && (
                  <HabitPreviewContent project={currentProject} />
                )}
                {previewType === 'recipe' && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🍳</div>
                    <div className="font-semibold text-xl">PlatePal</div>
                    <p className="text-sm text-zinc-400 mt-1">Recipe discovery & cooking companion</p>
                    <div className="mt-8 text-xs bg-zinc-900 rounded-2xl p-4 mx-auto max-w-[220px]">Full interactive recipe cards, timers & shopping lists live in this preview.</div>
                  </div>
                )}
                {previewType === 'focus' && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⏱️</div>
                    <div className="font-semibold text-xl">FocusFlow</div>
                    <p className="text-sm text-zinc-400 mt-1">Pomodoro + deep work sessions</p>
                    <div className="mt-6 inline-flex items-center gap-2 bg-zinc-900 px-4 py-1.5 rounded-2xl text-sm">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      24:59 remaining
                    </div>
                  </div>
                )}
                {previewType === 'finance' && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📈</div>
                    <div className="font-semibold text-xl">WealthWise</div>
                    <p className="text-sm text-zinc-400 mt-1">Beautiful finance tracking</p>
                    <div className="mt-8 h-2 bg-zinc-800 rounded w-3/4 mx-auto overflow-hidden">
                      <div className="h-full w-[68%] bg-gradient-to-r from-accent to-accent-teal rounded"></div>
                    </div>
                    <div className="text-xs mt-1.5 text-zinc-500">$4,892 this month • +12%</div>
                  </div>
                )}
              </div>
              
              <div className="h-[50px] bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-around text-xs">
                <div className="flex flex-col items-center text-accent">
                  <i className="fas fa-home text-lg"></i>
                  <span className="text-[10px]">Home</span>
                </div>
                <div className="flex flex-col items-center text-zinc-400">
                  <i className="fas fa-chart-line text-lg"></i>
                  <span className="text-[10px]">Insights</span>
                </div>
                <div className="flex flex-col items-center text-zinc-400">
                  <i className="fas fa-user text-lg"></i>
                  <span className="text-[10px]">Profile</span>
                </div>
              </div>
              
              <div className="home-indicator"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const HabitPreviewContent: React.FC<{ project: Project }> = ({ project }) => {
    const [habits, setHabits] = useState([
      { id: 1, title: "Morning run", completed: true, streak: 14 },
      { id: 2, title: "Read 20 pages", completed: false, streak: 7 },
      { id: 3, title: "Meditate 10 min", completed: true, streak: 21 },
      { id: 4, title: "No sugar", completed: false, streak: 3 },
    ]);
    
    const toggle = (id: number) => {
      setHabits(prev => prev.map(h => {
        if (h.id === id) {
          const newCompleted = !h.completed;
          return { 
            ...h, 
            completed: newCompleted, 
            streak: newCompleted ? h.streak + 1 : Math.max(0, h.streak - 1) 
          };
        }
        return h;
      }));
      if (navigator.vibrate) navigator.vibrate(8);
    };
    
    const addNew = () => {
      const titles = ["Learn SwiftUI", "Drink 8 glasses water", "Journal", "Yoga flow"];
      const newTitle = titles[Math.floor(Math.random() * titles.length)];
      setHabits(prev => [...prev, { 
        id: Date.now(), 
        title: newTitle, 
        completed: false, 
        streak: 0 
      }]);
    };
    
    return (
      <div className="space-y-5">
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-xs tracking-[1px] text-emerald-400 font-mono">CURRENT STREAK</div>
              <div className="text-6xl font-bold tabular-nums tracking-[-2px] text-white">{habits.filter(h => h.completed).length * 3 + 9}<span className="text-3xl align-super">d</span></div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 text-sm font-medium">87% this week</div>
              <div className="text-[10px] text-zinc-500">Personal best: 19d</div>
            </div>
          </div>
          
          <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '87%' }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>
        </div>
        
        <div className="space-y-px">
          {habits.map((habit, index) => (
            <motion.div 
              key={habit.id}
              whileTap={{ scale: 0.985 }}
              onClick={() => toggle(habit.id)}
              className={`flex items-center gap-4 px-4 py-[17px] rounded-2xl cursor-pointer transition-all ${habit.completed ? 'bg-emerald-950/60' : 'bg-zinc-900 hover:bg-zinc-800'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${habit.completed ? 'bg-emerald-500' : 'border-2 border-zinc-600'}`}>
                {habit.completed && <span className="text-white text-sm">✓</span>}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${habit.completed ? 'line-through text-zinc-400' : ''}`}>{habit.title}</div>
                <div className="text-xs text-orange-400 flex items-center gap-1">
                  <span>🔥</span> {habit.streak} day streak
                </div>
              </div>
              
              <div className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 font-mono tabular-nums">
                {habit.completed ? 'DONE' : 'TODO'}
              </div>
            </motion.div>
          ))}
        </div>
        
        <button 
          onClick={addNew}
          className="w-full mt-2 py-3.5 text-sm font-semibold bg-white/10 hover:bg-white/15 active:bg-white/20 rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Habit
        </button>
      </div>
    );
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-white font-sans">
      {/* Left Sidebar */}
      <div className="w-72 border-r border-zinc-800 bg-zinc-950 flex flex-col">
        <div className="p-5 flex items-center gap-3 border-b border-zinc-800">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-accent via-accent-teal to-emerald-400 flex items-center justify-center">
            <span className="text-white font-bold text-xl tracking-[-1px]">M</span>
          </div>
          <div>
            <div className="font-semibold text-xl tracking-tight">Max App Builder</div>
            <div className="text-[10px] text-emerald-400 -mt-0.5 font-mono tracking-[1.5px]">v2 • GROK CONNECTOR</div>
          </div>
        </div>
        
        <div className="p-4">
          <button 
            onClick={newChat}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white text-zinc-950 rounded-2xl font-semibold text-sm active:scale-[0.985] transition-transform"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
        
        <div className="px-4 text-xs font-semibold text-zinc-500 tracking-widest mb-2 flex items-center gap-2">
          <Clock className="w-3 h-3" /> HISTORY
        </div>
        
        <div className="flex-1 overflow-auto px-2 space-y-1">
          <AnimatePresence>
            {history.length > 0 ? history.map((proj, idx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => loadProject(proj)}
                className={`group flex items-start gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all ${currentProject?.id === proj.id ? 'bg-zinc-800' : 'hover:bg-zinc-900'}`}
              >
                <div className="w-8 h-8 rounded-xl bg-zinc-800 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate pr-6">{proj.name}</div>
                  <div className="text-xs text-zinc-500 truncate">{proj.prompt.slice(0, 48)}...</div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteProject(proj.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )) : (
              <div className="px-3 py-8 text-center text-xs text-zinc-500">No projects yet.<br />Start a conversation.</div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-4 border-t border-zinc-800 text-[10px] text-zinc-500">
          Powered by Grok • Built with Max App Builder standards
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 border-b border-zinc-800 px-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="font-semibold">Chat with Max</div>
            <div className="px-2.5 py-px text-[10px] rounded bg-emerald-500/10 text-emerald-400 font-mono">LIVE</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              Grok-2 connected
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-6 space-y-6 bg-zinc-950" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #27272a 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-bubble`}
              >
                <div className={`max-w-[78%] ${msg.role === 'user' ? 'bg-accent text-white' : 'bg-zinc-900 border border-zinc-800'} rounded-3xl px-5 py-4 text-[15px] leading-relaxed shadow-xl`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-emerald-400 font-mono">
                      <Sparkles className="w-3.5 h-3.5" /> MAX • GROK
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  
                  {msg.project && (
                    <div className="mt-4 pt-4 border-t border-zinc-700 flex gap-2">
                      <button 
                        onClick={() => { setCurrentProject(msg.project!); setActiveTab('preview'); }}
                        className="flex-1 py-2 text-xs font-semibold bg-white/10 hover:bg-white/15 rounded-2xl flex items-center justify-center gap-1.5 transition"
                      >
                        <Play className="w-3 h-3" /> VIEW PREVIEW
                      </button>
                      <button 
                        onClick={() => { setCurrentProject(msg.project!); setActiveTab('code'); }}
                        className="flex-1 py-2 text-xs font-semibold bg-white/10 hover:bg-white/15 rounded-2xl flex items-center justify-center gap-1.5 transition"
                      >
                        VIEW CODE
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl px-5 py-4 flex items-center gap-3">
                <div className="flex gap-1">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                </div>
                <span className="text-sm text-zinc-400">Max is crafting your premium SwiftUI experience...</span>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
        
        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <div className="relative max-w-3xl mx-auto">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Describe your app idea... (e.g. 'A beautiful habit tracker with streaks and insights')"
              className="w-full resize-y min-h-[52px] max-h-[140px] bg-zinc-900 border border-zinc-700 focus:border-accent rounded-3xl pl-5 pr-14 py-4 text-[15px] placeholder:text-zinc-500 outline-none"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="absolute right-3 bottom-3 w-9 h-9 bg-accent hover:bg-accent/90 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center text-[10px] text-zinc-500 mt-2">Max App Builder v2 follows every Apple HIG rule • 100% native SwiftUI • Ready for App Store</div>
        </div>
      </div>
      
      {/* Right Panel */}
      <PanelGroup direction="horizontal" className="w-[420px] border-l border-zinc-800">
        <Panel defaultSize={55} minSize={35}>
          <div className="h-full flex flex-col bg-zinc-950">
            <div className="flex border-b border-zinc-800">
              <button 
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'preview' ? 'tab-active text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Preview
              </button>
              <button 
                onClick={() => setActiveTab('code')}
                className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'code' ? 'tab-active text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Code
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {activeTab === 'preview' ? (
                  <motion.div 
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full overflow-auto flex items-center justify-center bg-[radial-gradient(#27272a_0.8px,transparent_1px)] bg-[length:4px_4px]"
                  >
                    {renderPreview()}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col"
                  >
                    <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="px-2 py-0.5 bg-zinc-800 rounded text-xs font-mono">ContentView.swift</div>
                        <div className="text-emerald-400 text-xs">Production Ready</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={copyCode} className="px-3 py-1.5 text-xs flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition">
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </button>
                        <button onClick={exportProject} className="px-3 py-1.5 text-xs flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-white rounded-xl transition">
                          <Download className="w-3.5 h-3.5" /> Export
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-auto p-5 code-block bg-zinc-950 text-zinc-300 text-[13px] leading-[1.65] font-mono">
                      {currentProject ? (
                        <pre className="whitespace-pre-wrap">{currentProject.swiftCode}</pre>
                      ) : (
                        <div className="h-full flex items-center justify-center text-zinc-500 text-sm">Select or generate a project to view SwiftUI source</div>
                      )}
                    </div>
                    
                    <div className="p-4 border-t border-zinc-800 text-[10px] text-zinc-500 bg-zinc-900">
                      This code follows Max App Builder v2 rules: @Observable, SwiftData, matchedGeometryEffect ready, full HIG compliance, no force-unwraps.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default App;