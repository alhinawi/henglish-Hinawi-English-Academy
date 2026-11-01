import React, { useState } from 'react';
import { PageRoute, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Search,
  Filter,
  BarChart3,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Star
} from 'lucide-react';

interface TeacherDashboardPageProps {
  onNavigate: (route: PageRoute) => void;
}

interface StudentProgressSummary {
  id: string;
  name: string;
  email: string;
  level: string;
  xp: number;
  completedLessonsCount: number;
  quizAverage: number;
  lastActive: string;
  status: 'active' | 'needs_review' | 'behind';
}

const SAMPLE_STUDENTS: StudentProgressSummary[] = [
  {
    id: 'std-1',
    name: 'سارة عبد الرحمن',
    email: 'sarah.abdul@example.com',
    level: 'B1',
    xp: 3450,
    completedLessonsCount: 18,
    quizAverage: 92,
    lastActive: 'منذ ساعتين',
    status: 'active',
  },
  {
    id: 'std-2',
    name: 'عمر خالد المنشاوي',
    email: 'omar.k@example.com',
    level: 'A2',
    xp: 2100,
    completedLessonsCount: 12,
    quizAverage: 78,
    lastActive: 'أمس',
    status: 'needs_review',
  },
  {
    id: 'std-3',
    name: 'مريم أحمد سعيد',
    email: 'mariam.ahmed@example.com',
    level: 'B2',
    xp: 5200,
    completedLessonsCount: 26,
    quizAverage: 96,
    lastActive: 'منذ 30 دقيقة',
    status: 'active',
  },
  {
    id: 'std-4',
    name: 'كريم محمود',
    email: 'karim.m@example.com',
    level: 'A1',
    xp: 650,
    completedLessonsCount: 4,
    quizAverage: 65,
    lastActive: 'منذ 5 أيام',
    status: 'behind',
  },
];

export const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'needs_review' | 'behind'>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgressSummary | null>(null);

  const filteredStudents = SAMPLE_STUDENTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fadeIn" dir="rtl">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950 border border-purple-500/20 p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
              <GraduationCap className="w-4 h-4" />
              <span>لوحة المعلم والمشرف الأكاديمي</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              مرحباً، {user?.nameAr || user?.name || 'أستاذنا الفاضل'} 👨‍🏫
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl leading-relaxed">
              متابعة تقدم الطلاب وتقييم الإجابات ومراجعة جلسات المحاكاة الصوتية في منصة هناوي.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('grammar')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/60 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>استعراض المنهج</span>
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4" />
              <span>لوحة تعلّم الطالب</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-white">28 طالب</div>
          <div className="text-xs text-slate-400 mt-1">الطلاب المسجلون تحت إشرافك</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-white">88%</div>
          <div className="text-xs text-slate-400 mt-1">متوسط درجات الاختبارات</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-white">142 ساعة</div>
          <div className="text-xs text-slate-400 mt-1">إجمالي ساعات التعلّم هذا الشهر</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-white">35 شهادة</div>
          <div className="text-xs text-slate-400 mt-1">شهادات مستحقة تم إصدارها</div>
        </div>
      </div>

      {/* Student Management Table Section */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>متابعة أداء الطلاب والتقييمات</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">مراقبة تفصيلية لدرجات الكويزات، دروس القواعد، والمحادثات المكتملة</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث عن طالب..."
                className="pr-9 pl-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشط ومتميز</option>
              <option value="needs_review">يحتاج مراجعة</option>
              <option value="behind">متأخر عن الخطة</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-3 px-4">الطالب</th>
                <th className="py-3 px-4">المستوى الحالي</th>
                <th className="py-3 px-4">نقاط XP</th>
                <th className="py-3 px-4">الدروس المكتملة</th>
                <th className="py-3 px-4">معدل الاختبارات</th>
                <th className="py-3 px-4">آخر نشاط</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{student.name}</div>
                    <div className="text-[11px] text-slate-500 dir-ltr text-right">{student.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold">
                      {student.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    {student.xp.toLocaleString()} XP
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {student.completedLessonsCount} درس
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            student.quizAverage >= 85 ? 'bg-emerald-400' : student.quizAverage >= 70 ? 'bg-amber-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${student.quizAverage}%` }}
                        />
                      </div>
                      <span className="font-mono font-semibold">{student.quizAverage}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {student.lastActive}
                  </td>
                  <td className="py-3 px-4">
                    {student.status === 'active' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> نشط
                      </span>
                    )}
                    {student.status === 'needs_review' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px]">
                        <AlertCircle className="w-3 h-3" /> مراجعة
                      </span>
                    )}
                    {student.status === 'behind' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px]">
                        <Clock className="w-3 h-3" /> متأخر
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-medium transition-colors"
                    >
                      التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-right">
            <h3 className="text-lg font-bold text-white mb-2">{selectedStudent.name}</h3>
            <p className="text-xs text-slate-400 mb-4">{selectedStudent.email}</p>
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">المستوى:</span>
                <span className="font-bold text-indigo-400 font-mono">{selectedStudent.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">إجمالي النقاط:</span>
                <span className="font-bold text-amber-400 font-mono">{selectedStudent.xp} XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">الدروس المنجزة:</span>
                <span className="font-bold text-white font-mono">{selectedStudent.completedLessonsCount} درس</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">متوسط الاختبارات:</span>
                <span className="font-bold text-emerald-400 font-mono">{selectedStudent.quizAverage}%</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

