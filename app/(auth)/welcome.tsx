import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Logo } from '@/components/Logo';
import { PrimaryButton } from '@/components/CalmUI';
import { Colors } from '@/constants/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Full coral wave background */}
      <Svg
        width={width}
        height={height * 0.58}
        viewBox={`0 0 ${width} ${height * 0.58}`}
        style={styles.wave}
      >
        <Defs>
          <LinearGradient id="w" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FF8A80" />
            <Stop offset="1" stopColor="#FFAB91" />
          </LinearGradient>
        </Defs>
        <Path
          d={`M0 0 H${width} V${height * 0.42}
            C${width * 0.8} ${height * 0.52} ${width * 0.6} ${height * 0.35} ${width * 0.4} ${height * 0.48}
            C${width * 0.2} ${height * 0.58} ${width * 0.1} ${height * 0.4} 0 ${height * 0.5} Z`}
          fill="url(#w)"
        />
        <Path
          d={`M0 ${height * 0.2} Q${width * 0.3} ${height * 0.15} ${width * 0.55} ${height * 0.25}
            T${width} ${height * 0.18}`}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.5"
          fill="none"
        />
        <Path
          d={`M0 ${height * 0.32} Q${width * 0.25} ${height * 0.28} ${width * 0.5} ${height * 0.36}
            T${width} ${height * 0.3}`}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.2"
          fill="none"
        />
      </Svg>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.top}>
          <Logo size={56} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.tagline}>
            Stay focused. Work calmly.{'\n'}Your business, organized.
          </Text>
        </View>

        <View style={styles.bottom}>
          <PrimaryButton
            title="Continue"
            onPress={() => router.push('/(auth)/sign-in')}
            style={styles.cta}
          />
          <Pressable onPress={() => router.push('/(auth)/sign-up')} style={styles.linkRow}>
            <Text style={styles.linkMuted}>New here? </Text>
            <Text style={styles.link}>Create account</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  wave: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
  },
  top: {
    paddingHorizontal: 28,
    paddingTop: 12,
  },
  hero: {
    paddingHorizontal: 28,
    marginTop: height * 0.18,
  },
  welcome: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -1,
  },
  tagline: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '500',
  },
  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  cta: {
    marginBottom: 16,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkMuted: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  link: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
