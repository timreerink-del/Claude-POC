import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, fontFamilies, typeScale, spacing, radius, shadows } from '../tokens';

// ── Types ────────────────────────────────────────────────

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'sandra';
  timestamp: Date;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isBot?: boolean;
}

type ConnectView = 'onboarding' | 'conversations' | 'chat';

// ── Sandra Bot Responses ─────────────────────────────────

const SANDRA_GREETING = `Hi there! 👋 I'm Sandra, your personal career assistant.\n\nI can help you with:\n• Finding shifts that match your skills\n• Preparing for interviews\n• Understanding job requirements\n• Career advice & tips\n\nWhat can I help you with today?`;

const SANDRA_RESPONSES: Record<string, string> = {
  shifts: `Great question! Based on your profile, I found some shifts that might interest you:\n\n🏥 Healthcare Assistant — Royal London Hospital\n☕ Barista — Pret A Manger, Canary Wharf\n📦 Warehouse Operative — Amazon, Tilbury\n\nWould you like me to show you more details on any of these?`,
  interview: `Here are my top interview tips:\n\n1. Research the company beforehand\n2. Prepare 2-3 questions to ask them\n3. Arrive 10 minutes early\n4. Bring copies of your CV\n5. Follow up with a thank-you message\n\nWould you like me to help you prepare for a specific role?`,
  help: `I'm here to help! You can ask me about:\n\n• Available shifts near you\n• Interview preparation\n• CV tips\n• Career development\n• Workplace rights\n\nJust type your question and I'll do my best to assist! 😊`,
  default: `That's a great question! Let me look into that for you.\n\nIn the meantime, you can browse available shifts in the Discovery tab, or I can help you with interview prep, CV advice, or finding the right role.\n\nIs there anything specific I can help with?`,
};

function getSandraResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('shift') || lower.includes('job') || lower.includes('work')) {
    return SANDRA_RESPONSES.shifts;
  }
  if (lower.includes('interview') || lower.includes('prepare') || lower.includes('tips')) {
    return SANDRA_RESPONSES.interview;
  }
  if (lower.includes('help') || lower.includes('what can') || lower.includes('how')) {
    return SANDRA_RESPONSES.help;
  }
  return SANDRA_RESPONSES.default;
}

// ── Mock Data ────────────────────────────────────────────

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'sandra',
    name: 'Sandra',
    avatar: '🤖',
    lastMessage: 'Hi! How can I help you today?',
    time: 'Now',
    unread: 1,
    isBot: true,
  },
  {
    id: 'employer1',
    name: 'Costa Coffee — Hiring',
    avatar: '☕',
    lastMessage: 'Thanks for applying! We\'d like to invite you...',
    time: '2h',
    unread: 1,
  },
  {
    id: 'employer2',
    name: 'NHS Recruitment',
    avatar: '🏥',
    lastMessage: 'Your DBS check has been approved.',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: 'employer3',
    name: 'Deliveroo — Rider Team',
    avatar: '🚲',
    lastMessage: 'Welcome to the team! Here\'s your first...',
    time: 'Mon',
    unread: 0,
  },
];

// ── Onboarding Component ─────────────────────────────────

