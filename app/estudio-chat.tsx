import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Body, Button, Field, Screen } from '@/components/ui';
// Button used for premium gate CTA
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { usePremium } from '@/context/PremiumContext';
import { useWork } from '@/context/WorkContext';
import { createId } from '@/lib/id';
import { askAnthropic } from '@/lib/study/anthropic';
import { localGuideReply } from '@/lib/study/localGuide';
import { sourcesFromChunks } from '@/lib/study/prompt';
import { dailyPassage, retrieveChunks } from '@/lib/study/retrieve';
import { getAnthropicKey } from '@/lib/study/settings';
import type { ChatMessage, StudyMode } from '@/lib/study/types';

export default function EstudioChatScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { track, observations, todayAim } = useWork();
  const { canUse } = usePremium();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode = (params.mode as StudyMode) || 'chat';
  const scrollRef = useRef<ScrollView>(null);
  const aiAllowed = canUse('studyAi');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const starter = useMemo(() => {
    if (mode === 'daily') return t('study.promptDaily');
    if (mode === 'fromObservation') {
      const last = observations[0]?.body;
      return last || t('study.promptFromObsEmpty');
    }
    return '';
  }, [mode, observations, t]);

  useEffect(() => {
    track('screen_estudio_chat', { mode });
  }, [track, mode]);

  useEffect(() => {
    if (mode === 'daily') {
      void send(t('study.promptDaily'), true);
    } else if (mode === 'fromObservation' && starter) {
      setInput(starter);
    }
    // intentionally once on mount for mode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = async (text?: string, silentUser = false) => {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setError(null);
    setInput('');

    const userMsg: ChatMessage = {
      id: createId(),
      role: 'user',
      content,
    };
    const history = silentUser ? messages : [...messages, userMsg];
    if (!silentUser) setMessages(history);
    setBusy(true);
    track('study_ask', { mode });

    try {
      const chunks =
        mode === 'daily'
          ? [dailyPassage()]
          : retrieveChunks(
              [
                content,
                todayAim?.text ?? '',
                observations[0]?.body ?? '',
              ].join(' '),
              4,
            );

      const apiKey = aiAllowed ? await getAnthropicKey() : null;
      let reply: string;
      if (aiAllowed && apiKey) {
        reply = await askAnthropic({
          apiKey,
          lang: i18n.language,
          history: silentUser ? messages : history.slice(0, -1),
          userText: content,
          chunks,
        });
      } else {
        reply = localGuideReply(content, chunks, mode);
        if (!aiAllowed) {
          reply = `${reply}\n\n${t('premium.gateStudyAi')}`;
        }
      }

      const assistant: ChatMessage = {
        id: createId(),
        role: 'assistant',
        content: reply,
        sources: sourcesFromChunks(chunks),
      };
      setMessages((prev) => [...(silentUser ? prev : history), assistant]);
      track(apiKey ? 'study_ai_ok' : 'study_local_ok', { mode });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'ERROR';
      setError(
        msg === 'INVALID_API_KEY' ? t('study.errKey') : t('study.errGeneric'),
      );
      track('study_error');
    } finally {
      setBusy(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={88}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }>
          <Body muted>{t(`study.modeHint.${mode}`)}</Body>
          {!aiAllowed ? (
            <Button
              label={t('study.seePremium')}
              variant="gold"
              onPress={() => router.push('/premium')}
            />
          ) : null}

          {messages.length === 0 && !busy ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>{t('study.emptyTitle')}</Text>
              <Body muted>{t('study.emptyBody')}</Body>
              {mode === 'chat' ? (
                <View style={styles.suggestions}>
                  {[
                    t('study.sug1'),
                    t('study.sug2'),
                    t('study.sug3'),
                  ].map((s) => (
                    <Pressable key={s} onPress={() => send(s)} style={styles.sug}>
                      <Text style={styles.sugText}>{s}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}

          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubble,
                m.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}>
              <Text
                style={[
                  styles.bubbleText,
                  m.role === 'user' && styles.userBubbleText,
                ]}>
                {m.content}
              </Text>
              {m.sources?.length ? (
                <View style={styles.sources}>
                  <Text style={styles.sourcesLabel}>{t('study.sources')}</Text>
                  {m.sources.slice(0, 2).map((s, idx) => (
                    <Text key={`${m.id}-${idx}`} style={styles.sourceItem}>
                      {s.author} — {s.title}
                      {'\n'}
                      {s.excerpt}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          ))}

          {busy ? (
            <View style={styles.busy}>
              <ActivityIndicator color={colors.pine} />
              <Body muted>{t('study.thinking')}</Body>
            </View>
          ) : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>

        <View style={styles.composer}>
          <Field
            value={input}
            onChangeText={setInput}
            placeholder={t('study.placeholder')}
            multiline
            style={{ minHeight: 52, maxHeight: 120 }}
          />
          <Button
            label={t('study.send')}
            onPress={() => send()}
            disabled={!input.trim() || busy}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: 24,
    gap: 12,
  },
  empty: {
    gap: 10,
    marginTop: spacing.md,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink,
  },
  suggestions: {
    gap: 8,
    marginTop: spacing.sm,
  },
  sug: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  sugText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.inkSoft,
  },
  bubble: {
    borderRadius: radii.md,
    padding: spacing.md,
    gap: 8,
  },
  userBubble: {
    backgroundColor: colors.pine,
    alignSelf: 'flex-end',
    maxWidth: '92%',
  },
  assistantBubble: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignSelf: 'flex-start',
    maxWidth: '96%',
  },
  bubbleText: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
  userBubbleText: {
    color: colors.white,
  },
  sources: {
    gap: 6,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  sourcesLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.pine,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sourceItem: {
    fontFamily: fonts.bodyItalic,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  busy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  error: {
    fontFamily: fonts.body,
    color: colors.danger,
    fontSize: 14,
  },
  composer: {
    padding: spacing.md,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.bg,
  },
});
