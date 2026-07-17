import { FlatList, View } from 'react-native';
import { getCircuits } from '@temple/content';
import CircuitCard from '../../components/CircuitCard';
import { useLocale } from '../../lib/locale';

export default function Yatra() {
  const { locale } = useLocale();
  const circuits = getCircuits(locale);

  return (
    <FlatList
      data={circuits}
      keyExtractor={(circuit) => circuit.id}
      contentContainerStyle={{ padding: 20 }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => <CircuitCard circuit={item} />}
    />
  );
}
