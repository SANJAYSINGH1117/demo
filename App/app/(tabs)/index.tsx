import React, { useState } from 'react';
import { SafeAreaView, View,  Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, FlatList } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { StatusBar } from 'expo-status-bar';

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({ chartCard: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  cardSubtitle: { fontSize: 14, fontWeight: '500' },
  chartGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  portfolioCard: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  portfolioRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  holdItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#eee' },
  orderPanel: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 8 },
  btn: { flex: 1, padding: 12, borderRadius: 4, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#2196F3' },
  btnSecondary: { backgroundColor: '#f44336' },
  btnText: { color: '#fff', fontWeight: '600' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  main: { flex: 1 },
  sectionTitle: { fontSize: 24, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
});

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [{ data: [20, 45, 28, 80, 99, 43] }],
};


const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(33,150,243, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
  style: { borderRadius: 16 },
};

// Mock Data
const chartsMock = [
  { title: 'NIFTY 50', labels: ['9:15', '10', '11', '12', '1', '2', '3'], values: [21000, 21200, 21150, 21300, 21450, 21350, 21500] },
  { title: 'BANKNIFTY', labels: ['9:15', '10', '11', '12', '1', '2', '3'], values: [44500, 44700, 44650, 44800, 44950, 44900, 45050] },
  { title: 'Reliance', labels: ['9:15', '10', '11', '12', '1', '2', '3'], values: [2400, 2410, 2405, 2415, 2420, 2410, 2425] },
  { title: 'TCS', labels: ['9:15', '10', '11', '12', '1', '2', '3'], values: [3200, 3210, 3205, 3230, 3220, 3215, 3240] },
];

const holdingsMock = {
  totalValue: 1245000,
  dayPL: 1.2,
  items: [
    { symbol: 'RELIANCE', qty: 10, ltp: 2425 },
    { symbol: 'TCS', qty: 5, ltp: 3240 },
    { symbol: 'HDFC', qty: 8, ltp: 1600 },
  ],
};

// --------------------------
// Navigation / Sidebar removed
// --------------------------
// const Sidebar = ({ onSelect, selected }) => { ... };

const ChartCard = ({ title = 'Default Chart Title', 
  data = { labels: [], values: [] } }) => (
  <View style={styles.chartCard}>
    <Text style={styles.cardTitle}>{title}</Text>
    <LineChart
      data={{ labels: data.labels, datasets: [{ data: data.values }] }}
      width={(screenWidth - 40)} // full width
      height={160}
      chartConfig={chartConfig}
      bezier
      style={{ borderRadius: 8 }}
    />
  </View>
);

const ChartGrid = () => (
  <View style={styles.chartGrid}>
    {chartsMock.map((c) => <ChartCard key={c.title} title={c.title}  />)}
  </View>
);

const PortfolioSummary = () => (
  <View style={styles.portfolioCard}>
    <Text style={styles.cardTitle}>Portfolio Summary</Text>
    <View style={styles.portfolioRow}>
      <Text>Total Value</Text>
      <Text>₹ {holdingsMock.totalValue.toLocaleString()}</Text>
    </View>
    <View style={styles.portfolioRow}>
      <Text>Day P/L</Text>
      <Text style={{ color: holdingsMock.dayPL >= 0 ? 'green' : 'red' }}>{holdingsMock.dayPL >= 0 ? '+' : ''}{holdingsMock.dayPL}%</Text>
    </View>

    <Text style={[styles.cardSubtitle, { marginTop: 12 }]}>Holdings</Text>
    <FlatList
      data={holdingsMock.items}
      keyExtractor={(i) => i.symbol}
      renderItem={({ item }) => (
        <View style={styles.holdItem}>
          <Text style={{ fontWeight: '600' }}>{item.symbol}</Text>
          <Text>{item.qty} • ₹{item.ltp}</Text>
        </View>
      )}
    />
  </View>
);

const OrderPanel = () => {
  const [symbol, setSymbol] = useState('RELIANCE');
  const [qty, setQty] = useState('1');
  const [price, setPrice] = useState('');

  const onPlaceOrder = (side: string) => {
    alert(`Order: ${side} ${qty} ${symbol} ${price ? '@' + price : '@ MARKET'}`);
  };

  return (
    <View style={styles.orderPanel}>
      <Text style={styles.cardTitle}>Place Order</Text>
      <TextInput style={styles.input} value={symbol} onChangeText={setSymbol} placeholder="Symbol" />
      <TextInput style={styles.input} value={qty} onChangeText={setQty} placeholder="Quantity" keyboardType="numeric" />
      <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="Price (optional)" keyboardType="numeric" />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => onPlaceOrder('BUY')}>
          <Text style={styles.btnText}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => onPlaceOrder('SELL')}>
          <Text style={styles.btnText}>Sell</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView style={styles.main} contentContainerStyle={{ padding: 12 }}>
        {/* <ChartCard title="Market Overview" data={data} /> */}
        <Text style={styles.sectionTitle}>Dashboard</Text>
        <ChartGrid />
        <PortfolioSummary />
        <OrderPanel />
      </ScrollView>
    </SafeAreaView>
  );
}

// Keep the same styles as before
