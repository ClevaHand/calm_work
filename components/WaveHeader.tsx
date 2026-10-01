import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

type Props = {
  title: string;
  subtitle?: string;
  height?: number;
};

/**
 * Coral wavy header inspired by the reference login UI.
 */
export function WaveHeader({ title, subtitle, height = 220 }: Props) {
  const h = height;
  return (
    <View style={[styles.wrap, { height: h }]}>
      <Svg
        width={width}
        height={h}
        viewBox={`0 0 ${width} ${h}`}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <LinearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FF8A80" />
            <Stop offset="1" stopColor="#FFAB91" />
          </LinearGradient>
        </Defs>
        {/* main fill */}
        <Path
          d={`M0 0 H${width} V${h * 0.72}
            C${width * 0.75} ${h * 0.92} ${width * 0.55} ${h * 0.55} ${width * 0.35} ${h * 0.78}
            C${width * 0.18} ${h * 0.95} ${width * 0.08} ${h * 0.7} 0 ${h * 0.82} Z`}
          fill="url(#waveGrad)"
        />
        {/* subtle contour lines */}
        <Path
          d={`M0 ${h * 0.35} Q${width * 0.25} ${h * 0.28} ${width * 0.5} ${h * 0.4}
            T${width} ${h * 0.32}`}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
          fill="none"
        />
        <Path
          d={`M0 ${h * 0.5} Q${width * 0.3} ${h * 0.42} ${width * 0.55} ${h * 0.55}
            T${width} ${h * 0.48}`}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.2"
          fill="none"
        />
        <Path
          d={`M0 ${h * 0.22} Q${width * 0.2} ${h * 0.18} ${width * 0.45} ${h * 0.28}
            T${width} ${h * 0.2}`}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          fill="none"
        />
      </Svg>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
});

export default WaveHeader;
