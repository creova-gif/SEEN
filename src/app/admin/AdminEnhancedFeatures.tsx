/**
 * ADMIN UI — ENHANCED FEATURES MANAGEMENT
 * SEEN by CREOVA
 * 
 * Admin interface for managing all 11 enhanced feature sets
 * ADMIN-ONLY: Not visible to regular users
 */

import React, { useState } from 'react';
import {
  useFeaturePreferences,
  usePublicCollections,
  useChapterReflections,
} from '../hooks/useEnhancedFeatures';

// ============================================================================
// ADMIN: FEATURE TOGGLE DASHBOARD
// ============================================================================

export function AdminFeatureToggleDashboard() {
  const { preferences, loading, updatePreferences } = useFeaturePreferences('admin');

  if (loading || !preferences) {
    return <div>Loading feature preferences...</div>;
  }

  return (
    <div className="admin-feature-dashboard">
      <h1>Enhanced Features Management</h1>
      <p className="admin-description">
        Configure which enhanced features are enabled platform-wide.
        All features default to OFF unless explicitly enabled.
      </p>

      <div className="feature-toggles">
        {/* Feature A: Enhanced Context Cards */}
        <FeatureToggle
          id="enhancedContextCardsEnabled"
          label="Enhanced Context Cards (3 Levels)"
          description="Enable progressive context depth: explanation → expanded → institution-verified"
          enabled={preferences.enhancedContextCardsEnabled}
          onToggle={(enabled) => updatePreferences({ enhancedContextCardsEnabled: enabled })}
        />

        {/* Feature B: Guided Reading/Listening Modes */}
        <FeatureToggle
          id="guidedReadingModes"
          label="Guided Reading/Listening Modes"
          description="Enable read-only, listen-only, and read+listen consumption modes"
          enabled={true} // Always enabled
          onToggle={() => {}} // Non-toggleable (core feature)
          locked={true}
        />

        {/* Feature C: Institutional Collections */}
        <FeatureToggle
          id="institutionalCollections"
          label="Institutional Collections & Syllabi"
          description="Enable curated collections with discussion prompts"
          enabled={true} // Always enabled
          onToggle={() => {}}
          locked={true}
        />

        {/* Feature D: Cultural Impact Analytics */}
        <FeatureToggle
          id="analyticsOptIn"
          label="Cultural Impact Analytics (CMF-Compliant)"
          description="Track aggregate-only usage data for CMF reporting"
          enabled={preferences.analyticsOptIn}
          onToggle={(enabled) => updatePreferences({ analyticsOptIn: enabled })}
        />

        {/* Feature E: Creator Notes */}
        <FeatureToggle
          id="creatorNotesEnabled"
          label="Creator Notes (Post-Story)"
          description="Show creator reflections after story completion"
          enabled={preferences.creatorNotesEnabled}
          onToggle={(enabled) => updatePreferences({ creatorNotesEnabled: enabled })}
        />

        {/* Feature F: Community Reflections */}
        <FeatureToggle
          id="communityReflectionsVisible"
          label="Community Reflections (Care-Based)"
          description="Enable moderated community reflections"
          enabled={preferences.communityReflectionsVisible}
          onToggle={(enabled) => updatePreferences({ communityReflectionsVisible: enabled })}
        />

        {/* Feature G: Offline Cultural Packs */}
        <FeatureToggle
          id="offlinePacksEnabled"
          label="Offline Cultural Packs"
          description="Enable downloadable story bundles for offline access"
          enabled={preferences.offlinePacksEnabled}
          onToggle={(enabled) => updatePreferences({ offlinePacksEnabled: enabled })}
        />

        {/* Feature H: Multi-Narrator Support */}
        <FeatureToggle
          id="multiNarratorSelectionEnabled"
          label="Multi-Narrator Support"
          description="Allow users to select alternative narrators"
          enabled={preferences.multiNarratorSelectionEnabled}
          onToggle={(enabled) => updatePreferences({ multiNarratorSelectionEnabled: enabled })}
        />

        {/* Feature K: Seasonal Editorial Framing */}
        <FeatureToggle
          id="seasonalEditorialFramingEnabled"
          label="Seasonal Editorial Framing"
          description="Show curatorial introductions at season entry"
          enabled={preferences.seasonalEditorialFramingEnabled}
          onToggle={(enabled) => updatePreferences({ seasonalEditorialFramingEnabled: enabled })}
        />
      </div>
    </div>
  );
}