function ConnectOnboarding({ onComplete }: { onComplete: () => void }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.onboardingContainer}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.onboardingIcon}>
          <View style={styles.sandraAvatarLarge}>
            <Text style={{ fontSize: 48 }}>💬</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={styles.onboardingTitle}>Meet Sandra</Text>
          <Text style={styles.onboardingSubtitle}>
            Your personal career assistant, available 24/7
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.featureList}>
          {[
            { icon: 'search' as const, text: 'Find shifts matched to your skills' },
            { icon: 'message-circle' as const, text: 'Chat with employers directly' },
            { icon: 'star' as const, text: 'Get personalised career advice' },
            { icon: 'bell' as const, text: 'Instant notifications on applications' },
          ].map((feature, i) => (
            <Animated.View
              key={feature.text}
              entering={FadeInDown.delay(600 + i * 100).duration(400)}
              style={styles.featureRow}
            >
              <View style={styles.featureIconCircle}>
                <Feather name={feature.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>{feature.text}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(1000).duration(500)} style={styles.onboardingCTAWrap}>
          <Pressable testID="start-chatting-btn" style={styles.onboardingCTA} onPress={onComplete}>
            <Text style={styles.onboardingCTAText}>Start chatting</Text>
            <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// ── Conversation List ────────────────────────────────────

function ConversationList({
  onOpenChat,
}: {
  onOpenChat: (conv: Conversation) => void;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connect</Text>
        <Pressable style={styles.headerBtn}>
          <Feather name="edit" size={20} color={colors.primary} />
        </Pressable>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <Feather name="search" size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search conversations..."
          placeholderTextColor={colors.mutedForeground}
          style={styles.searchInput}
        />
      </View>

      {/* Sandra banner */}
      <Pressable
        testID="sandra-banner"
        style={styles.sandraBanner}
        onPress={() => onOpenChat(MOCK_CONVERSATIONS[0])}
      >
        <View style={styles.sandraBannerAvatar}>
          <Text style={{ fontSize: 24 }}>🤖</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.sandraBannerTitle}>Ask Sandra anything</Text>
          <Text style={styles.sandraBannerSub}>Career advice, shift search, interview prep</Text>
        </View>
        <Feather name="chevron-right" size={18} color={colors.primary} />
      </Pressable>

      {/* Conversation list */}
      <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Pressable
            testID={`conv-${item.id}`}
            style={styles.convRow}
            onPress={() => onOpenChat(item)}
          >
            <View style={[styles.convAvatar, item.isBot && styles.convAvatarBot]}>
              <Text style={{ fontSize: 20 }}>{item.avatar}</Text>
            </View>
            <View style={styles.convContent}>
              <View style={styles.convTopRow}>
                <Text style={styles.convName} numberOfLines={1}>
                  {item.name}
                  {item.isBot && (
                    <Text style={styles.botBadgeText}> BOT</Text>
                  )}
                </Text>
                <Text style={styles.convTime}>{item.time}</Text>
              </View>
              <Text style={styles.convLastMsg} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            {item.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

// ── Chat View ────────────────────────────────────────────

function ChatView({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Sandra greeting on mount
  useEffect(() => {
    if (conversation.isBot) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            id: '1',
            text: SANDRA_GREETING,
            sender: 'sandra',
            timestamp: new Date(),
          },
        ]);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [conversation.isBot]);

  const sendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Sandra auto-reply
    if (conversation.isBot) {
      setIsTyping(true);
      const responseText = getSandraResponse(userMsg.text);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: responseText,
            sender: 'sandra',
            timestamp: new Date(),
          },
        ]);
      }, 1000 + Math.random() * 1000);
    }
  }, [inputText, conversation.isBot]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <Animated.View
        entering={FadeInDown.duration(250)}
        style={[
          styles.msgBubble,
          isUser ? styles.msgUser : styles.msgSandra,
        ]}
      >
        <Text
          style={[
            styles.msgText,
            isUser ? styles.msgTextUser : styles.msgTextSandra,
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.msgTime,
            isUser ? styles.msgTimeUser : styles.msgTimeSandra,
          ]}
        >
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Chat header */}
      <View style={styles.chatHeader}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.chatBackBtn}>
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </Pressable>
        <View style={[styles.chatHeaderAvatar, conversation.isBot && styles.convAvatarBot]}>
          <Text style={{ fontSize: 18 }}>{conversation.avatar}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.chatHeaderName}>
            {conversation.name}
            {conversation.isBot && <Text style={styles.botBadgeText}> BOT</Text>}
          </Text>
          {conversation.isBot && (
            <Text style={styles.chatHeaderStatus}>Always available</Text>
          )}
        </View>
        <Pressable hitSlop={12}>
          <Feather name="more-vertical" size={20} color={colors.foreground} />
        </Pressable>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatMessages}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            !isTyping ? (
              <View style={styles.chatEmpty}>
                <Text style={styles.chatEmptyText}>Start a conversation</Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            isTyping ? (
              <Animated.View entering={FadeIn.duration(300)} style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, { animationDelay: '0.2s' }]} />
                <View style={[styles.typingDot, { animationDelay: '0.4s' }]} />
                <Text style={styles.typingText}>Sandra is typing...</Text>
              </Animated.View>
            ) : null
          }
        />

        {/* Input bar */}
        <View style={styles.inputBar}>
          <Pressable style={styles.inputAttach}>
            <Feather name="plus" size={22} color={colors.primary} />
          </Pressable>
          <View style={styles.inputWrap}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={colors.mutedForeground}
              style={styles.chatInput}
              multiline
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              blurOnSubmit
            />
          </View>
          <Pressable
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Feather
              name="send"
              size={18}
              color={inputText.trim() ? colors.primaryForeground : colors.mutedForeground}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Main Connect Screen ──────────────────────────────────

