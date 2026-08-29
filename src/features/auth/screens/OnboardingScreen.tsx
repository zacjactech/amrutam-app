// Auth Module - Onboarding Screen

import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { useThemeColors } from '../../../shared/components/ThemeProvider';
import Leaf from '../../../../assets/icons/leaf.svg';
import ShoppingBag from '../../../../assets/icons/shopping-bag.svg';
import Heart from '../../../../assets/icons/heart.svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PAGES = [
  {
    id: 1,
    icon: Leaf,
    title: 'Consult Certified Vaidyas',
    description: 'Connect with experienced Ayurvedic practitioners for personalized wellness guidance.',
  },
  {
    id: 2,
    icon: ShoppingBag,
    title: 'Shop Ayurvedic Products',
    description: 'Discover authentic herbal remedies and wellness essentials curated for you.',
  },
  {
    id: 3,
    icon: Heart,
    title: 'Track Your Health Journey',
    description: 'Monitor your progress and maintain your wellness records in one place.',
  },
];

interface OnboardingScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const colors = useThemeColors();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const handleContinue = () => {
    if (currentPage < PAGES.length - 1) {
      scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH * (currentPage + 1), animated: true });
    } else {
      navigation.navigate('SignIn');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.upperSection, { backgroundColor: colors.background.secondary }]}>
        <SafeAreaView style={styles.upperSafe}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')} accessibilityLabel="Skip onboarding" accessibilityRole="button">
              <AppText variant="button" style={{ color: colors.action.primary }}>Skip</AppText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {PAGES.map((page) => {
            const IconComponent = page.icon;
            return (
              <View key={page.id} style={styles.illustrationArea}>
                <View style={[styles.iconCircle, { backgroundColor: colors.background.secondary }]}>
                  <IconComponent width={80} height={80} />
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={[styles.lowerSection, { backgroundColor: colors.surface.default }]}>
        <SafeAreaView style={styles.lowerSafe} edges={['bottom']}>
          <View style={styles.contentCard}>
            <View style={styles.textContainer}>
              {PAGES.map((page, index) => {
                const inputRange = [
                  (index - 1) * SCREEN_WIDTH,
                  index * SCREEN_WIDTH,
                  (index + 1) * SCREEN_WIDTH,
                ];
                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp',
                });
                const translateY = scrollX.interpolate({
                  inputRange,
                  outputRange: [20, 0, 20],
                  extrapolate: 'clamp',
                });

                return (
                  <Animated.View
                    key={page.id}
                    style={[
                      styles.textWrapper,
                      { opacity, transform: [{ translateY }] },
                    ]}
                    pointerEvents={currentPage === index ? 'auto' : 'none'}
                  >
                    <AppText variant="h1" style={[styles.title, { color: colors.text.primary }]}>
                      {page.title}
                    </AppText>
                    <AppText variant="bodyLarge" style={[styles.description, { color: colors.text.secondary }]}>
                      {page.description}
                    </AppText>
                  </Animated.View>
                );
              })}
            </View>

            <View style={styles.footer}>
              <View style={styles.pagination}>
                {PAGES.map((_, index) => {
                  const inputRange = [
                    (index - 1) * SCREEN_WIDTH,
                    index * SCREEN_WIDTH,
                    (index + 1) * SCREEN_WIDTH,
                  ];
                  const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 24, 8],
                    extrapolate: 'clamp',
                  });
                  const dotOpacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.4, 1, 0.4],
                    extrapolate: 'clamp',
                  });

                  return (
                    <Animated.View
                      key={index}
                      style={[
                        styles.dot,
                        {
                          width: dotWidth,
                          opacity: dotOpacity,
                          backgroundColor: colors.action.primary,
                        },
                      ]}
                    />
                  );
                })}
              </View>
              <Button
                title={currentPage === PAGES.length - 1 ? 'Get Started' : 'Continue'}
                onPress={handleContinue}
                variant="primary"
                size="large"
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperSection: {
    flex: 1,
  },
  upperSafe: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  illustrationArea: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  lowerSection: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  lowerSafe: {
    flex: 0,
  },
  contentCard: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
    height: 100,
  },
  textWrapper: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    gap: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
