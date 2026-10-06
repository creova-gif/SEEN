import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PrototypeApp } from './src/PrototypeApp';
import { WebShell } from './src/WebShell';
import { PROTOTYPE_MODE } from './src/config';

export default function App() {
  if (PROTOTYPE_MODE) return <PrototypeApp />;
  return (
    <SafeAreaProvider>
      <WebShell />
    </SafeAreaProvider>
  );
}