interface FeatureToggleProps {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  locked?: boolean;
}

function FeatureToggle({ id, label, description, enabled, onToggle, locked }: FeatureToggleProps) {
  return (
    <div className="feature-toggle">
      <div className="feature-info">
        <h3>{label}</h3>
        <p>{description}</p>
        {locked && <span className="locked-badge">Core Feature (Always Enabled)</span>}
      </div>
      <div className="feature-control">
        <button
          onClick={() => onToggle(!enabled)}
          disabled={locked}
          className={`toggle-button ${enabled ? 'enabled' : 'disabled'}`}
          aria-label={`Toggle ${label}`}
        >
          {enabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// ADMIN: CONTEXT CARD EDITOR
// ============================================================================

export function AdminContextCardEditor() {
  const [cardId, setCardId] = useState('');
  const [term, setTerm] = useState('');
  const [explanationEN, setExplanationEN] = useState('');
  const [explanationFR, setExplanationFR] = useState('');
  const [explanationES, setExplanationES] = useState('');
  const [expandedEN, setExpandedEN] = useState('');
  const [expandedFR, setExpandedFR] = useState('');
  const [expandedES, setExpandedES] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contextCard = {
      id: cardId || `context-${term.toLowerCase().replace(/\s+/g, '-')}`,
      term,
      explanation: {
        en: explanationEN,
        fr: explanationFR,
        es: explanationES,
      },
      expandedContext: {
        en: expandedEN,
        fr: expandedFR,
        es: expandedES,
      },
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    // Save to backend (implementation in server)
    console.log('Saving context card:', contextCard);
    // TODO: POST to /admin/context-card
  };

  return (
    <div className="admin-context-card-editor">
      <h1>Context Card Editor</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="term">Term</label>
          <input
            id="term"
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g., Africville, Sleeping Car Porter"
            required
          />
        </div>

        <h3>Level 1: Short Explanation</h3>
        <div className="form-group">
          <label htmlFor="explanation-en">English</label>
          <textarea
            id="explanation-en"
            value={explanationEN}
            onChange={(e) => setExplanationEN(e.target.value)}
            rows={3}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="explanation-fr">French</label>
          <textarea
            id="explanation-fr"
            value={explanationFR}
            onChange={(e) => setExplanationFR(e.target.value)}
            rows={3}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="explanation-es">Spanish</label>
          <textarea
            id="explanation-es"
            value={explanationES}
            onChange={(e) => setExplanationES(e.target.value)}
            rows={3}
            required
          />
        </div>

        <h3>Level 2: Expanded Context</h3>
        <div className="form-group">
          <label htmlFor="expanded-en">English</label>
          <textarea
            id="expanded-en"
            value={expandedEN}
            onChange={(e) => setExpandedEN(e.target.value)}
            rows={6}
          />
        </div>
        <div className="form-group">
          <label htmlFor="expanded-fr">French</label>
          <textarea
            id="expanded-fr"
            value={expandedFR}
            onChange={(e) => setExpandedFR(e.target.value)}
            rows={6}
          />
        </div>
        <div className="form-group">
          <label htmlFor="expanded-es">Spanish</label>
          <textarea
            id="expanded-es"
            value={expandedES}
            onChange={(e) => setExpandedES(e.target.value)}
            rows={6}
          />
        </div>

        <button type="submit" className="save-button">
          Save Context Card
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// ADMIN: INSTITUTIONAL COLLECTION MANAGER
// ============================================================================

export function AdminCollectionManager() {
  const { collections, loading } = usePublicCollections();
  const [creating, setCreating] = useState(false);

  if (loading) return <div>Loading collections...</div>;

  return (
    <div className="admin-collection-manager">
      <div className="header">
        <h1>Institutional Collections</h1>
        <button onClick={() => setCreating(true)} className="create-button">
          Create New Collection
        </button>
      </div>

      {creating && <CollectionEditor onClose={() => setCreating(false)} />}

      <div className="collections-list">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}

function CollectionCard({ collection }: { collection: any }) {
  return (
    <div className="collection-card">
      <h3>{collection.title.en}</h3>
      <p>{collection.description.en}</p>
      <div className="collection-meta">
        <span>Curated by: {collection.curatedBy}</span>
        <span>{collection.contentIds.length} stories</span>
        <span>{collection.isPublic ? 'Public' : 'Private'}</span>
      </div>
      <button className="edit-button">Edit</button>
    </div>
  );
}

function CollectionEditor({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState({ en: '', fr: '', es: '' });
  const [description, setDescription] = useState({ en: '', fr: '', es: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST to /admin/collections
    console.log('Creating collection:', { title, description });
    onClose();
  };

  return (
    <div className="collection-editor">
      <h2>Create New Collection</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title (EN)</label>
          <input
            type="text"
            value={title.en}
            onChange={(e) => setTitle({ ...title, en: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Title (FR)</label>
          <input
            type="text"
            value={title.fr}
            onChange={(e) => setTitle({ ...title, fr: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Title (ES)</label>
          <input
            type="text"
            value={title.es}
            onChange={(e) => setTitle({ ...title, es: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Description (EN)</label>
          <textarea
            value={description.en}
            onChange={(e) => setDescription({ ...description, en: e.target.value })}
            rows={4}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">Create Collection</button>
          <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// ADMIN: COMMUNITY REFLECTIONS MODERATION
// ============================================================================

export function AdminReflectionModeration() {
  const [pendingReflections, setPendingReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchPending() {
      try {
        const response = await fetch('/api/admin/reflections/pending');
        const data = await response.json();
        setPendingReflections(data);
      } catch (err) {
        console.error('Failed to fetch pending reflections:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPending();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await fetch(`/api/admin/reflections/${id}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      // Remove from pending list
      setPendingReflections(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to moderate reflection:', err);
    }
  };

  if (loading) return <div>Loading pending reflections...</div>;

  return (
    <div className="admin-reflection-moderation">
      <h1>Community Reflections Moderation</h1>
      <p className="moderation-info">
        Review and moderate community reflections for cultural sensitivity and harm prevention.
      </p>

      {pendingReflections.length === 0 ? (
        <div className="no-pending">No pending reflections</div>
      ) : (
        <div className="reflections-queue">
          {pendingReflections.map((reflection) => (
            <ReflectionCard
              key={reflection.id}
              reflection={reflection}
              onApprove={() => handleModerate(reflection.id, 'approved')}
              onReject={() => handleModerate(reflection.id, 'rejected')}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReflectionCard({
  reflection,
  onApprove,
  onReject,
}: {
  reflection: any;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="reflection-card">
      <div className="reflection-meta">
        <span>Chapter: {reflection.chapterId}</span>
        <span>Submitted: {new Date(reflection.createdAt).toLocaleDateString()}</span>
        <span>Language: {reflection.submitterLanguage}</span>
      </div>

      <div className="reflection-content">
        {reflection.format === 'text' ? (
          <p>{reflection.reflectionText}</p>
        ) : (
          <audio controls src={reflection.audioUrl} />
        )}
      </div>

      <div className="moderation-categories">
        <h4>Review for:</h4>
        <ul>
          <li>Cultural sensitivity</li>
          <li>Harm prevention</li>
          <li>Accessibility & language</li>
          <li>Restorative care</li>
        </ul>
      </div>

      <div className="moderation-actions">
        <button onClick={onApprove} className="approve-button">
          Approve
        </button>
        <button onClick={onReject} className="reject-button">
          Reject
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// ADMIN: ANALYTICS DASHBOARD (CMF REPORTING)
// ============================================================================

export function AdminAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState({
    start: '2026-01-01',
    end: '2026-12-31',
  });

  const generateCMFReport = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/cmf-report?start=${reportPeriod.start}&end=${reportPeriod.end}`,
      );
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to generate CMF report:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    generateCMFReport();
  }, []);

  if (loading || !metrics) return <div>Loading analytics...</div>;

  return (
    <div className="admin-analytics-dashboard">
      <h1>Cultural Impact Analytics (CMF Reporting)</h1>
      
      <div className="report-controls">
        <label>
          Start Date:
          <input
            type="date"
            value={reportPeriod.start}
            onChange={(e) => setReportPeriod({ ...reportPeriod, start: e.target.value })}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={reportPeriod.end}
            onChange={(e) => setReportPeriod({ ...reportPeriod, end: e.target.value })}
          />
        </label>
        <button onClick={generateCMFReport} className="generate-button">
          Generate Report
        </button>
      </div>

      <div className="metrics-grid">
        <MetricCard
          title="Total Story Completions"
          value={metrics.platformMetrics.totalStoryCompletions}
        />
        <MetricCard
          title="Total Audio Hours"
          value={`${Math.round(metrics.platformMetrics.totalAudioHoursListened)} hours`}
        />
        <MetricCard
          title="French Engagement"
          value={`${Math.round(metrics.platformMetrics.languageUsage.fr)}%`}
        />
        <MetricCard
          title="Spanish Engagement"
          value={`${Math.round(metrics.platformMetrics.languageUsage.es)}%`}
        />
        <MetricCard
          title="Institutional Users"
          value={`~${metrics.institutionalUsers}`}
        />
        <MetricCard
          title="Institutional Collections"
          value={metrics.institutionalCollections}
        />
      </div>

      <div className="theme-engagement">
        <h2>Theme-Level Engagement</h2>
        <table>
          <thead>
            <tr>
              <th>Theme</th>
              <th>Engagements</th>
              <th>Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {metrics.platformMetrics.themeEngagement.map((theme: any) => (
              <tr key={theme.theme}>
                <td>{theme.theme}</td>
                <td>{theme.totalEngagements}</td>
                <td>{Math.round(theme.completionRate)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="export-button" onClick={() => window.print()}>
        Export CMF Report (PDF)
      </button>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="metric-card">
      <h3>{title}</h3>
      <div className="metric-value">{value}</div>
    </div>
  );
}

// ============================================================================
// ADMIN: MAIN DASHBOARD
// ============================================================================

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'context-cards' | 'collections' | 'reflections' | 'analytics'
  >('overview');

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <h1>SEEN Admin — Enhanced Features</h1>
        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'active' : ''}
          >
            Feature Toggles
          </button>
          <button
            onClick={() => setActiveTab('context-cards')}
            className={activeTab === 'context-cards' ? 'active' : ''}
          >
            Context Cards
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={activeTab === 'collections' ? 'active' : ''}
          >
            Collections
          </button>
          <button
            onClick={() => setActiveTab('reflections')}
            className={activeTab === 'reflections' ? 'active' : ''}
          >
            Reflections Moderation
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={activeTab === 'analytics' ? 'active' : ''}
          >
            Analytics (CMF)
          </button>
        </div>
      </nav>

      <main className="admin-content">
        {activeTab === 'overview' && <AdminFeatureToggleDashboard />}
        {activeTab === 'context-cards' && <AdminContextCardEditor />}
        {activeTab === 'collections' && <AdminCollectionManager />}
        {activeTab === 'reflections' && <AdminReflectionModeration />}
        {activeTab === 'analytics' && <AdminAnalyticsDashboard />}
      </main>
    </div>
  );
}
