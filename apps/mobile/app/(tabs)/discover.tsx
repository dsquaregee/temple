import { FlatList, View } from 'react-native';
import { getTemples } from '@temple/content';
import TempleCard from '../../components/TempleCard';
import { useLocale } from '../../lib/locale';

export default function Discover() {
  const { locale } = useLocale();
  const temples = getTemples(locale);

  return (
    <FlatList
      data={temples}
      keyExtractor={(temple) => temple.id}
      contentContainerStyle={{ padding: 20 }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => <TempleCard temple={item} />}
    />
  );
}
