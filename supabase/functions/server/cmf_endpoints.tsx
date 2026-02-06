/**
 * CMF-READY API ENDPOINTS
 * 
 * This file contains all API endpoints for CMF grant compliance:
 * - Cultural Impact Metrics
 * - Content Governance & Moderation
 * - Creator Rights & IP Protection
 * - Ethical Discovery & Recommendations
 * - Accessibility Compliance
 * - Grant Readiness & Audit
 * 
 * NOTE: These endpoints should be imported and registered in index.tsx
 */

import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";
import * as culturalMetrics from "./cultural_metrics.tsx";
import * as governance from "./governance_moderation.tsx";
import * as creatorRights from "./creator_rights_ip.tsx";
import * as ethicalDiscovery from "./ethical_discovery.tsx";
import * as accessibility from "./accessibility.tsx";
import * as grantReadiness from "./grant_readiness.tsx";

export function registerCMFEndpoints(app: Hono, supabaseAdmin: any, requireRole: any) {
  // ============================================================================
  // CULTURAL METRICS ENDPOINTS
  // ============================================================================

  app.get("/make-server-2bdc05e6/metrics/cultural-impact", requireRole(['admin', 'moderator']), async (c: any) => {
    try {
      const startDate = c.req.query('startDate') ? new Date(c.req.query('startDate')!) : undefined;
      const endDate = c.req.query('endDate') ? new Date(c.req.query('endDate')!) : undefined;
      const format = c.req.query('format') || 'json';
      
      const snapshot = await culturalMetrics.generateCulturalImpactSnapshot(startDate, endDate);
      
      if (format === 'csv') {
        const csv = culturalMetrics.exportToCSV(snapshot);
        return c.text(csv, 200, { 'Content-Type': 'text/csv' });
      }
      
      return c.json({ snapshot });
    } catch (error: any) {
      console.error("Error generating cultural impact snapshot:", error);
      return c.json({ error: `Failed to generate snapshot: ${error.message}` }, 500);
    }
  });

  app.post("/make-server-2bdc05e6/metrics/track-view", async (c: any) => {
    try {
      const { contentId, sessionId } = await c.req.json();
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      
      let userId;
      if (accessToken) {
        const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken);
        userId = user?.id;
      }
      
      await culturalMetrics.trackContentView(contentId, userId || 'anonymous', sessionId);
      
      return c.json({ message: "View tracked" });
    } catch (error: any) {
      console.error("Error tracking view:", error);
      return c.json({ error: `Failed to track view: ${error.message}` }, 500);
    }
  });

  app.post("/make-server-2bdc05e6/metrics/track-progress", async (c: any) => {
    try {
      const { sessionId, chapterIndex, totalChapters } = await c.req.json();
      
      await culturalMetrics.trackChapterProgress(sessionId, chapterIndex, totalChapters);
      
      return c.json({ message: "Progress tracked" });
    } catch (error: any) {
      console.error("Error tracking progress:", error);
      return c.json({ error: `Failed to track progress: ${error.message}` }, 500);
    }
  });

  // ============================================================================
  // GOVERNANCE & MODERATION ENDPOINTS
  // ============================================================================

  app.post("/make-server-2bdc05e6/governance/report", async (c: any) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      
      let reporterId = 'anonymous';
      if (accessToken) {
        const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken);
        reporterId = user?.id || 'anonymous';
      }
      
      const { contentId, reason, description, culturalContext } = await c.req.json();
      
      const content = await kv.get(`content:${contentId}`);
      if (!content) {
        return c.json({ error: "Content not found" }, 404);
      }
      
      const flag = await governance.createCommunityFlag(
        contentId,
        content.authorId,
        reporterId,
        reason,
        description,
        culturalContext
      );
      
      return c.json({ flag, message: "Report submitted successfully" });
    } catch (error: any) {
      console.error("Error reporting content:", error);
      return c.json({ error: `Failed to report content: ${error.message}` }, 500);
    }
  });

  app.get("/make-server-2bdc05e6/governance/stats", requireRole(['moderator', 'admin']), async (c: any) => {
    try {
      const startDate = c.req.query('startDate') ? new Date(c.req.query('startDate')!) : undefined;
      const endDate = c.req.query('endDate') ? new Date(c.req.query('endDate')!) : undefined;
      
      const stats = await governance.getModerationStats(startDate, endDate);
      
      return c.json({ stats });
    } catch (error: any) {
      console.error("Error getting moderation stats:", error);
      return c.json({ error: `Failed to get stats: ${error.message}` }, 500);
    }
  });

  // ============================================================================
  // CREATOR RIGHTS & IP PROTECTION ENDPOINTS
  // ============================================================================

  app.post("/make-server-2bdc05e6/ip/set-license", async (c: any) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      
      if (!accessToken) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
      
      if (error || !user) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      
      const licenseData = await c.req.json();
      
      const license = await creatorRights.setContentLicense(
        licenseData.contentId,
        user.id,
        licenseData
      );
      
      return c.json({ license });
    } catch (error: any) {
      console.error("Error setting license:", error);
      return c.json({ error: `Failed to set license: ${error.message}` }, 500);
    }
  });

  app.get("/make-server-2bdc05e6/ip/attribution/:contentId", async (c: any) => {
    try {
      const contentId = c.req.param('contentId');
      
      const attribution = await creatorRights.getAttributionRecord(contentId);
      const attributionText = await creatorRights.generateAttributionText(contentId);
      
      return c.json({ attribution, attributionText });
    } catch (error: any) {
      console.error("Error getting attribution:", error);
      return c.json({ error: `Failed to get attribution: ${error.message}` }, 500);
    }
  });

  app.post("/make-server-2bdc05e6/ip/export", async (c: any) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      
      let userId;
      if (accessToken) {
        const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken);
        userId = user?.id;
      }
      
      const exportRequest = await c.req.json();
      
      const exportData = await creatorRights.requestContentExport({
        ...exportRequest,
        userId: userId || 'anonymous',
      });
      
      return c.json({ exportData });
    } catch (error: any) {
      console.error("Error requesting export:", error);
      return c.json({ error: `Failed to request export: ${error.message}` }, 500);
    }
  });

  // ============================================================================
  // ETHICAL DISCOVERY ENDPOINTS
  // ============================================================================

  app.post("/make-server-2bdc05e6/discovery/start", async (c: any) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      
      let userId;
      if (accessToken) {
        const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken);
        userId = user?.id;
      }
      
      const session = await ethicalDiscovery.startDiscoverySession(userId);
      
      return c.json({ session });
    } catch (error: any) {
      console.error("Error starting discovery session:", error);
      return c.json({ error: `Failed to start session: ${error.message}` }, 500);
    }
  });

  app.get("/make-server-2bdc05e6/discovery/recommendations/:sessionId", async (c: any) => {
    try {
      const sessionId = c.req.param('sessionId');
      const limit = parseInt(c.req.query('limit') || '10');
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      
      let userId;
      if (accessToken) {
        const { data: { user } } = await supabaseAdmin.auth.getUser(accessToken);
        userId = user?.id;
      }
      
      const recommendations = await ethicalDiscovery.getRecommendations(sessionId, userId, limit);
      
      return c.json({ recommendations });
    } catch (error: any) {
      console.error("Error getting recommendations:", error);
      return c.json({ error: `Failed to get recommendations: ${error.message}` }, 500);
    }
  });

  app.get("/make-server-2bdc05e6/discovery/featured", async (c: any) => {
    try {
      const language = c.req.query('language');
      
      const featured = await ethicalDiscovery.getFeaturedContent(language);
      
      return c.json({ featured });
    } catch (error: any) {
      console.error("Error getting featured content:", error);
      return c.json({ error: `Failed to get featured content: ${error.message}` }, 500);
    }
  });

  app.post("/make-server-2bdc05e6/discovery/curate", requireRole(['moderator', 'admin']), async (c: any) => {
    try {
      const user = c.get('user');
      const curationData = await c.req.json();
      
      const curation = await ethicalDiscovery.curateContent({
        ...curationData,
        curatorId: user.id,
      });
      
      return c.json({ curation });
    } catch (error: any) {
      console.error("Error curating content:", error);
      return c.json({ error: `Failed to curate content: ${error.message}` }, 500);
    }
  });

  // ============================================================================
  // ACCESSIBILITY ENDPOINTS
  // ============================================================================

  app.post("/make-server-2bdc05e6/accessibility/captions", async (c: any) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      
      if (!accessToken) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
      
      if (error || !user) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      
      const captionData = await c.req.json();
      
      const captions = await accessibility.addCaptions({
        ...captionData,
        createdBy: user.id,
      });
      
      return c.json({ captions });
    } catch (error: any) {
      console.error("Error adding captions:", error);
      return c.json({ error: `Failed to add captions: ${error.message}` }, 500);
    }
  });

  app.post("/make-server-2bdc05e6/accessibility/transcript", async (c: any) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      
      if (!accessToken) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
      
      if (error || !user) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      
      const transcriptData = await c.req.json();
      
      const transcript = await accessibility.addTranscript({
        ...transcriptData,
        createdBy: user.id,
      });
      
      return c.json({ transcript });
    } catch (error: any) {
      console.error("Error adding transcript:", error);
      return c.json({ error: `Failed to add transcript: ${error.message}` }, 500);
    }
  });

  app.get("/make-server-2bdc05e6/accessibility/compliance-report", requireRole(['moderator', 'admin']), async (c: any) => {
    try {
      const report = await accessibility.getAccessibilityComplianceReport();
      
      return c.json({ report });
    } catch (error: any) {
      console.error("Error getting accessibility compliance report:", error);
      return c.json({ error: `Failed to get report: ${error.message}` }, 500);
    }
  });

  // ============================================================================
  // GRANT READINESS & AUDIT ENDPOINTS
  // ============================================================================

  app.post("/make-server-2bdc05e6/grant/generate-report", requireRole(['admin']), async (c: any) => {
    try {
      const user = c.get('user');
      const { reportType, startDate, endDate } = await c.req.json();
      const format = c.req.query('format') || 'json';
      
      const report = await grantReadiness.generateGrantReport({
        reportType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        generatedBy: user.id,
      });
      
      if (format === 'csv') {
        const csv = grantReadiness.exportGrantReportToCSV(report);
        return c.text(csv, 200, { 'Content-Type': 'text/csv' });
      }
      
      return c.json({ report });
    } catch (error: any) {
      console.error("Error generating grant report:", error);
      return c.json({ error: `Failed to generate report: ${error.message}` }, 500);
    }
  });

  app.post("/make-server-2bdc05e6/grant/milestone", requireRole(['admin']), async (c: any) => {
    try {
      const user = c.get('user');
      const milestoneData = await c.req.json();
      
      const milestone = await grantReadiness.createMilestone({
        ...milestoneData,
        createdBy: user.id,
      });
      
      return c.json({ milestone });
    } catch (error: any) {
      console.error("Error creating milestone:", error);
      return c.json({ error: `Failed to create milestone: ${error.message}` }, 500);
    }
  });

  app.get("/make-server-2bdc05e6/grant/milestones", requireRole(['admin', 'moderator']), async (c: any) => {
    try {
      const grantRelated = c.req.query('grantRelated') === 'true';
      const status = c.req.query('status');
      
      const milestones = await grantReadiness.getMilestones(grantRelated, status);
      
      return c.json({ milestones });
    } catch (error: any) {
      console.error("Error getting milestones:", error);
      return c.json({ error: `Failed to get milestones: ${error.message}` }, 500);
    }
  });

  app.post("/make-server-2bdc05e6/grant/incident", async (c: any) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      
      if (!accessToken) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
      
      if (error || !user) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      
      const incidentData = await c.req.json();
      
      const incident = await grantReadiness.reportIncident({
        ...incidentData,
        reportedBy: user.id,
      });
      
      return c.json({ incident });
    } catch (error: any) {
      console.error("Error reporting incident:", error);
      return c.json({ error: `Failed to report incident: ${error.message}` }, 500);
    }
  });

  app.get("/make-server-2bdc05e6/grant/activity-logs", requireRole(['admin']), async (c: any) => {
    try {
      const startDate = c.req.query('startDate') ? new Date(c.req.query('startDate')!) : undefined;
      const endDate = c.req.query('endDate') ? new Date(c.req.query('endDate')!) : undefined;
      const category = c.req.query('category');
      
      const logs = await grantReadiness.getActivityLogs(startDate, endDate, category);
      
      return c.json({ logs, total: logs.length });
    } catch (error: any) {
      console.error("Error getting activity logs:", error);
      return c.json({ error: `Failed to get logs: ${error.message}` }, 500);
    }
  });
}