export function ConnectScreen() {
  const [view, setView] = useState<ConnectView>('onboarding');
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const handleOnboardingComplete = useCallback(() => {
    setView('conversations');
  }, []);

  const handleOpenChat = useCallback((conv: Conversation) => {
    setActiveConversation(conv);
    setView('chat');
  }, []);

  const handleBackToList = useCallback(() => {
    setActiveConversation(null);
    setView('conversations');
  }, []);

  if (view === 'onboarding') {
    return <ConnectOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (view === 'chat' && activeConversation) {
    return <ChatView conversation={activeConversation} onBack={handleBackToList} />;
  }

  return <ConversationList onOpenChat={handleOpenChat} />;
}

// ── Styles ───────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Onboarding ──
  onboardingContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingIcon: {
    marginBottom: spacing.xxl,
  },
  sandraAvatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  onboardingTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale['2xl'].fontSize,
    lineHeight: typeScale['2xl'].lineHeight,
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  onboardingSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
  featureList: {
    marginTop: spacing.xxl,
    width: '100%',
    gap: spacing.m,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  featureIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontFamily: fontFamilies.medium,
    fontSize: typeScale.base.fontSize,
    lineHeight: typeScale.base.lineHeight,
    color: colors.foreground,
    flex: 1,
  },
  onboardingCTAWrap: {
    marginTop: 40,
    width: '100%',
  },
  onboardingCTA: {
    backgroundColor: colors.primary,
    borderRadius: radius.m,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  onboardingCTAText: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.base.fontSize,
    color: colors.primaryForeground,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.s,
    paddingBottom: spacing.s,
  },
  headerTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.xl.fontSize,
    lineHeight: typeScale.xl.lineHeight,
    color: colors.foreground,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Search ──
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.l,
    marginBottom: spacing.m,
    paddingHorizontal: spacing.m,
    height: 40,
    backgroundColor: colors.secondary,
    borderRadius: radius.m,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    color: colors.foreground,
    paddingVertical: 0,
  },

  // ── Sandra Banner ──
  sandraBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.l,
    marginBottom: spacing.m,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    backgroundColor: colors.tertiary,
    borderRadius: radius.m,
    gap: spacing.s,
  },
  sandraBannerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sandraBannerTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.sm.fontSize,
    color: colors.primary,
  },
  sandraBannerSub: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },

  // ── Conversation Row ──
  convRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    gap: spacing.s,
  },
  convAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  convAvatarBot: {
    backgroundColor: colors.tertiary,
  },
  convContent: {
    flex: 1,
  },
  convTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  convName: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.sm.fontSize,
    color: colors.foreground,
    flex: 1,
  },
  botBadgeText: {
    fontFamily: fontFamilies.medium,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  convTime: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  convLastMsg: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
    color: colors.textMuted,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  unreadText: {
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
    color: colors.primaryForeground,
  },

  // ── Chat Header ──
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    gap: spacing.xs,
  },
  chatBackBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderName: {
    fontFamily: fontFamilies.semibold,
    fontSize: typeScale.base.fontSize,
    color: colors.foreground,
  },
  chatHeaderStatus: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: colors.successText,
  },

  // ── Messages ──
  chatMessages: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    paddingBottom: spacing.xs,
  },
  msgBubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: radius.l,
    marginBottom: spacing.xs,
  },
  msgUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  msgSandra: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    lineHeight: typeScale.sm.lineHeight,
  },
  msgTextUser: {
    color: colors.primaryForeground,
  },
  msgTextSandra: {
    color: colors.foreground,
  },
  msgTime: {
    fontFamily: fontFamilies.regular,
    fontSize: 10,
    marginTop: 4,
  },
  msgTimeUser: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  msgTimeSandra: {
    color: colors.textMuted,
  },

  // ── Typing ──
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    backgroundColor: colors.secondary,
    borderRadius: radius.l,
    gap: 4,
    marginBottom: spacing.xs,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.mutedForeground,
    opacity: 0.6,
  },
  typingText: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 4,
  },

  // ── Input Bar ──
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    gap: spacing.xs,
  },
  inputAttach: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: radius.l,
    paddingHorizontal: spacing.m,
    minHeight: 38,
    maxHeight: 120,
    justifyContent: 'center',
  },
  chatInput: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    color: colors.foreground,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  sendBtnDisabled: {
    backgroundColor: colors.secondary,
  },

  // ── Empty ──
  chatEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  chatEmptyText: {
    fontFamily: fontFamilies.regular,
    fontSize: typeScale.sm.fontSize,
    color: colors.textMuted,
  },
});
