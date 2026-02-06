import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { 
  ChevronLeft, 
  Eye, 
  Globe, 
  Lock,
  Building2,
  Play,
  Check,
  Shield,
  FileText,
  Sparkles
} from "lucide-react";
import { TRANSITIONS, VARIANTS, prefersReducedMotion, triggerHaptic } from "../../utils/motion";

interface PreviewPublishStepProps {
  onPublish: (data: PublishData) => void;
  onBack: () => void;
  storyTitle: string;
  totalChapters: number;
  storyLanguages: Array<'en' | 'fr' | 'es'>;
}

export interface PublishData {
  visibility: 'public' | 'institutional' | 'private';
  institutionalCollection?: string;
  rightsConfirmed: boolean;
  guidelinesAccepted: boolean;
}

type PreviewMode = 'viewer' | 'language' | 'accessibility';

const VISIBILITY_OPTIONS = [
  {
    value: 'public',
    label: 'Public',
    description: 'Visible to all SEEN audiences',
    icon: Globe,
  },
  {
    value: 'institutional',
    label: 'Institutional Collection',
    description: 'Shared with partnered institutions',
    icon: Building2,
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can see this (draft/testing)',
    icon: Lock,
  },
] as const;

export function PreviewPublishStep({
  onPublish,
  onBack,
  storyTitle,
  totalChapters,
  storyLanguages,
}: PreviewPublishStepProps) {
  const reducedMotion = prefersReducedMotion();
  
  const [previewMode, setPreviewMode] = useState<PreviewMode>('viewer');
  const [visibility, setVisibility] = useState<'public' | 'institutional' | 'private'>('public');
  const [institutionalCollection, setInstitutionalCollection] = useState('');
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const canPublish = rightsConfirmed && guidelinesAccepted && 
                     (visibility !== 'institutional' || institutionalCollection);

  const handlePublish = () => {
    if (canPublish) {
      triggerHaptic('heavy');
      onPublish({
        visibility,
        institutionalCollection: visibility === 'institutional' ? institutionalCollection : undefined,
        rightsConfirmed,
        guidelinesAccepted,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Header */}
      <motion.div
        variants={!reducedMotion ? VARIANTS.fadeInDown : undefined}
        initial="initial"
        animate="animate"
        transition={TRANSITIONS.reveal}
        className="px-5 pt-8 pb-6 border-b border-white/10"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs tracking-widest uppercase text-white/40">Step 5 of 5</span>
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <span className="text-xs tracking-widest uppercase text-white/60">Preview & Publish</span>
        </div>
        <h1 className="text-2xl font-light tracking-wide mb-2">Final Review</h1>
        <p className="text-sm text-white/60 leading-relaxed">
          Preview your story and confirm publishing details.
        </p>
      </motion.div>

      {/* Story Summary */}
      <motion.div
        variants={!reducedMotion ? VARIANTS.fadeInUp : undefined}
        initial="initial"
        animate="animate"
        transition={{ ...TRANSITIONS.organic, delay: 0.1 }}
        className="px-5 py-6 border-b border-white/10"
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white/60" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-light tracking-wide mb-2">{storyTitle}</h2>
            <div className="flex flex-wrap gap-3 text-xs text-white/60">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{totalChapters} chapters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>
                  {storyLanguages.map(l => 
                    l === 'en' ? 'EN' : l === 'fr' ? 'FR' : 'ES'
                  ).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preview Modes */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="mb-4">
          <h3 className="text-base font-light tracking-wide mb-2">Preview Modes</h3>
          <p className="text-xs text-white/50 leading-relaxed">
            See how your story will appear to different audiences.
          </p>
        </div>

        {/* Preview Mode Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { id: 'viewer', label: 'Viewer', icon: Eye },
            { id: 'language', label: 'Language', icon: Globe },
            { id: 'accessibility', label: 'Accessibility', icon: Eye },
          ].map(({ id, label, icon: Icon }) => {
            const isActive = previewMode === id;
            
            return (
              <button
                key={id}
                type="button"
                onClick={() => setPreviewMode(id as PreviewMode)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-all ${
                  isActive
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-xs tracking-wide">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Preview Area */}
        <div className="aspect-[9/16] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
          <div className="text-center px-8">
            <Play className="w-12 h-12 text-white/40 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-sm text-white/60 mb-2">Preview Mode: {previewMode}</p>
            <p className="text-xs text-white/40">Interactive preview coming soon</p>
          </div>
        </div>
      </div>

      {/* Visibility Settings */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="mb-4">
          <h3 className="text-base font-light tracking-wide mb-2">Visibility</h3>
          <p className="text-xs text-white/50 leading-relaxed">
            Choose who can access your story.
          </p>
        </div>

        <div className="space-y-2">
          {VISIBILITY_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = visibility === option.value;
            
            return (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => setVisibility(option.value)}
                whileHover={!reducedMotion ? { x: 4 } : undefined}
                className={`w-full p-4 rounded-lg border transition-all text-left ${
                  isSelected
                    ? 'bg-white/10 border-white/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected ? 'border-white bg-white' : 'border-white/30'
                  }`}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-black"
                      />
                    )}
                  </div>
                  <Icon className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-0.5">{option.label}</div>
                    <div className="text-xs text-white/50">{option.description}</div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Institutional Collection Input */}
        <AnimatePresence>
          {visibility === 'institutional' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={TRANSITIONS.organic}
              className="mt-3"
            >
              <label className="block">
                <span className="text-xs tracking-wider uppercase text-white/60 mb-2 block">
                  Select Collection
                </span>
                <select
                  value={institutionalCollection}
                  onChange={(e) => setInstitutionalCollection(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none"
                >
                  <option value="">Choose a collection...</option>
                  <option value="nfb-indigenous">NFB Indigenous Voices</option>
                  <option value="cmh-franco">Canadian Museum - Franco Heritage</option>
                  <option value="tpl-multicultural">Toronto Public Library - Multicultural</option>
                </select>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rights & Guidelines */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="mb-4">
          <h3 className="text-base font-light tracking-wide mb-2">Confirmations</h3>
        </div>

        <div className="space-y-3">
          {/* Rights Confirmation */}
          <motion.button
            type="button"
            onClick={() => setRightsConfirmed(!rightsConfirmed)}
            whileHover={!reducedMotion ? { x: 4 } : undefined}
            className={`w-full p-4 rounded-lg border transition-all text-left ${
              rightsConfirmed
                ? 'bg-white/10 border-white/30'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                rightsConfirmed ? 'border-white bg-white' : 'border-white/30'
              }`}>
                {rightsConfirmed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-sm bg-black"
                  />
                )}
              </div>
              <Shield className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div className="flex-1">
                <div className="text-sm text-white mb-1">Rights & IP Ownership</div>
                <div className="text-xs text-white/50 leading-relaxed">
                  I confirm I have the rights to publish this content. 
                  <strong className="text-white/70"> I retain full ownership</strong> of my work, 
                  and grant SEEN a non-exclusive license to present it.
                </div>
              </div>
            </div>
          </motion.button>

          {/* Community Guidelines */}
          <motion.button
            type="button"
            onClick={() => setGuidelinesAccepted(!guidelinesAccepted)}
            whileHover={!reducedMotion ? { x: 4 } : undefined}
            className={`w-full p-4 rounded-lg border transition-all text-left ${
              guidelinesAccepted
                ? 'bg-white/10 border-white/30'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                guidelinesAccepted ? 'border-white bg-white' : 'border-white/30'
              }`}>
                {guidelinesAccepted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-sm bg-black"
                  />
                )}
              </div>
              <FileText className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div className="flex-1">
                <div className="text-sm text-white mb-1">Community Guidelines</div>
                <div className="text-xs text-white/50 leading-relaxed">
                  I agree to SEEN's community guidelines regarding respectful cultural representation 
                  and ethical storytelling practices.
                </div>
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Publish Confirmation Message */}
      <AnimatePresence>
        {showPublishConfirm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={TRANSITIONS.organic}
            className="px-5 py-6"
          >
            <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...TRANSITIONS.spring, delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-green-500" strokeWidth={2.5} />
              </motion.div>
              <h3 className="text-lg font-light tracking-wide text-white mb-2">
                Your story is ready to be shared
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Once published, your story will {
                  visibility === 'public' ? 'be visible to all SEEN audiences' :
                  visibility === 'institutional' ? 'be shared with selected institutional partners' :
                  'remain private in your library'
                }.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPublishConfirm(false)}
                  className="flex-1 px-6 py-3 border border-white/20 rounded-lg text-sm text-white/80 hover:bg-white/5 transition-all"
                >
                  Review Again
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="flex-1 px-6 py-3 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-all"
                >
                  Confirm & Publish
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-5">
        <div className="max-w-[428px] mx-auto flex items-center justify-between">
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={!reducedMotion ? { scale: 1.02 } : undefined}
            whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
            className="flex items-center gap-2 px-5 py-3 text-sm tracking-wide text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            <span>Back</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setShowPublishConfirm(true)}
            disabled={!canProceed}
            whileHover={!reducedMotion && canProceed ? { scale: 1.02 } : undefined}
            whileTap={!reducedMotion && canProceed ? { scale: 0.98 } : undefined}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg text-sm tracking-wide font-medium transition-all ${
              canProceed
                ? 'bg-white text-black hover:bg-white/90'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" strokeWidth={2} />
            <span>Publish Story</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
