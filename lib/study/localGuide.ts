import i18n from '@/i18n';
import type { StudyChunk } from './types';

/** Offline experiential guide when no Anthropic key is set. */
export function localGuideReply(
  userText: string,
  chunks: StudyChunk[],
  mode: 'chat' | 'daily' | 'fromObservation',
): string {
  const t = i18n.t.bind(i18n);
  const passage = chunks[0];
  const excerpt = passage
    ? `«${passage.text.slice(0, 280).trim()}…»\n— ${passage.author}, ${passage.title}`
    : '';

  if (mode === 'daily' && passage) {
    return [
      t('study.local.dailyLead'),
      excerpt,
      '',
      t('study.local.dailyQ'),
      t('study.local.dailyQ1'),
      t('study.local.dailyQ2'),
      t('study.local.dailyQ3'),
      '',
      t('study.local.footer'),
    ].join('\n');
  }

  if (mode === 'fromObservation') {
    return [
      t('study.local.obsLead'),
      '',
      `${t('study.local.obsLabel')}: “${userText.slice(0, 320)}"`,
      '',
      excerpt ? `${t('study.local.nearby')}\n${excerpt}\n` : '',
      t('study.local.obsTry'),
      t('study.local.obs1'),
      t('study.local.obs2'),
      t('study.local.obs3'),
      '',
      t('study.local.footer'),
    ].join('\n');
  }

  const lower = userText.toLowerCase();
  let hinge = t('study.local.hingeDefault');
  if (/aim|objetivo|proposito|purpose|ziel/.test(lower)) {
    hinge = t('study.local.hingeAim');
  } else if (/identific|irrit|enojo|ansied|miedo|fear|anger|wut/.test(lower)) {
    hinge = t('study.local.hingeEmotion');
  } else if (/recuerd|remember|presenc|stop|souviens|ricord/.test(lower)) {
    hinge = t('study.local.hingeRemember');
  } else if (/centro|center|intelectual|emocional|motor|zentrum/.test(lower)) {
    hinge = t('study.local.hingeCenter');
  }

  return [
    excerpt ? `${t('study.local.fromCorpus')}\n${excerpt}\n` : '',
    hinge,
    '',
    t('study.local.invite'),
    '',
    t('study.local.footer'),
  ]
    .filter(Boolean)
    .join('\n');
}
