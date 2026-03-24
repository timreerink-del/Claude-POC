/**
 * Engagement card data for the discovery feed.
 * Each card represents a step the user can take to complete their profile.
 */
import { ImageSourcePropType } from 'react-native';

export interface EngagementCardData {
  id: string;
  emoji: string;
  illustration?: ImageSourcePropType;
  heading: string;
  body?: string;
  ctaLabel: string;
  gradientColors: [string, string];
  pills?: string[];
}

export const ENGAGEMENT_CARDS: EngagementCardData[] = [
  {
    id: 'registration',
    emoji: '🚀',
    illustration: require('../../assets/illustrations/rocket.png'),
    heading: 'get ready to join us.',
    body: 'create your account to apply.',
    ctaLabel: 'Start your registration',
    gradientColors: ['#F0EBFF', '#EBF5FF'],
  },
  {
    id: 'industry',
    emoji: '🚲',
    illustration: require('../../assets/illustrations/scooter.png'),
    heading: 'what industries are you interested in?',
    body: 'pick all that apply.',
    ctaLabel: 'Save preferences',
    gradientColors: ['#FFF0EB', '#FFFAEB'],
    pills: [
      'Hospitality',
      'Logistics',
      'Retail',
      'Events',
      'Tech',
      'Engineering',
      'Healthcare',
      'Finance',
    ],
  },
  {
    id: 'location',
    emoji: '🌍',
    heading: 'share your location.',
    body: 'so we can find jobs near you.',
    ctaLabel: 'Allow location',
    gradientColors: ['#EBFFF0', '#EBF5FF'],
  },
  {
    id: 'profile',
    emoji: '🤖',
    heading: 'build your own profile.',
    body: 'stand out to employers.',
    ctaLabel: 'Start your profile',
    gradientColors: ['#FFFAEB', '#FFF0EB'],
  },
];
