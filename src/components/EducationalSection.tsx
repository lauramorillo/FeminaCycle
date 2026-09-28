/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Clock,
  ArrowRight,
  X,
  Bookmark,
  Share2,
  CheckCircle2,
  Filter,
  Lightbulb
} from 'lucide-react';
import { EDUCATIONAL_ARTICLES, EducationalArticle, ArticleCategory } from '../data/articles';
import { CyclePhase } from '../types/cycle';
import { SPANISH_PHASE_INFO } from '../utils/cycleCalculations';

interface EducationalSectionProps {
  currentPhase: CyclePhase;
}

export const EducationalSection: React.FC<EducationalSectionProps> = ({ currentPhase }) => {
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingArticle, setReadingArticle] = useState<EducationalArticle | null>(null);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    if (savedArticles.includes(id)) {
      setSavedArticles(savedArticles.filter(item => item !== id));
    } else {
      setSavedArticles([...savedArticles, id]);
    }
  };

  // Filtered articles
  const filteredArticles = EDUCATIONAL_ARTICLES.filter(article => {
    const matchesCategory = selectedCategory === 'todos' || article.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const categories: Array<{ id: ArticleCategory | 'todos'; label: string }> = [
    { id: 'todos', label: 'Todos los artículos' },
    { id: 'salud_menstrual', label: 'Salud Menstrual' },
    { id: 'fertilidad', label: 'Fertilidad' },
    { id: 'nutricion', label: 'Nutrición del Ciclo' },
    { id: 'sintomas', label: 'Alivio de Síntomas' },
    { id: 'bienestar', label: 'Bienestar & Ejercicio' },
  ];

  const phaseInfo = SPANISH_PHASE_INFO[currentPhase];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-rose-600" />
          <span className="text-xs uppercase tracking-wider font-semibold text-rose-600">
            Aprende sobre tu cuerpo
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
          Guías, Nutrición y Salud Menstrual
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Artículos basados en evidencia científica sobre el método sintotérmico, nutrición por fases, alivio natural de cólicos y sincronización del estilo de vida con tus hormonas.
        </p>

        {/* Dynamic Contextual Tip for Current Phase */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50/50 border border-rose-100 flex items-start gap-3">
          <div className="p-2 bg-rose-500 text-white rounded-lg shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-900">
                Consejo para tu fase actual: {phaseInfo.name}
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
              {phaseInfo.tip}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills/Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por tema o síntoma..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map(article => {
          const isSaved = savedArticles.includes(article.id);
          return (
            <div
              key={article.id}
              className="bg-white rounded-2xl border border-rose-100 shadow-xs hover:border-rose-200 transition-all p-5 flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    {article.categoryLabel}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </span>
                    <button
                      onClick={() => toggleSave(article.id)}
                      className={`p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer ${
                        isSaved ? 'text-rose-600 fill-rose-600' : 'text-slate-400'
                      }`}
                      title={isSaved ? 'Guardado en tus favoritos' : 'Guardar artículo'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-serif font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {article.subtitle}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {article.summary}
                </p>

                {/* Practical Tip Capsule */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 italic">
                    <strong className="font-semibold not-italic text-slate-800">Consejo clave: </strong>
                    {article.practicalTip}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => setReadingArticle(article)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-transform group-hover:translate-x-0.5 cursor-pointer"
                >
                  <span>Leer artículo completo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredArticles.length === 0 && (
        <div className="bg-white rounded-2xl border border-rose-100 p-8 text-center">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            No se encontraron artículos para esta búsqueda
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Intenta con otro término como "nutrición", "hierro", "fertilidad" o "calambres".
          </p>
        </div>
      )}

      {/* Article Reader Modal */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-rose-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            {/* Reader Header */}
            <div className="px-6 py-5 border-b border-rose-100 bg-rose-50/50 flex items-start justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                    {readingArticle.categoryLabel}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    · {readingArticle.readTime} de lectura
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 leading-snug">
                  {readingArticle.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {readingArticle.subtitle}
                </p>
              </div>

              <button
                onClick={() => setReadingArticle(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-colors shrink-0 ml-3 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reader Body */}
            <div className="p-6 space-y-6 overflow-y-auto leading-relaxed">
              {/* Practical Tip Banner */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5 text-amber-900">
                    Consejo práctico aplicable:
                  </span>
                  <span>{readingArticle.practicalTip}</span>
                </div>
              </div>

              {/* Sections */}
              {readingArticle.sections.map((section, idx) => (
                <div key={idx} className="space-y-2.5">
                  <h3 className="text-sm font-bold text-slate-900 font-serif border-b border-slate-100 pb-1">
                    {section.heading}
                  </h3>
                  {section.body.map((p, pIdx) => (
                    <p key={pIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {p}
                    </p>
                  ))}
                  {section.tips && section.tips.length > 0 && (
                    <ul className="space-y-1.5 pt-1 pl-2">
                      {section.tips.map((t, tIdx) => (
                        <li key={tIdx} className="text-xs text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Reader Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                onClick={() => toggleSave(readingArticle.id)}
                className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  savedArticles.includes(readingArticle.id)
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{savedArticles.includes(readingArticle.id) ? 'Guardado' : 'Guardar para leer luego'}</span>
              </button>

              <button
                onClick={() => setReadingArticle(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cerrar lectura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
