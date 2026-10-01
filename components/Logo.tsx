import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '@/constants/colors';

type Props = {
  size?: number;
  showWordmark?: boolean;
  color?: string;
};

export function Logo({ size = 48, showWordmark = false, color = Colors.primary }: Props) {
  const s = size;
  return (
    <View style={styles.row}>
      <Svg width={s} height={s} viewBox="0 0 64 64">
        <Defs>
          <LinearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FF8A80" />
            <Stop offset="1" stopColor="#FFAB91" />
          </LinearGradient>
        </Defs>
        <Circle cx="32" cy="32" r="30" fill="url(#g)" />
        {/* stylized calm wave / C mark */}
        <Path
          d="M42 22c-6-5-16-5-22 0-5 4-7 11-5 17 2 6 8 10 15 11"
          stroke="#fff"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M28 38c4 3 10 3 14-1"
          stroke="#fff"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity={0.9}
        />
      </Svg>
      {showWordmark && (
        <View style={styles.wordmark}>
          <Text style={[styles.calm, { color }]}>Calm</Text>
          <Text style={[styles.work, { color }]}> Work</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  calm: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  work: {
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: -0.3,
    opacity: 0.9,
  },
});

export default Logo;
